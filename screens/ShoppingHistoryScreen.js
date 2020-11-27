import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import { back } from 'react-native/Libraries/Animated/src/Easing';

import configColors from '../config/colors';
import styles from '../config/styles';

const ShoppingHistoryScreen = () => {

    const theme = useTheme();
    //const { colors } = useTheme();

    const [receipts, setReceipts] = useState([]);
    
    useState(() => {
      fetch("http://80f2e652776b.ngrok.io/receipt", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJFdmFsZGFzIiwibmJmIjoxNjA2NDQ4Nzk4LCJleHAiOjE2MDY1MzUxOTgsImlhdCI6MTYwNjQ0ODc5OH0.02NofSIVEU0pVyxGc4oBIhwtKuZW2epP6WUr70hSkl8mLJuHbOBtJcQCYDFbdScmY5mULR2tW1h0jKwlXfkY1w'
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
              data={receipts}
              renderItem={({item}) => (<TouchableOpacity onPress={() => {}} style={styles.item} >
                <View style={styles.divider}>
                  <View style={styles.leftText}>
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
                    backgroundColor: "#000",
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

const styles = StyleSheet.create({
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