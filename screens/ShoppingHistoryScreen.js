import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase, ActivityIndicator, Alert, Modal } from 'react-native';
import { color } from 'react-native-reanimated';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption} from 'react-native-popup-menu';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import { back } from 'react-native/Libraries/Animated/src/Easing';
import Spinner from 'react-native-loading-spinner-overlay';

import configColors from '../config/colors';
import styles from '../config/styles';

import config, { user } from '../config';

const ShoppingHistoryScreen = () => {
    const [screenLoading, setScreenLoading] = React.useState(true);
    const theme = useTheme();

    const [receipts, setReceipts] = React.useState([]);
    //console.log('Receipts1:'+receipts);
    React.useEffect(() => {
      //console.log('Effect:'+screenLoading);
      let token = user.token;
      fetch(config.API_URL+'receipt', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then(data => {
          // Error occurance.
          setScreenLoading(false);
          return data.json();
          
        })
        .then(data => {
          setReceipts(data.data);
          //console.log(data.data);
        })
        .catch(err => {
          console.log(err);
        });
        //setScreenLoading(false);
        //console.log('2Effect:'+screenLoading);
    }, []);
    //console.log('Receipts2:'+receipts);
    //console.log('screenLoadingLast:'+screenLoading);

    //const [modalVisible, setModalVisible] = useState(false);

    const getReceipt = (items) => {
      //console.log('OK: '+items.receiptProducts);
      Alert.alert(
        "Produktai",
        items.receiptProducts[0].name + '   ' + items.receiptProducts[0].price + '\n' + items.receiptProducts[1].name + '   ' + items.receiptProducts[1].price);
        /* return (<FlatList
          data={items}
          renderItem={(item) => (
            <View>
              <Text>{item.discount}</Text>
              <Text>{item.name}</Text>
              <Text>{item.price}</Text>
              <Text>{item.pricePerQuantity}</Text>
            </View>
          )}
          keyExtractor={item => item.name.toString()}>
        </FlatList>); */
    }

    if (!screenLoading) {
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
                  renderItem={({item}) => (<View onPress={() => {}} style={contentStyles.item} >
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
                      }} onPress={() => getReceipt(item)}>
                        <Text style={{ color: "#fff" }}>Show more</Text>
                      </TouchableOpacity>
                    </View>
                    </View>)}
                    keyExtractor={item => item.id.toString()}
                />
                </SafeAreaView>
              </View>
          </View>
      )
    } else {
      return (
      <View style={{flex:1,justifyContent:'center'}}>
          <ActivityIndicator size="large" color="#00ff00" />
      </View>
      )
    }

    /*return (
      <View style={styles().containerm}>
        <Text>Oke</Text>
        { !screenLoading ? (
        <>
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
          </>
      ) : (
        <View style={{flex:1,justifyContent:'center'}}>
        <Spinner visible={true}
                 textContent={'Loading...'}
                 textStyle={styles.spinnerTextStyle}/>
      </View>
      )}
      </View>
    );*/
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
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

const sstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
