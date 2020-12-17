import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase, ActivityIndicator, Alert, Image, TouchableHighlightComponent } from 'react-native';
import { color } from 'react-native-reanimated';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption} from 'react-native-popup-menu';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import { back } from 'react-native/Libraries/Animated/src/Easing';
import Spinner from 'react-native-loading-spinner-overlay';

import Modal from 'react-native-modal';

import styles from '../config/styles';

import config, { user } from '../config';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const ShoppingHistoryScreen = () => {
    const [screenLoading, setScreenLoading] = React.useState(true);
    const [itemSelected, setItemSelected] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState({});

    const displayReceipt = (item) => {
      setSelectedItem(item);
      setItemSelected(true);
    }

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

    const renderShopLogo = (shopName) => {
      switch (shopName) {
        case 'NORFA':
          return <Image style={contentStyles.modalShopImage} source={require('../assets/shop_logos/NORFA.png')}></Image>
        case 'MAXIMA':
          return <Image style={contentStyles.modalShopImage} source={require('../assets/shop_logos/MAXIMA.png')}></Image>
        case 'IKI':
          return <Image style={contentStyles.modalShopImage} source={require('../assets/shop_logos/IKI.png')}></Image>
        case 'RIMI':
          return <Image style={contentStyles.modalShopImage} source={require('../assets/shop_logos/RIMI.png')}></Image>
        case 'LIDL':
          return <Image style={contentStyles.modalShopImage} source={require('../assets/shop_logos/LIDL.png')}></Image>
        default:
          <Text style={contentStyles.modalShopImage, {fontSize: 20}}>?</Text>
          break;
      }
    }

    const receiptModal = (receipt) => {
      var date = new Date(receipt.date);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var newformat = (date.getHours() - 1) >= 12 ? 'PM' : 'AM';  

      // AM/PM
      hours = (hours - 1) % 12;  
      // 0/12
      hours = hours ? hours : 12;  
      minutes = minutes < 10 ? '0' + minutes : minutes; 
      var formatted = 
        (date.toString().split(' ')[0]) 
        + ', ' +('0' + (date.getDate() - 1) ).slice(-2) 
        + '/' + ('0' + (date.getMonth() + 1) ).slice(-2)
        + '/' + (date.getFullYear())
        + ' - ' + ('0' + date.getHours()).slice(-2)
        + ':' + ('0' + date.getMinutes()).slice(-2)
        + ' ' + newformat;

      return (
        <View style={{alignItems: 'center'}}>
          {renderShopLogo(receipt.shop)}
          <Text>{formatted}</Text>
          
          <Text>Total price: {receipt.total}€</Text>
            <FlatList 
              decelerationRate='normal'
              showsVerticalScrollIndicator={false}
              data={receipt.receiptProducts}
              renderItem={({item}) => (
                <View style={contentStyles.modalItem}>
                  <Text>Product: {item.name}</Text>
                  { item.discount != 0.00 ?
                  (<View><Text>Total price: {(item.price-item.discount).toFixed(2)}€</Text>
                  <Text>Price: {item.price}€</Text>
                  <Text>Discount: {item.discount}€</Text></View>)
                  :
                  (<Text>Price: {item.price}€</Text>)
                  }
                  <Text></Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          <TouchableOpacity style={{
              width: 120,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              backgroundColor: "#1db954",
              borderRadius: 10,
              elevation: 2
            }} onPress={() => setItemSelected(false)}>
              <Text style={{ color: "#fff" }}>Back</Text>
            </TouchableOpacity>
        </View>
      )
    }

    const deleteReceipt = async (id) => {
      setScreenLoading(true);
      let token = user.token;
      fetch(config.API_URL+'receipt/'+id.toString(), {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then((res) => {
          const dataRemoved = receipts.filter((r) => {
            return r.id !== 211
          });
          setReceipts(dataRemoved);
          setScreenLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    }

    const deleteReceiptPopUp = (id) =>  {
        Alert.alert('Delete Receipt?',
        'Confirm to remove receipt...',
        [
          {
            text: "Confirm",
            onPress: () => deleteReceipt(id)
          },
          {
            text: "Cancel",
            onPress: () => {}
          }
        ], {cancelable: true});
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
                      <View style={{flex: 1, flexDirection: "row"}}>
                        <View styles={{flex: 0.5}}>
                          {renderShopLogo(item.shop)}
                        </View>
                        <View styles={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>
                          <View styles={{flex: 0.5}}>
                            <Text> {item.date}</Text>
                            <Text> Total: {item.total}€</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.rightButton}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="#9e9e9e" onPress={() => {deleteReceiptPopUp(item.id)}}>
                          <Text style={{fontSize: 24, paddingHorizontal: 20, color: '#8b0000'}}>X</Text>
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
                      }} onPress={() => displayReceipt(item)}>
                        <Text style={{ color: "#fff" }}>Show more</Text>
                      </TouchableOpacity>
                    </View>
                    </View>)}
                    keyExtractor={item => item.id.toString()}
                />
                <Modal isVisible={itemSelected} style={contentStyles.modalView}>
                    { receiptModal(selectedItem) }
                </Modal>
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
    height: 30,
    alignItems: 'center'
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
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
  modalShopImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  modalItem: {
    elevation: 3,
    backgroundColor: "#cdcdcd",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 2,
    margin: 5
  }
});