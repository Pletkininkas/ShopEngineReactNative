import React, {useState, useEffect} from 'react';
import { Button, FlatList, View, Text, Image, StyleSheet , TouchableOpacity, Dimensions, SafeAreaView, Modal, BackHandler, Picker} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'   // yarn add react-native-expo-image-cropper
import * as Permissions from 'expo-permissions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { color } from 'react-native-reanimated';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';


// TODO: disable swipe right menu in this window


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

    const theme = useTheme();

     useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setShowList(false)
            setIsLoading(true)
            setSelectingShop(false)
            setLoadingMsg('Please wait')
            setSelectedItem(null)
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
                     
                /*this.setState({
                    uri: result.uri,
                }, () => this.setState({ showModal: true }))*/
            }else{
                navigation.goBack();
            }
        }
    };

    const _onShopConfirmPress = () =>
    {
        setSelectingShop(false)
        setShowModal(true)
    }


    const _readImage = (data) =>{
        setUri(data.uri)
        setLoadingMsg('Reading image...')
        setShowList(true);
        setScannedList([
            {
                name: 'Obuoliai',
                price: 2.58,
                discount: -0.36
                },
                {
                name: 'Bananai',
                price: 0.99,
                discount: -0.21
                },
                {
                    name: 'Dvaro pienas 15%',
                    price: 2.49,
                    discount: null
                },
                {
                    name: 'Vilniaus duona juoda',
                    price: 0.59,
                    discount: null
                },
                {
                    name: 'Ananasas',
                    price: 3.39,
                    discount: null
                },
                {
                    name: 'Šokoladas MILKA',
                    price: 2.99,
                    discount: -0.17
                },
                {
                name: 'Obuoliai',
                price: 2.58,
                discount: -0.36
                },
                {
                name: 'Bananai',
                price: 0.99,
                discount: -0.21
                },
                {
                    name: 'Dvaro pienas 15%',
                    price: 2.49,
                    discount: null
                },
                {
                    name: 'Vilniaus duona juoda',
                    price: 0.59,
                    discount: null
                },
                {
                    name: 'Ananasas',
                    price: 3.39,
                    discount: null
                },
                {
                    name: 'Šokoladas MILKA',
                    price: 2.99,
                    discount: -0.17
                },
                {
                name: 'Obuoliai',
                price: 2.58,
                discount: -0.36
                },
                {
                name: 'Bananai',
                price: 0.99,
                discount: -0.21
                },
                {
                    name: 'Dvaro pienas 15%',
                    price: 2.49,
                    discount: null
                },
                {
                    name: 'Vilniaus duona juoda',
                    price: 0.59,
                    discount: null
                },
                {
                    name: 'Ananasas',
                    price: 3.39,
                    discount: null
                },
                {
                    name: 'Šokoladas MILKA',
                    price: 2.99,
                    discount: -0.17
                },
        ])

        // fetch data from api
        
    }

    const _onListConfirmPress = () =>
    {
        // save the products to history and compare them to other shops
        setShowList(false)
        setLoadingMsg('Comparing prices...')
    }

        //const { uri, showModal } = this.state;
        const { width, height } = Dimensions.get('window');
        //const { navigation } = this.props;

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
                            data={[
                                {key: 'IKI', id:1},
                                {key: 'MAXIMA', id:2},
                                {key: 'LIDL', id:3},
                                {key: 'NORFA', id:4},
                                {key: 'RIMI', id:5}
                            ]}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => {
                                    setSelectedItem(item.id)
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
                                format: 'png',
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
                        renderItem={({item}) => (
                            <View style={styles.productItem}>
                                <Text style={{fontWeight:'bold', flex:6}}>{item.name}</Text>
                                <Text style={{marginLeft:'auto', flex:2}}>{item.price}</Text>
                                <Text style={{marginLeft:'auto', color:'green', flex:1}}>{item.discount}</Text>
                            </View>
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
