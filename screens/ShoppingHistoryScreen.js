import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import { back } from 'react-native/Libraries/Animated/src/Easing';

import configColors from '../config/colors';
import styles from '../config/styles';

import config, { user } from '../config';

const ShoppingHistoryScreen = () => {

    const theme = useTheme();
    //const { colors } = useTheme();

    const [receipts, setReceipts] = useState([]);
    
    useState(() => {
      let token = user.token;
      fetch(config.API_URL+'receipt', {
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
          setReceipts(data.data);
        })
        .catch(err => {
          console.log(err);
        });

    }, []);

    return (
      <View style={styles().containerm}>
          <View>
                <Text style={styles().title}>Shopping History</Text>
          </View>
          <View style={styles().bodym}>  
          <SafeAreaView style={{color:"#ccc"}}>
            <FlatList
              decelerationRate='normal'
              showsVerticalScrollIndicator={false}
              data={receipts}
              renderItem={({item}) => (<TouchableOpacity onPress={() => {}} style={contentStyles.item} >
                <View style={contentStyles.divider}>
                  <View style={contentStyles.leftText}>
                    <Text>{item.date}</Text>
                    <Text>{item.total}</Text>
                    <Text>{item.shop}</Text>
                  </View>
                  <View style={styles.rightButton}>
                    <TouchableHighlight activeOpacity={0.6} underlayColor="#9e9e9e" onPress={() => {}}>
                      <Text>X</Text>
                    </TouchableHighlight>
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
                    <Text style={{ color: "#fff" }}>Show more</Text>
                  </TouchableOpacity>
                </View>
                </TouchableOpacity>)}
                keyExtractor={item => item.id.toString()}
            />
            </SafeAreaView>
            </View>
      </View>
    );
};

export default ShoppingHistoryScreen;

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