import React, {useState, useEffect} from 'react';
import { Button, LayoutAnimation, UIManager, ToastAndroid, FlatList, View, Text, Image, StyleSheet , TouchableOpacity, Dimensions, SafeAreaView, Modal, BackHandler, Picker} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'   // yarn add react-native-expo-image-cropper
import * as Permissions from 'expo-permissions'
import {Asset} from 'expo-asset'
import {SwipeListView} from 'react-native-swipe-list-view'
import config from '../config'





if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const ScanScreen = ({ navigation }) => {
    const[showModal, setShowModal] = useState(false)
    const[uri, setUri] = useState(null)
    const[isLoading, setIsLoading] = useState(true)
    const[loadingMsg, setLoadingMsg] = useState('Please wait')
    const[selectingShop, setSelectingShop] = useState(false)
    const[shop, setShop] = useState('')
    const[selectedItem, setSelectedItem] = useState(null)
    const[scannedList, setScannedList] = useState([])
    const[showList, setShowList] = useState(false);
    const[showFailMsg, setShowFailMsg] = useState(false);
    const[showCompareList, setShowCompareList] = useState(false);
    const[compareList, setCompareList] = useState(null)
    const[isEmptyComparedList, setIsEmptyComparedList] = useState(false)
    
    

    const theme = useTheme();
    const faceUri = Asset.fromModule(require('../assets/sadface.png')).uri;
    const whiteFaceUri = Asset.fromModule(require('../assets/sadfacewhite.png')).uri;
    const shops = [
        {key: 'IKI', id:1, uri:Asset.fromModule(require('../assets/shop_logos/IKI.png')).uri},
        {key: 'MAXIMA', id:2, uri:Asset.fromModule(require('../assets/shop_logos/MAXIMA.png')).uri},
        {key: 'LIDL', id:3, uri:Asset.fromModule(require('../assets/shop_logos/LIDL.png')).uri},
        {key: 'NORFA', id:4, uri:Asset.fromModule(require('../assets/shop_logos/NORFA.png')).uri},
        {key: 'RIMI', id:5, uri:Asset.fromModule(require('../assets/shop_logos/RIMI.png')).uri},
    ]


     useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setShop('')
            setShowList(false)
            setIsLoading(true)
            setSelectingShop(false)
            setLoadingMsg('Please wait')
            setSelectedItem(null)
            setShowFailMsg(false)
            setShowCompareList(false)
            setCompareList(null)
            setIsEmptyComparedList(false)

            _pickCameraImage.call();
        });

        return unsubscribe;
    }, [navigation]);


    const _pickCameraImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync()

            if (!result.cancelled) {
                // non-cropped photo taken, now we need to scan the shop and then proceed to crop the products    
                // set state to picking shop and pre-selected shop to scanned shop 
                setUri(result.uri)
                setSelectingShop(true)      
                    
                //selectedItem = scannedShop id
                     
            }else{
                navigation.navigate('Home');
            } 
        }
    };

    const _onShopConfirmPress = () =>
    {
        if(shop != ''){
            setSelectingShop(false)
            setShowModal(true)
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

    const _readImage = async (par) =>{
        setUri(par.uri)
        setLoadingMsg('Reading image...')

        let datajson = await _getScannedListAsync(par.uri);
        var data = []
        for(var i in datajson){
            data.push(datajson[i])
            data[i].id = i
            data[i].shop = shop
        }
        try{
            if(data.length < 1){
                setShowFailMsg(true);
            }else{
                setScannedList(data)
                setShowList(true)
            }
        }catch(error){
            console.log(error)
            setShowFailMsg(true);
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
        setShowList(false)
        setLoadingMsg('Comparing prices...')
        let result = await _getBetterPricedItemsAsync();
        let data = []
        for(var i in result){
            data.push(result[i])
            data[i].id = i
        }

        if(data.length <= 0){
            setShowFailMsg(true)
            setIsEmptyComparedList(true)
        }else{
            setCompareList(data)
            setShowCompareList(true)
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

        if(selectingShop){
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
        }
        else if(showModal){
            return (
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <Image style={{width:128, height:128}} source={require('../assets/loading.gif')}/>
                        <Text style={{color:'green'}}> {loadingMsg} </Text>
                    </View>           
                    {
                        uri
                    && (
                        <ExpoImageManipulator
                            photo={{ uri }}
                            isVisible={showModal}
                            onPictureChoosed={(data) => _readImage(data)}
                            onToggleModal={() => setShowModal(!showModal)}
                            saveOptions={{
                                compress: 1,
                                format: 'jpeg',
                                base64: true,
                            }}
                            
                        />
                    )
                    }
                </View>
            )
                }
            else if(showList){
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
        }else if(showCompareList){
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
        }
        else if(showFailMsg){
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
        }
        else{
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <Image style={{width:128, height:128}} source={require('../assets/loading.gif')}/>
                        <Text style={{color:'green'}}> {loadingMsg} </Text>
                    </View>
                </View>
            )
        }
        
    }


export default ScanScreen;


const styles = StyleSheet.create({
    backRightBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        width: 40,
    },
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#1db954',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        paddingTop: 10,
        paddingBottom: 0
    },
    body: {
        flex: 0,
        flexGrow: 1,
        flexDirection: "column",
        height: '100%',
        width: '95%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: '#000'
    },
    buttonOnBot:{
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
        
    },
    btnStyle:{
        backgroundColor: '#1db954',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 15,
        marginLeft: 10,
        marginRight: 10
    },
    scannedImg:{
        flex:1,
        resizeMode:"contain"
    },
    titleText:{
        fontSize: 20,
        color:'#1db954'
    },
    item: {
        backgroundColor: '#1db954',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
      },
    selectedItem: {
        backgroundColor: '#0a421e',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
    },
    productItem:{
        flex:1,
        flexDirection:'row',
        backgroundColor: '#dce0dd',
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 10
    },

});

