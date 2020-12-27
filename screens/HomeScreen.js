import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';
import config, { user } from '../config';
import ImagePicker from 'react-native-image-picker';

//import configColors from '../config/colors';
import styles from '../config/styles';

const HomeScreen = ({ navigation }) => {
  
  const [receivedImg, setReceivedImg] = React.useState('');

  useEffect(() => {
    //postImage();

    //const interval=setInterval(()=>{
    //  fetchImage()
    //    },10000)
            
            
    //return()=>clearInterval(interval)
  }, [receivedImg]);

  const postImage = () => {
    let token = user.token;
    let data = {
      "Image": '',
      "ImageType": "Profile",
      "UserUpdateType": "Image"
    }
    fetch(config.API_URL+'user', {
      method: 'POST',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
      }
    }).then(data => {
      return data.json();
      })
      .catch(err => {
      console.log(err);
    });
  }


  const fetchImage = () => {
    let token = user.token;
    fetch(config.API_URL+'user', {
      method: 'GET',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
      }
    }).then(data => {
      return data.json();
      })
      .then(data => {
        console.log(data);
        setReceivedImg(data.data.imageData);
      })
      .catch(err => {
      console.log(err);
    });
  }
  
  //const theme = useTheme();
  //const {colors} = useTheme();

  return (
    <View style={styles().containerm}>        
        <View style={styles().body}>          
          </View>
    </View>

  );
};

export default HomeScreen;
