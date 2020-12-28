import React, { useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Button, StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view'

//import configColors from '../config/colors';
import styles from '../config/styles';
import {ShoppingListContext} from '../components/context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect } from 'react/cjs/react.development';

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
          <View alignItems="center">
            <TouchableOpacity 
              style={screenStyle.button} 
              onPress={() => {}}>
              <Text style={{fontSize: 16, margin: 10, color: textColor}}>Shopping Lists</Text>
            </TouchableOpacity>
          </View>
          <SafeAreaView style={{color:"#ccc", marginBottom: 180}}>
            <SwipeListView style={{width:'100%', marginBottom:80}}
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
  item: {
    elevation: 10,
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
    width: 40
  },
  button:{
    width: "40%",
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#1db954",
    borderRadius: 10,
  },
});
