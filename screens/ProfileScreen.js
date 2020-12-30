import React from 'react'
import Modal from 'react-native-modal';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  ImageBackground,
  ToastAndroid
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../components/context';

import config, { defaultImages, user } from '../config';

const ProfileScreen = () =>  {
  const theme = useTheme();
  const textColor = theme.dark ? '#fff' : '#000';

  const [optionSelected, setOptionSelected] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [uploadImageUri, setUploadImageUri] = React.useState('');
  const [notSelected, setNotSelected] = React.useState(false);
  const [notSelectedInformationText, setNotSelectedInformationText] = React.useState('Please select image.');

  const [data, setData] = React.useState ({
    password: '',
    check_textInputChange: false,
    secureTextEntry: true
  });

  const { signOut } = React.useContext(AuthContext);

  const displayConfirm = (command) => {
    switch(command) {
      case 'changeAvatar':
        setSelectedOption(command);
        setOptionSelected(true);
        break;
      case 'changePassword':
        setSelectedOption(command);
        setOptionSelected(true);
        break;
      case 'deleteAccount':
        setSelectedOption(command);
        setOptionSelected(true);
        break;
      default:
        setSelectedOption('');
        setOptionSelected(false);
        break;
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setUploadImageUri(result.base64);
      setNotSelected(false);
    }
  };

  const uploadProfileImage = async () => {
    if (uploadImageUri != '') {
      let token = user.token;
      try {
        let response = await fetch(
            config.API_URL + 'user', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          },
          body: '{\"Image\":\"'+uploadImageUri+'\",\"ImageType\":\"Profile\",\"UserUpdateType\":\"Image\"}'
          }
        );
        let json = await response.json();
        setNotSelectedInformationText(json.message);
        if (json.success) {
          user.profileImage = uploadImageUri;
          if (Platform.OS === 'android') {
            ToastAndroid.show('Image has been uploaded!', ToastAndroid.SHORT)
          } else {
              Alert.alert('Image has been uploaded!');
          }
        }
        setOptionSelected(false);
        setNotSelected(false);
        setUploadImageUri('');
      } catch (error) {
        console.error('ERROR:' + error);
        setNotSelectedInformationText('Unexpected error! Try again later.');
      }
    } else {
      setNotSelectedInformationText('Please select image.');
      setNotSelected(true);
    }
  };

  const confirmMenu = () => {
    switch(selectedOption) {
      case 'changeAvatar':
      return (
        <View style={styles.bodyContent}>
          <Text style={[styles.text_footer, {color: theme.dark ? themeColors.white : themeColors.dark}]}>Change Profile Picture</Text>
            <View style={styles.action}>
                <Text style={{color: theme.dark ? themeColors.white : themeColors.dark}}>Select image from gallery</Text>
            </View>
            <TouchableOpacity style={{
                height: 45,
                marginHorizontal: 20,
                marginTop: 20,
                width: "70%",
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom:5,
                borderRadius:10,
                backgroundColor: "#1db954",
                fontWeight: "bold"
            }} onPress={() => {pickImage()}}>
            <Text style={{color: textColor, flex: 0.55}}>Upload</Text> 
            </TouchableOpacity>
            { notSelected ? <Text style={[{fontSize: 10}, {color: theme.dark ? themeColors.white : themeColors.dark}]}>{notSelectedInformationText}</Text> : <></>}
            <View style={styles.modalBodyContent}>
              <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {uploadProfileImage()}}>
                <Text style={{color: textColor}}>Confirm</Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {setOptionSelected(false), Keyboard.dismiss(), setUploadImageUri(''), setNotSelected(false)}}>
                <Text style={{color: textColor}}>Cancel</Text> 
              </TouchableOpacity>
          </View>
        </View>
      );
      case 'changePassword':
      return (
        <View style={styles.bodyContent}>
          <Text style={[styles.text_footer, {color: theme.dark ? themeColors.white : themeColors.dark}]}>Change Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors='#05375a'
                        size={20}
                        style={{marginTop: 12}}
                    />
                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor= '#C7C7CD'
                        style={[styles.textInput, {color: theme.dark ? themeColors.white : themeColors.dark}]}
                        autoCapitalize="none"
                        onChangeText={(props)=> {setData({password: props}), console.log('naujas: '+props)}}
                    />
                    {data.check_textInputChange ?
                    <Animatable.View
                        animation="bounceIn"
                    >
                    <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                    </Animatable.View>
                    : null }
                </View>
          <View style={styles.modalBodyContent}>
            <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {ChangePassword(), Keyboard.dismiss()}}>
              <Text style={{color: textColor}}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {setOptionSelected(false), Keyboard.dismiss()}}>
              <Text style={{color: textColor}}>Cancel</Text> 
            </TouchableOpacity>
          </View>
        </View>
      );
      case 'deleteAccount':
      return (
        <View style={styles.bodyContent}>
          <Text style={[styles.text_footer, {color: theme.dark ? themeColors.white : themeColors.dark}]}>Deactivate Account</Text>
          <View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: textColor, fontSize:14, fontWeight:'400', textDecorationLine: 'underline'}}>{user.username}</Text>
                </View>
              </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors="#fff"
                        size={20}
                        style={{marginTop: 12}}
                    />
                </View>
            <View style={styles.modalBodyContent}>
            <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {setOptionSelected(false), DeleteUser(), Keyboard.dismiss()}}>
              <Text style={{color: textColor}}>Confirm</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {setOptionSelected(false), Keyboard.dismiss()}}>
              <Text style={{color: textColor}}>Cancel</Text> 
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  const DeleteUser = async () => {
    let token = user.token;
    var bodyData = {
      "UserUpdateType": "Deactivate"
    }
    let response = await fetch(config.API_URL+'user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(bodyData)
    }).then(data => {return data.json()})
    .catch(err => {
      Alert.alert(
        'Deactivate account - Error',
        'Could not deactivate account! Please try again shortly.',
        [
        { text: 'Okey', onPress: () => {signOut()} }
        ],
        { cancelable: false }
      );
      console.log(err);
    });

    if (response.success) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Account has been deleted!', ToastAndroid.SHORT)
      } else {
          Alert.alert('Account has been deleted!');
      }
      signOut();
    } else {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Account could not be deleted!', ToastAndroid.SHORT)
      } else {
          Alert.alert('Account could not be deleted!');
      }
    }
    setOptionSelected(false);
    setNotSelected(false);
  }

  const ChangePassword = async () => {
    let token = user.token;
    var bodyData = {
      "Password": data.password,
      "UserUpdateType": "Password"
    }
    if (data.password.length >= 8 && /(?=.*[0-9])/.test(data.password)) {
      let response = await fetch(config.API_URL+'user', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(bodyData)
      })
      .then((resp) => {return resp.json()})
      .catch(err => {
       console.log(err);
      });
      console.log(response.success);
      if (response.success) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Password has been changed!', ToastAndroid.SHORT)
        } else {
            Alert.alert('Password has been changed!');
        }
      } else {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Password could not be changed!', ToastAndroid.SHORT)
        } else {
            Alert.alert('Password could not be changed!');
        }
      }
      setOptionSelected(false);
      setNotSelected(false);
    } else {
      Alert.alert(
        'Password change - Error',
        'Password is too short (atleast 8 symbols and 1 numeric character)',
        [
        { text: 'Okey', onPress: () => {} }
        ],
        { cancelable: true }
      );
      setData({password: ''});
    }
  }
  
  return (
    <View>
        <ImageBackground style={styles.header} source={require('../assets/profile_bg.jpg')} />
        <Image style={styles.avatar} source={{uri: `data:image/jpg;base64,${user.profileImage != null ? user.profileImage : defaultImages.profile}`}}/>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={{color: textColor, fontSize:28, fontWeight:'600', textDecorationLine: 'underline'}}>{user.username}</Text>
            <Text style={styles.info, {color: textColor}}>User</Text>
            <Text style={styles.description}>Joined: 2020/12/17</Text>
            
            <TouchableOpacity style={styles.buttonContainer} onPress={() => displayConfirm('changePassword')}>
              <Text style={{color: textColor}}>Change Password</Text>  
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => displayConfirm('changeAvatar')}>
              <Text style={{color: textColor}}>Change Profile Picture</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => displayConfirm('deleteAccount')}>
              <Text style={{color: textColor}}>Deactivate Account</Text> 
            </TouchableOpacity>
          </View>
      </View>
      <Modal isVisible={optionSelected} style={[styles.modalView, {backgroundColor: theme.dark ? themeColors.lightGrey : themeColors.white}]} >
        { optionSelected ? confirmMenu() : <></> }
      </Modal>
    </View>
  );
}

const themeColors = {
  white: "#FFFFFF",
  lightGrey: "#242424",
  dark: "#1c1c1c",
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header:{
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop: 130
  },
  name:{
    fontSize:28,
    color:'#fff',
    fontWeight:'600'
  },
  body:{
    marginTop:40,
    flex: 0.2
  },
  bodyContent: {
    flex: 0,
    alignItems: 'center',
    padding:30,
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:15,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:'75%',
    borderRadius:30,
    backgroundColor: "#1db954",
    fontWeight: "bold"
  },
  modalView: {
    flex: 1,
    height: '50%',
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 0,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute'
  },
  modalButtonContainer: {
    height: 45,
    marginHorizontal: 20,
    marginTop: '75%',
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    backgroundColor: "#1db954",
    fontWeight: "bold"
  },
  modalBodyContent: {
    height:'70%',
    width:'50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '42%'
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    marginTop: 10,
    paddingLeft: 10,
    color: '#05375a'
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    marginTop: 50
  },
  action: {
    flexDirection: 'row',
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
});