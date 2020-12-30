import React, { useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view'

import styles from '../config/styles';
import {ShoppingListContext} from '../components/context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { user } from '../config';

const HomeScreen = ({ navigation }) => {
    
    const theme = useTheme();
    const textColor = theme.dark ? '#fff' : '#000';
    const itemColor = theme.dark ? '#3d3d3d' : '#f2fcf6';
    const lists = useContext(ShoppingListContext);

    const deleteList = (list) => {
      var removed = lists.shoppingLists.filter(x => x.name != list.name);
      lists.setShoppingLists(removed);
      lists.saveLists(removed);
    }

    const selectList = (list) => {
      lists.setCurrentList(list);
      navigation.navigate("NewList");
    }

    return (
      <View style={styles().containerm}>
        <View style={styles().body}>
          <View style={screenStyle.root}>
            <View style={screenStyle.body}>
              <View style={screenStyle.headline}>
                <ImageBackground
                  source={require("../assets/profile_bg.jpg")}
                  resizeMode="cover"
                  style={screenStyle.image}
                  imageStyle={screenStyle.image_imageStyle}
                >
                  <View style={screenStyle.overlay}>
                    <Text style={[screenStyle.scienceChannel, {alignSelf: 'flex-start', marginLeft: 26}]}>Hi, {user.username}!</Text>
                    <Text style={[screenStyle.scienceChannel, {marginTop: 50}]}>These are your shopping lists!</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </View>
          <SafeAreaView style={{color:"#ccc", marginTop: 60, flex: 2}}>
            <SwipeListView style={{width:'100%'}}
              disableRightSwipe
              data={lists.shoppingLists}
              keyExtractor={(item) => item.name}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={[screenStyle.item, {backgroundColor: itemColor, alignItems: "center"}]}
                  onPress={() => selectList(item)}>
                  <Text style={{fontSize: 16, margin: 10, color: textColor}}>{item.name}</Text>
                </TouchableOpacity>
              )}
              renderHiddenItem={ ({item}) => (
                <View style={[screenStyle.item, {backgroundColor:'indianred'}]}>
                  <TouchableOpacity 
                    style={screenStyle.backRightBtn}
                    activeOpacity={1}
                    onPress={() => deleteList(item)}>
                    <Ionicons name='ios-trash' size={40}/>
                  </TouchableOpacity>
                </View>
              )}
              rightOpenValue={-75}
            />
          </SafeAreaView>
        </View>
      </View>
    );
};



export default HomeScreen;

const screenStyle = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    borderRadius: 10
  },
  body: {
    flex: 1
  },
  headline: {
    height: 246,
    overflow: "hidden",
    borderRadius: 10,
    elevation: 5,
  },
  image: {
    flex: 1,
    borderRadius: 10
  },
  image_imageStyle: {},
  overlay: {
    backgroundColor: "rgba(30,26,26,0.4)",
    flex: 1
  },
  scienceChannel: {
    color: "rgba(255,255,255,1)",
    fontSize: 24,
    marginTop: 20,
    alignSelf: "center"
  },
  text: {
    color: "rgba(31,178,204,1)",
    fontSize: 14,
    alignSelf: "center"
  },
  item: {
    elevation: 5,
    backgroundColor: "#f2fcf6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 10
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftText: {
    alignSelf: 'center'
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    width: '10%'
  }
});
