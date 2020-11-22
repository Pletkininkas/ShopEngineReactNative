import React, {useState, useEffect} from 'react';
import { Button, View, Text, Image, StyleSheet , TouchableOpacity} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'    // expo install expo-image-picker

import configColors from '../config/colors';
import styles from '../config/styles';
import { color } from 'react-native-reanimated';

const ScanScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    //const theme = useTheme();
    //const {colors} = useTheme();

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
        <View style={styles().container}>
            <View style={styles().body}>
                {image && <Image source={{ uri: image}} style={{width:200, height:200, resizeMode:"contain"}} />}
                <View style={[styles().buttonOnBot, styles().buttonStyle]}>
                    <TouchableOpacity onPress = {pickImage}>
                        <View style={styles().btnStyle} borderColor={configColors.secondary}>
                            <Text style = {{color: configColors.secondary}}>Scan Receipt</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ScanScreen;