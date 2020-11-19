import React, {useState, useEffect} from 'react';
import { Button, FlatList, View, Text, Image, StyleSheet , TouchableOpacity, Dimensions, SafeAreaView, Modal, BackHandler, Picker} from 'react-native';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'   // yarn add react-native-expo-image-cropper
import * as Permissions from 'expo-permissions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { color } from 'react-native-reanimated';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';

// TODO: disable swipe right menu in this window

export default class App extends React.Component {
    state = {
        showModal: false,
        uri: null,
        isLoading: true,
        selectingShop: false,
        shop: '',
        selectedItem: null
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // everytime user opens this tab open camera
            this.setState({isLoading:true})
            this.setState({selectingShop: false})
            this._pickCameraImage.call();
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
      }



    _pickCameraImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync()

            if (!result.cancelled) {
                // non-cropped photo taken, now we need to scan the shop and then proceed to crop the products    
                // set state to picking shop and pre-selected shop to scanned shop       
                this.setState({
                    uri: result.uri,
                    selectingShop: true
                    //selectedItem = scannedShop id
                })     
                /*this.setState({
                    uri: result.uri,
                }, () => this.setState({ showModal: true }))*/
            }else{
                this.props.navigation.goBack();
            }
        }
    };



    

    render() {
        const { uri, showModal } = this.state;
        const { width, height } = Dimensions.get('window');
        const { navigation } = this.props;
        
        if(this.state.selectingShop){
            return(
                <View style={styles.container}>
                    <View style={styles.body}>
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop:30}}>
                            <Text style={styles.titleText}>Please select the shop</Text>
                        </View>
                        
                        <View style={{marginTop:40}}>
                            <FlatList
                            extraData={this.state}
                            data={[
                                {key: 'IKI', id:1},
                                {key: 'MAXIMA', id:2},
                                {key: 'LIDL', id:3},
                                {key: 'NORFA', id:4},
                                {key: 'RIMI', id:5}
                            ]}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => {
                                    this.setState({ selectedItem: item.id })
                                    }}>
                                    <Text 
                                    style={this.state.selectedItem === item.id ? styles.selectedItem : styles.item}
                                    >{item.key}</Text>
                                </TouchableOpacity>
                            )}
                            />
                        </View>
                        
                        <View style={styles.buttonOnBot}>
                            <TouchableOpacity style={{width:'100%'}}>
                                <View style={styles.btnStyle}>
                                    <Text style = {{color: 'white'}}>Confirm</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
                
            )
        }
        else if(this.state.isLoading){
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}>
                        <Image style={{width:128, height:128}} source={require('../assets/loading.gif')}/>
                    </View>
                </View>
            )
        }
        else{
            return (
                <View style={styles.container}>                
                    <View style={styles.body}>
                        <Image source={{uri}} style={styles.scannedImg}>

                        </Image>
                    </View>
                    {
                        uri
                    && (
                        <ExpoImageManipulator
                            photo={{ uri }}
                            isVisible={showModal}
                            onPictureChoosed={(data) => {
                                this.setState({ uri: data.uri })
                            }}
                            onToggleModal={() => this.setState({ showModal: !showModal })}
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
        
    }
}

//export default ScanScreen;

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
        backgroundColor: '#fff',
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
        backgroundColor: '#1c1c1c',
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
        fontSize: 20
    },
    item: {
        backgroundColor: '#e4e8f0',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
    selectedItem: {
    backgroundColor: '#c4fabe',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    },
});


/*    const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      
    });

    

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                {image && <Image source={{ uri: image}} style={styles.scannedImg} />}
                <View style={[styles.buttonOnBot, styles.buttonStyle]}>
                    <TouchableOpacity onPress = {takeImage}>
                        <View style={styles.btnStyle}>
                            <Text style = {{color: 'white'}}>Scan Receipt</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );*/