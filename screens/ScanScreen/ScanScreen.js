import React, {useState, useEffect} from 'react';
import { Button, LayoutAnimation, UIManager, ToastAndroid, FlatList, View, Text, Image, StyleSheet , TouchableOpacity, Dimensions, SafeAreaView, Modal, BackHandler, Picker} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker
//import { ExpoImageManipulator } from 'react-native-expo-image-cropper'   // yarn add react-native-expo-image-cropper
import * as Permissions from 'expo-permissions'
import {Asset} from 'expo-asset'
import {SwipeListView} from 'react-native-swipe-list-view'
import config from '../../config'
import styles from './styles.js'
import State from './state.js'
import { ImageManipulator } from 'expo-image-crop'





if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const ScanScreen = ({ navigation }) => {
    const[uri, setUri] = useState(null)
    const[loadingMsg, setLoadingMsg] = useState('Please wait')
    const[shop, setShop] = useState('')
    const[selectedItem, setSelectedItem] = useState(null)
    const[scannedList, setScannedList] = useState([])
    const[compareList, setCompareList] = useState(null)
    const[isEmptyComparedList, setIsEmptyComparedList] = useState(false)
    const[screenState, setScreenState] = useState(State.ScreenState.pickingPhotoMethod)
    
    

    const theme = useTheme();
    const faceUri = Asset.fromModule(require('../../assets/sadface.png')).uri;
    const whiteFaceUri = Asset.fromModule(require('../../assets/sadfacewhite.png')).uri;
    const shops = [
        {key: 'IKI', id:1, uri:Asset.fromModule(require('../../assets/shop_logos/IKI.png')).uri},
        {key: 'MAXIMA', id:2, uri:Asset.fromModule(require('../../assets/shop_logos/MAXIMA.png')).uri},
        {key: 'LIDL', id:3, uri:Asset.fromModule(require('../../assets/shop_logos/LIDL.png')).uri},
        {key: 'NORFA', id:4, uri:Asset.fromModule(require('../../assets/shop_logos/NORFA.png')).uri},
        {key: 'RIMI', id:5, uri:Asset.fromModule(require('../../assets/shop_logos/RIMI.png')).uri},
    ]


     useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setShop('')
            setLoadingMsg('Please wait')
            setSelectedItem(null)
            setCompareList(null)
            setIsEmptyComparedList(false)
            setScreenState(State.ScreenState.pickingPhotoMethod)
            
        });

        return unsubscribe;
    }, [navigation]);


    const _takePhotoAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync()

            if (!result.cancelled) {
                // non-cropped photo taken, now we need to scan the shop and then proceed to crop the products    
                // set state to picking shop and pre-selected shop to scanned shop 
                setUri(result.uri)
                setScreenState(State.ScreenState.selectingShop)    
                    
                //selectedItem = scannedShop id
                     
            }else{
                navigation.navigate('Home');
            } 
        }
    };

    const _pickPhotoAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync()

            if (!result.cancelled) {
                // non-cropped photo taken, now we need to scan the shop and then proceed to crop the products    
                // set state to picking shop and pre-selected shop to scanned shop 
                setUri(result.uri)
                setScreenState(State.ScreenState.pickingPhotoMethod)   
                    
                //selectedItem = scannedShop id
                     
            }else{
                navigation.navigate('Home');
            } 
        }
    };

    const _onShopConfirmPress = () =>
    {
        if(shop != ''){
            setScreenState(State.ScreenState.showCrop)
        }else{
            _showToast('Please select the shop')
        }
    }

    const _showToast = (message) =>
    {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            Alert.alert(message);
        }
    }

    const _readImage = async (pUri) =>{
        setUri(pUri)
        setLoadingMsg('Reading image...')
        setScreenState(State.ScreenState.showLoading)

        let datajson = await _getScannedListAsync(pUri);
        var data = []
        for(var i in datajson){
            data.push(datajson[i])
            data[i].id = i
            data[i].shop = shop
        }
        try{
            if(data.length < 1){
                setScreenState(State.ScreenState.showFailMsg)
            }else{
                setScannedList(data)
                setScreenState(State.ScreenState.showList)
            }
        }catch(error){
            console.log(error)
            setScreenState(State.ScreenState.showFailMsg)
        }
        
    }


    const delFromArr = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        setScannedList(scannedList.filter(item => item.id !== id));
        
    }

    function getShopId(shopName){
        for (var i = 0; i < shops.length; i++){
            if(shops[i].key === shopName){
                return shops[i].id;
            }
        }
        return 1;
    }

    const _onCompareListConfirm = async () =>
    {
        navigation.navigate('Home');
    }

    const _onListConfirmPress = async () =>
    {
        // save the products to history and compare them to other shops

        if(scannedList.length <= 0){
            _showToast("No products to compare!")
            navigation.navigate('Home');
            return
        }
        setScreenState(State.ScreenState.showLoading)
        setLoadingMsg('Comparing prices...')
        let result = await _getBetterPricedItemsAsync();
        let data = []
        for(var i in result){
            data.push(result[i])
            data[i].id = i
        }

        if(data.length <= 0){
            setScreenState(State.ScreenState.showFailMsg)
            setIsEmptyComparedList(true)
        }else{
            setCompareList(data)
            setScreenState(State.ScreenState.showCompareList)
        }
    }

    const _getBetterPricedItemsAsync = async () => {
        try {
            let response = await fetch(
                config.API_URL + 'ocr/compare', {
              method: 'POST',
              headers: {
                  Accept: "application/json",
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(scannedList)
              }
            );
            let json = await response.json();
            console.log("--------------")
            console.log(json)
            return json;
          } catch (error) {
            console.error('ERROR:' + error);
          }
    }

    const _getScannedListAsync = async (u) => {
        let filename = u.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let imageType = match ? `image/${match[1]}` : `image`;
        var photo = { 
            uri: u,
            type: imageType,
            name: filename,
        }
        var form = new FormData();
        form.append("scannedPhoto", photo);
        try {
          let response = await fetch(
            config.API_URL + 'ocr/read', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': 'multipart/form-data'
            },
            body: form
            }
          );
          let json = await response.json();
          console.log(json)
          return json;
        } catch (error) {
          console.error('ERROR:' + error);
        }
      };
      
        const {selectingShop, showList, showCompareList, showLoading, showFailMsg, pickingPhotoMethod, showCrop} = State.ScreenState;
        switch (screenState){
            case selectingShop:
                return(
                    <View style={styles.container}>
                        <View style={styles.body}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                            <View style={{alignItems: 'center', justifyContent: 'center', marginTop:30}}>
                                <Text style={styles.titleText}>Please select the shop</Text>
                            </View>
                            
                            <View style={{marginTop:40}}>
                                <FlatList
                            // extraData={state}
                                data={shops}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => {
                                        setSelectedItem(item.id)
                                        setShop(item.key)
                                        }}>
                                        <Text 
                                        style={selectedItem === item.id ? styles.selectedItem : styles.item}
                                        >{item.key}</Text>
                                    </TouchableOpacity>
                                )}
                                />
                            </View>
                            
                            <View style={styles.buttonOnBot}>
                                <TouchableOpacity style={{width:'100%'}} onPress={() => _onShopConfirmPress()}>
                                    <View style={styles.btnStyle}>
                                        <Text style = {{color: 'white'}}>Confirm</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </View>
                    
                )
        
        case showCrop:
            return (
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <Image style={{width:128, height:128}} source={require('../../assets/loading.gif')}/>
                        <Text style={{color:'green'}}> {loadingMsg} </Text>
                    </View>    
                    <ImageManipulator
                        photo={{ uri }}
                        isVisible={true}
                        onPictureChoosed={({ uri: uriM }) => _readImage(uriM)}
                        onToggleModal={() => {}}
                    />       
                    
                    
                </View>
            )
                
            case showList:
                return (
                    <View style={styles.container}>
                        <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <SwipeListView style={{width:'100%', marginBottom:80}}
                        // extraData={state}
                            disableRightSwipe
                            data={scannedList}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => (
                                    <View style={styles.productItem}>
                                        <Text style={{fontWeight:'bold', marginRight:5, flex:6}}>{item.name}</Text>
                                        <Text style={{marginLeft:'auto', flex:2}}>{item.price.toFixed(2)} €</Text>
                                        <Text style={{marginLeft:'auto', color:'green', flex:2}}>{item.discount != 0 ? item.discount.toFixed(2) + '€' : ''}</Text>
                                    </View>
                            )}
                            renderHiddenItem={ ({item}) => (
                                <View style={[styles.productItem, {backgroundColor:'indianred'}]}>
                                    <TouchableOpacity style={styles.backRightBtn} onPress={() => delFromArr(item.id)}>
                                        <Ionicons name='ios-trash' size={50}/>
                                    </TouchableOpacity>
                                </View>
                            )}
                            rightOpenValue={-75}
                            />
                        </View>
                        <View style={styles.buttonOnBot}>
                                <TouchableOpacity style={{width:'95%'}} onPress={() => _onListConfirmPress()}>
                                    <View style={styles.btnStyle}>
                                        <Text style = {{color: 'white'}}>Confirm</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                    </View>
                    
                )
        case showCompareList:
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                    <FlatList style={{width:'100%', marginBottom:80}}
                       // extraData={state}
                        data={compareList}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <View style={[styles.productItem, {alignItems:'center', justifyContent:'center'}]}>
                                <Text style={{fontWeight:'bold', textAlignVertical:'center', marginRight:5, flex:6}}>{item.name}{'\n'}{'\n'}<Text style={{fontWeight:'normal',color:'black'}}>{item.worsePrice.toFixed(2)} €</Text></Text>
                                <Text style={{marginLeft:'auto', textAlignVertical:'center' ,flex:3, fontWeight:'bold'}}><Text style={{fontWeight:'bold',color:'green'}}>{(item.price - item.worsePrice).toFixed(2)} €</Text>   in</Text>
                                <Image style={{marginLeft:'auto', flex:2, width:40, height:40, resizeMode:'contain'}} resizeMethod="resize" source={{uri:shops[getShopId(item.shop)-1].uri}} />
                            </View>
                        )}
                        />
                        <View style={styles.buttonOnBot}>
                            <TouchableOpacity style={{width:'95%'}} onPress={() => _onCompareListConfirm()}>
                                <View style={styles.btnStyle}>
                                    <Text style = {{color: 'white'}}>Continue</Text>
                                </View>
                            </TouchableOpacity>
                         </View>
                    </View>
                </View>
            )
        
        case pickingPhotoMethod:
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <TouchableOpacity style={{width:'80%', marginBottom:20}} onPress={() => _takePhotoAsync()}>
                            <View style={[styles.btnStyle, {flexDirection:'row'}]}>
                                <Ionicons name='ios-camera' size={50} style={{marginRight:15}}/>
                                <Text style={{color: 'white',fontWeight:'bold'}}>Take a photo</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={{alignItems:'center', justifyContent:'center', fontSize:24, color:theme.dark ? 'white' : 'black'}}>OR</Text>

                        <TouchableOpacity style={{width:'80%', marginTop:20}} onPress={() => _pickPhotoAsync()}>
                            <View style={[styles.btnStyle, {flexDirection:'row'}]}>
                                <Ionicons name='ios-image' size={50} style={{marginRight:15}}/>
                                <Text style = {{color: 'white',fontWeight:'bold'}}>Pick a photo from gallery</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        case showFailMsg:
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <Image style={{width:128, height:128}} source={{uri:theme.dark ? whiteFaceUri : faceUri}}/>
                        {isEmptyComparedList ? <Text style={{color:'red', margin:50, textAlign:'center'}}> Couldn't find any better prices in other shops!</Text>
                        :
                        <Text style={{color:'red', margin:50, textAlign:'center'}}> Couldn't find any products. {"\n"}{"\n"} Please try taking a better
                        photo of the receipt and crop only the products and their prices. </Text>}
                    </View>
                </View>
            )
        default:
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <Image style={{width:128, height:128}} source={require('../../assets/loading.gif')}/>
                        <Text style={{color:'green'}}> {loadingMsg} </Text>
                    </View>
                </View>
            )
        
    }

}
export default ScanScreen;
