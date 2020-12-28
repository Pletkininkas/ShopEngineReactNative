import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase, ActivityIndicator, Alert, Image, TouchableHighlightComponent } from 'react-native';
import { color } from 'react-native-reanimated';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption} from 'react-native-popup-menu';
import { Header } from 'react-navigation';
import { back } from 'react-native/Libraries/Animated/src/Easing';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { useTheme } from "@react-navigation/native";
import styles from '../config/styles';

import Modal from 'react-native-modal';
import config, { user, setReceiptsHistory, updateDrawer, drawer } from '../config';

const ShoppingHistoryScreen = () => {
    const [screenLoading, setScreenLoading] = React.useState(true);
    const [itemSelected, setItemSelected] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState({});
    const [refreshReceipts, setRefreshReceipts] = React.useState(true);
    const [receipts, setReceipts] = React.useState([]);
    const theme = useTheme();

    const displayReceipt = (item) => {
      setSelectedItem(item);
      setItemSelected(true);
    }

    const fetchUserReceipts = () => {
      setReceipts(user.receipt);
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
              setScreenLoading(false);
            })
            .catch(err => {
              console.log(err);
            });
    }

    React.useEffect(() => {
      fetchUserReceipts();

      const interval=setInterval(()=>{
        fetchUserReceipts();
        setScreenLoading(false);
        },10000);
          
        return()=>clearInterval(interval);
    }, [refreshReceipts]);

    const renderShoppingHistory = () => {
      return (
        <FlatList
          decelerationRate='normal'
          showsVerticalScrollIndicator={false}
          data={receipts}
          renderItem={({item}) => (<View onPress={() => {}} style={[contentStyles.item, {backgroundColor: theme.dark ? colors.lightGrey : colors.white}]} >
            <View style={contentStyles.divider}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <View styles={{flex: 0.5}}>
                  {renderShopLogo(item.shop, null)}
                </View>
                <View styles={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>
                  <View styles={{flex: 0.5}}>
                    <Text style={{color: theme.dark ? colors.white : colors.dark}}> {item.date}</Text>
                    <Text style={{color: theme.dark ? colors.white : colors.dark}}> Total: {item.total}€</Text>
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
                <Text style={{color: theme.dark ? colors.white : colors.dark}}>Show more</Text>
              </TouchableOpacity>
            </View>
            </View>)}
            keyExtractor={item => item.id.toString()}
        />
      );
    }

    const renderShopLogo = (shopName, specificStyle) => {
      switch (shopName) {
        case 'NORFA':
          return <Image style={specificStyle != null ? specificStyle : contentStyles.modalShopImage} source={require('../assets/shop_logos/NORFA.png')}></Image>
        case 'MAXIMA':
          return <Image style={specificStyle != null ? specificStyle : contentStyles.modalShopImage} source={require('../assets/shop_logos/MAXIMA.png')}></Image>
        case 'IKI':
          return <Image style={specificStyle != null ? specificStyle : contentStyles.modalShopImage} source={require('../assets/shop_logos/IKI.png')}></Image>
        case 'RIMI':
          return <Image style={specificStyle != null ? specificStyle : contentStyles.modalShopImage} source={require('../assets/shop_logos/RIMI.png')}></Image>
        case 'LIDL':
          return <Image style={specificStyle != null ? specificStyle : contentStyles.modalShopImage} source={require('../assets/shop_logos/LIDL.png')}></Image>
        default:
          <Text style={{fontSize: 20}}>?</Text>
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
          {renderShopLogo(receipt.shop, contentStyles.modalItemShopImage)}
          <Text style={[{color: theme.dark ? colors.white : colors.dark}, {fontSize: 20}]}>{formatted}</Text>
          <Text style={[{color: theme.dark ? colors.white : colors.dark}, {fontSize: 20}]}>Total price: {receipt.total}€</Text>
            <FlatList
              decelerationRate='normal'
              showsVerticalScrollIndicator={false}
              data={receipt.receiptProducts}
              renderItem={({item}) => (
                <View style={[contentStyles.modalItem, {backgroundColor: theme.dark ? colors.lightGrey : colors.white}]}>
                  <Text style={{color: theme.dark ? colors.white : colors.dark}}>Product: {item.name}</Text>
                  { item.discount != 0.00 ?
                  (<View><Text style={{color: theme.dark ? colors.white : colors.dark}}>Total price: {(item.price-item.discount).toFixed(2)}€</Text>
                  <Text style={{color: theme.dark ? colors.white : colors.dark}}>Price: {item.price}€</Text>
                  <Text style={{color: theme.dark ? colors.white : colors.dark}}>Discount: {item.discount}€</Text></View>)
                  :
                  (<Text style={{color: theme.dark ? colors.white : colors.dark}}>Price: {item.price}€</Text>)
                  }
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
              <Text style={{color: theme.dark ? colors.white : colors.dark}}>Back</Text>
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
          setRefreshReceipts(true);
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
                { user.receiptCount == 0 ?
                
                <View style={{alignItems: 'center', margin: 30}}>
                  <Text style={{color: theme.dark ? colors.white : colors.dark, fontSize: 22}}>Could not find any receipt!</Text>
                </View>
                
                : renderShoppingHistory()}
                <Modal isVisible={itemSelected} style={[contentStyles.modalView, {backgroundColor:  theme.dark ? colors.dark : colors.white}]}>
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

const colors = {
  white: "#FFFFFF",
  lightGrey: "#242424",
  dark: "#1c1c1c",
};

const contentStyles = StyleSheet.create({
  item: {
    elevation: 5,
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
    paddingVertical: 5,
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
  modalItemShopImage: {
    width: 100,
    height: '10%',
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