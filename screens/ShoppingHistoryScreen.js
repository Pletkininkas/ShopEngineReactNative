import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, ToastAndroid } from 'react-native';
import { useTheme } from "@react-navigation/native";
import styles from '../config/styles';
import {SwipeListView} from 'react-native-swipe-list-view'
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import Modal from 'react-native-modal';
import config, { user, drawer } from '../config';

const ShoppingHistoryScreen = () => {
    const [screenLoading, setScreenLoading] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState({});
    const [receipts, setReceipts] = React.useState(user.receipt);
    const drawerUpdate = React.useState(drawer.update);
    const theme = useTheme();

    const displayReceipt = (item) => {
      setSelectedItem(item);
      setItemSelected(true);
    }

    const fetchUserReceipts = () => {
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
              setReceipts(data.data.reverse());
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
    }, []);

    const renderShoppingHistory = () => {
      return (
        <SwipeListView
          disableRightSwipe
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
                    <Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}> {moment(item.date).format('YYYY/MM/DD HH:mm:ss')}</Text>
                    <Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}> Total: {item.total}€</Text>
                  </View>
                </View>
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
              }} onPress={() => {displayReceipt(item)}}>
                <Text style={{color: theme.dark ? colors.white : colors.dark}}>Show more</Text>
              </TouchableOpacity>
            </View>
            </View>)}
            keyExtractor={item => item.id.toString()}
            renderHiddenItem={ ({item}) => (
              <View style={[contentStyles.deleteItem, {backgroundColor:'indianred'}]}>
                <TouchableOpacity 
                  style={contentStyles.backRightBtn} 
                  onPress={() => deleteReceiptPopUp(item.id)}>
                  <Ionicons name='ios-trash' size={40}/>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-75}
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
      var date = moment(new Date(receipt.date)).subtract(2, 'hour');

      var formatted = date.format('YYYY/MM/DD HH:mm:ss');

      return (
        <View style={{alignItems: 'center'}}>
          {renderShopLogo(receipt.shop, contentStyles.modalItemShopImage)}
          <Text style={[{color: theme.dark ? colors.white : colors.dark}, {fontSize: 20, fontWeight: "bold"}]}>{formatted}</Text>
          <Text style={[{color: theme.dark ? colors.white : colors.dark}, {fontSize: 20, fontWeight: "bold"}]}>Total price: {receipt.total}€</Text>
            <FlatList
              decelerationRate='normal'
              showsVerticalScrollIndicator={false}
              data={receipt.receiptProducts}
              renderItem={({item}) => (
                <View style={[contentStyles.modalItem, {backgroundColor: theme.dark ? colors.lightGrey : colors.white}]}>
                  <Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}>Product: {item.name}</Text>
                  { item.discount != 0.00 ?
                  (<View><Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}>Price: {(item.price-item.discount).toFixed(2)}€</Text>
                  <Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}>Discount: {item.discount}€</Text>
                  <Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}>Total price: {item.price}€</Text></View>)
                  :
                  (<Text style={{color: theme.dark ? colors.white : colors.dark, fontWeight: "bold"}}>Total price: {item.price}€</Text>)
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
      if (Platform.OS === 'android') {
        ToastAndroid.show('Deleting receipt', ToastAndroid.SHORT)
      } else {
          Alert.alert('Deleting receipt');
      }
      let token = user.token;
      fetch(config.API_URL+'receipt/'+id.toString(), {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then((res) => {
          const dataWithoutRemoved = receipts.filter((r) => {
            return r.id !== id
          });
          if (dataWithoutRemoved.lenght == 0) {
            user.receiptTotalSaved = 0.00;
          }
          user.receiptCount = user.receiptCount-1;
          user.receipt = dataWithoutRemoved;
          setReceipts(dataWithoutRemoved.reverse());
          if (Platform.OS === 'android') {
            ToastAndroid.show('Receipt has been deleted!', ToastAndroid.SHORT)
          } else {
              Alert.alert('Receipt has been deleted!');
          }
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
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    width: '10%',
    marginTop: 25
  },
  deleteItem: {
    backgroundColor: "#f2fcf6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 10,
    height: '85%'
  },
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