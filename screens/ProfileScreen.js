import React, { useState } from 'react'
import Modal from 'react-native-modal';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';

import { AuthContext } from '../components/context';

import { user } from '../config'

const ProfileScreen = () =>  {
  const getTheme = useTheme();
  const textColor = getTheme.dark ? '#fff' : '#000';

  const [optionSelected, setOptionSelected] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');

  const [data, setData] = React.useState ({
    password: '',
    check_textInputChange: false,
    secureTextEntry: true
  });

  const { signIn } = React.useContext(AuthContext);

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

  const confirmMenu = () => {
    switch(selectedOption) {
      case 'changeAvatar':
      return (
        <View style={styles.bodyContent}>
          <Text style={styles.text_footer}>Change Profile Picture</Text>
            <View style={styles.action}>
                <Text>Select image from gallery?</Text>
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
            }}>
            <Text style={{color: textColor, flex: 0.55}}>Upload</Text> 
            </TouchableOpacity>
            <View style={styles.modalBodyContent}>
              <TouchableOpacity style={styles.modalButtonContainer} onPress={() => console.log('changeProfilePicture')}>
                <Text style={{color: textColor}}>Confirm</Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonContainer} onPress={() => {setOptionSelected(false),Keyboard.dismiss()}}>
                <Text style={{color: textColor}}>Cancel</Text> 
              </TouchableOpacity>
          </View>
        </View>
      );
      case 'changePassword':
      return (
        <View style={styles.bodyContent}>
          <Text style={styles.text_footer}>Change Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors='#05375a'
                        size={20}
                        style={{marginTop: 12}}
                    />
                    <TextInput
                        placeholder="New Password"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={()=> {}}
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
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors='#05375a'
                        size={20}
                        style={{marginTop: 12}}
                    />
                    <TextInput
                        placeholder="Re-New Password"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={()=> {}}
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
            <TouchableOpacity style={styles.modalButtonContainer} onPress={() => Keyboard.dismiss()}>
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
          <Text style={styles.text_footer}>Deactivate Account</Text>
          <View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: textColor, fontSize:14, fontWeight:'400', textDecorationLine: 'underline'}}>{user.username}</Text>
                </View>
              </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors='#05375a'
                        size={20}
                        style={{marginTop: 12}}
                    />
                    <TextInput
                        placeholder="Current Password"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={()=> {}}
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
            <TouchableOpacity style={styles.modalButtonContainer} onPress={() => Keyboard.dismiss()}>
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
  
  return (
    <View>
        <View style={styles.header} />
        <Image style={styles.avatar} source={require('../assets/user_icon.png')}/>
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
      <Modal isVisible={optionSelected} style={styles.modalView}>
        { confirmMenu() }
      </Modal>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#1db954",
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
    flex: 1,
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
    height: "35%",
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 0,
    alignItems: "center",
    alignSelf: 'center',
    position: 'absolute'
  },
  modalButtonContainer: {
    height: 45,
    marginHorizontal: 20,
    marginTop: 50,
    width: "80%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    borderRadius:10,
    backgroundColor: "#1db954",
    fontWeight: "bold"
  },
  modalBodyContent: {
    height:45,
    width:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
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
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
});