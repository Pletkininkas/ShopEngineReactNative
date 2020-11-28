import React, {useState, useEffect} from 'react';
import { Button, LayoutAnimation, UIManager, ToastAndroid, FlatList, View, Text, Image, StyleSheet , TouchableOpacity, Dimensions, SafeAreaView, Modal, BackHandler, Picker} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'   // yarn add react-native-expo-image-cropper
import * as Permissions from 'expo-permissions'
import { Swipeable } from 'react-native-gesture-handler';
import SwipeRow from '../components/SwipeRow'



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
    

    const theme = useTheme();
    const shops = [
        {key: 'IKI', id:1},
        {key: 'MAXIMA', id:2},
        {key: 'LIDL', id:3},
        {key: 'NORFA', id:4},
        {key: 'RIMI', id:5}
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
                navigation.goBack();
            } 
        }
    };

    const _onShopConfirmPress = () =>
    {
        if(shop != ''){
            setSelectingShop(false)
            setShowModal(true)
        }else{
            if (Platform.OS === 'android') {
                ToastAndroid.show('Please select the shop', ToastAndroid.SHORT)
            } else {
                Alert.alert('Please select the shop');
            }
        }
    }


    const _readImage = async (par) =>{
        setUri(par.uri)
        setLoadingMsg('Reading image...')
        /*setShowList(true);
        setScannedList([
            {
                name: 'Obuoliai',
                price: 2.58,
                discount: -0.36,
                id:0
                },
                {
                name: 'Bananai',
                price: 0.99,
                discount: -0.21,
                id:1
                },
                {
                    name: 'Dvaro pienas 15%',
                    price: 2.49,
                    discount: null,
                    id:2
                },
                {
                    name: 'Vilniaus duona juoda',
                    price: 0.59,
                    discount: null,
                    id:3
                },
                {
                    name: 'Ananasas',
                    price: 3.39,
                    discount: null,
                    id:4
                },
                {
                    name: 'Šokoladas MILKA',
                    price: 2.99,
                    discount: -0.17,
                    id:5
                },
                {
                name: 'Obuoliai',
                price: 2.58,
                discount: -0.36,
                id:6
                },
                {
                name: 'Bananai',
                price: 0.99,
                discount: -0.21,
                id:7
                },
                {
                    name: 'Dvaro pienas 15%',
                    price: 2.49,
                    discount: null,
                    id:8
                },
                {
                    name: 'Vilniaus duona juoda',
                    price: 0.59,
                    discount: null,
                    id:9
                },
                {
                    name: 'Ananasas',
                    price: 3.39,
                    discount: null,
                    id:10
                },
                {
                    name: 'Šokoladas MILKA',
                    price: 2.99,
                    discount: -0.17,
                    id:11
                },
                {
                name: 'Obuoliai',
                price: 2.58,
                discount: -0.36,
                id:12
                },
                {
                name: 'Bananai',
                price: 0.99,
                discount: -0.21,
                id:13
                },
                {
                    name: 'Dvaro pienas 15%',
                    price: 2.49,
                    discount: null,
                    id:14
                },
                {
                    name: 'Vilniaus duona juoda',
                    price: 0.59,
                    discount: null,
                    id:15
                },
                {
                    name: 'Ananasas',
                    price: 3.39,
                    discount: null,
                    id:16
                },
                {
                    name: 'Šokoladas MILKA',
                    price: 2.99,
                    discount: -0.17,
                    id:17
                },
        ])*/

        let datajson = await _getScannedListAsync(par.uri);
        var data = []
        for(var i in datajson){
            data.push(datajson[i])
            data[i].id = i
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

    const _onListConfirmPress = () =>
    {
        // save the products to history and compare them to other shops
        setShowList(false)
        setLoadingMsg('Comparing prices...')
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
            'https://6c653639604f.ngrok.io/ocr', {
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
                    <FlatList style={{width:'100%', marginBottom:80}}
                       // extraData={state}
                        data={scannedList}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <SwipeRow item = {item} key = {item.id} onSwipe={() => delFromArr(item.id)} swipeThreshold={-200}>
                                <View style={styles.productItem}>
                                    <Text style={{fontWeight:'bold', marginRight:5, flex:6}}>{item.name}</Text>
                                    <Text style={{marginLeft:'auto', flex:2}}>{item.price.toFixed(2)} €</Text>
                                    <Text style={{marginLeft:'auto', color:'green', flex:2}}>{item.discount != 0 ? item.discount.toFixed(2) + '€' : ''}</Text>
                                </View>
                            </SwipeRow>
                        )}
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
        }else if(showFailMsg){
            return(
            <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}  backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
                        <Image style={{width:128, height:128}} source={require('../assets/sadface.png')}/>
                        <Text style={{color:'red', margin:50, textAlign:'center'}}> Couldn't find any products. {"\n"}{"\n"} Please try taking a better
                        photo of the receipt and crop only the products and their prices. </Text>
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
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    body: {
        flex: 0,
        flexGrow: 1,
        flexDirection: "column",
        //backgroundColor: '#fff',
        height: '95%',
        width: '95%',
        marginTop: 10,
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
    }
});
