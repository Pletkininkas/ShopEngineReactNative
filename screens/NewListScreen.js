import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from '../config/styles';

import config from '../config';

const NewListScreen = ({ navigation }) => {

  const [products, setProducts] = useState([]);

  useState(() => {
    fetch(config.API_URL+'product', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(data => {
        return data.json();
      })
      .then(data => {
        setProducts(data.data);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);

  return (
    <View style={styles().containerm}>
        <View style={styles().body}>  
        <SafeAreaView style={{color:"#ccc"}}>
          <FlatList
            decelerationRate='normal'
            showsVerticalScrollIndicator={false}
            data={products}
            renderItem={({item}) => (<TouchableOpacity onPress={() => {}} style={contentStyles.item} >
              <View style={contentStyles.divider}>
                <View style={contentStyles.leftText}>
                  <Text>{item.name}</Text>
                  <Text>{item.unit}</Text>
                </View>
              </View>
              <View alignItems="center">
                <TouchableOpacity style={{
                  width: "40%",
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                  backgroundColor: "#1db954",
                  borderRadius: 10,
                }} onPress={() => {}}>
                  <Text style={{ color: "#fff" }}>Select</Text>
                </TouchableOpacity>
              </View>
              </TouchableOpacity>)}
              keyExtractor={item => item.name.toString()}
          />
          </SafeAreaView>
          </View>
    </View>
  );
};

export default NewListScreen;

const contentStyles = StyleSheet.create({
  item: {
    elevation: 10,
    backgroundColor: "#f2fcf6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 10
  },
  leftText: {
    alignSelf: 'center'
  },
  rightButton: {
    width: 30,
    height: 50,
    alignItems: 'center'
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});