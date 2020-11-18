import React, {useState, useEffect} from 'react';
import { Button, View, Text, Image, StyleSheet , TouchableOpacity, Dimensions, SafeAreaView, Modal, BackHandler} from 'react-native';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'   // yarn add react-native-expo-image-cropper
import * as Permissions from 'expo-permissions'
import Icon from 'react-native-vector-icons/MaterialIcons'

// TODO: disable swipe right menu in this window

export default class App extends React.Component {
    state = {
        showModal: false,
        uri: null,
        isLoading: true,
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // everytime user opens this tab open camera
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
                this.setState({
                    uri: result.uri,
                }, () => this.setState({ showModal: true }))
            }else{
                this.props.navigation.goBack();
            }
        }
    };

    render() {
        const { uri, showModal } = this.state
        const { width, height } = Dimensions.get('window')
        const { navigation } = this.props;
        if(this.state.isLoading){
            return(
                <View style={styles.container}>
                    <View style={[styles.body, {alignItems:'center',justifyContent:'center'}]}>
                        <Image style={{width:128, height:128}} source={require('../assets/loading.gif')}/>
                    </View>
                </View>
            )
        }else{
            return (
                <SafeAreaView style={{backgroundColor: 'white', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1}}>                
                    <View style={{width: width, flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                        {uri ? (
                            <Image resizeMode="contain"
                                style={{
                                    width: '80%', height: '100%', marginBottom: 0, backgroundColor: '#fcfcfc',
                                }}
                                source={{ uri }}
                            />
                        ) : 
                        <Image resizeMode={'contain'} source={require('../assets/icon.png')} style={{alignSelf: 'center', width: '80%', height: '100%'}} />
                        }
                    </View>
                    <TouchableOpacity onPress={() => this._pickImage()} style={{marginTop: 20, width: 200, borderRadius: 10, height: 60, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                        <Icon size={30} name="photo" color="white" />
                        <Text style={{ color: 'white', fontSize: 18 }}>Galery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._pickCameraImage()} style={{marginTop: 20, borderRadius: 10, width: 200, height: 60, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}>
                        <Icon size={30} name="photo-camera" color="white" />
                        <Text style={{ color: 'white', fontSize: 18 }}>Photo</Text>
                    </TouchableOpacity>
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
                </SafeAreaView>
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
        justifyContent: 'flex-end',
        marginBottom: 25
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
    }
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