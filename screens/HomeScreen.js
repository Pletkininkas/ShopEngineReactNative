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

    const renderListText = () => {
      return (
        <Text style={[screenStyle.scienceChannel, {alignSelf: 'center', marginTop: 20, fontSize: 20, color: textColor}]}>
          {lists.shoppingLists.length == 0 ? "You don't have any shopping lists." : "These are your shopping lists:"}
        </Text>
      )
    }

    const renderShoppingLists = () => {
      if(lists.shoppingLists.length == 0){
          return (
            <TouchableOpacity 
              style={[screenStyle.button]}
              onPress={() => navigation.navigate('NewList')}>
              <Text style={{fontSize: 16, margin: 10, marginLeft: '5%', color: textColor}}>Create New Shopping List</Text>
            </TouchableOpacity>
          );
      }else{
        return (
          <SafeAreaView style={{color:"#ccc"}}>
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
        )
      }
    }
    return (
      <View style={styles().containerm}>
        <View style={styles().body}>
          <View style={screenStyle.body}>
            <View style={screenStyle.headline}>
              <ImageBackground
                source={require("../assets/profile_bg.jpg")}
                resizeMode="cover"
                style={screenStyle.image}
                imageStyle={screenStyle.image_imageStyle}
              >
                <View style={screenStyle.overlay}>
                  <Text style={[screenStyle.scienceChannel, {alignSelf: 'center', fontWeight: 'bold', color: textColor}]}>Hi, {user.username}!</Text>
                  {renderListText()}
                </View>
              </ImageBackground>
            </View>
            <View style={{flex: 4}}>
              {renderShoppingLists()}
            </View>
          </View>
        </View>
      </View>
    );
};

export default HomeScreen;

const screenStyle = StyleSheet.create({
  root: {
    borderRadius: 10
  },
  body: {
    flex: 1
  },
  headline: {
    flex: 1,
    height: 160,
    overflow: "hidden",
    borderRadius: 10,
    elevation: 5,
    margin: 10,
    marginBottom: 5
  },
  image: {
    flex: 1,
    borderRadius: 10
  },
  image_imageStyle: {
  },
  overlay: {
    backgroundColor: "rgba(30,26,26,0.1)",
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
    margin: 10,
    marginLeft: '10%',
    marginRight: '10%'
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button:{
    width: "60%",
    margin: 10,
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: "#1db954",
    borderRadius: 10,
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
