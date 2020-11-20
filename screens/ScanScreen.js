import React, {useState, useEffect} from 'react';
import { Button, View, Text, Image, StyleSheet , TouchableOpacity} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker

const ScanScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const theme = useTheme();

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

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

    return (
        <View style={styles.container}>
            <View style={styles.body} backgroundColor={theme.dark ? '#1c1c1c' : '#fff' }>
                {image && <Image source={{ uri: image}} style={{width:200, height:200, resizeMode:"contain"}} />}
                <View style={[styles.buttonOnBot, styles.buttonStyle]}>
                    <TouchableOpacity onPress = {pickImage}>
                        <View style={styles.btnStyle} borderColor={theme.dark ? '#fff' : '#1c1c1c' }>
                            <Text style = {{color: 'white'}}>Scan Receipt</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

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
        flex: 1,
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
        marginRight: 10,
        borderWidth: 1
    }
});