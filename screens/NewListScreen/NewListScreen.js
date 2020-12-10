import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from '../../config/styles';
import screenStyles from './styles.js'
import State from './state.js'

import config from '../../config';
import { TextInput } from 'react-native-paper';
import { debug } from 'react-native-reanimated';
import { ThemeColors } from 'react-navigation';

const NewListScreen = ({ navigation }) => {

  const[screenState, setScreenState] = useState(State.ScreenState.viewingList)
  const [products, setProducts] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [availableShops, setAvailableShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [optimizedList, setOptimizedList] = useState([]);
  const [onlyReplaceUnspecifiedShops, setOnlyReplaceUnspecifiedShops] = useState(false);
  const [chosenShops, setChosenShops] = useState([]);
  const [listShops, setListShops] = useState([]);

  const theme = useState();

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShoppingList([]);
      setSelectedAmount(1);
      setSelectedItem(null);
      setAvailableShops([]);
      setSelectedShop(null);
      setOptimizedList([]);
      setListShops([]);
      setScreenState(viewingList);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedAmount(1);
      setSelectedItem(null);
      setAvailableShops([]);
      setSelectedShop(null);
      setOptimizedList([]);
      setChosenShops([]);
      setListShops([]);
      setScreenState(viewingList);
    });
    return unsubscribe;
  }, [navigation]);

  const _selectItem = () => {
    setScreenState(selectingItem);
  }

  const _configureItem = async (item) => {
    setSelectedAmount(1);
    
    var shopPrices = getItemShops(item);
    //[{shop: "ANY", price: 0}].concat(shopPrices);
    //shopPrices.push({shop: "ANY", price: 0});
    setSelectedShop(shopPrices[0].shop);
    setAvailableShops(shopPrices);
    setSelectedItem(item);
    setScreenState(configuringItem);
  }

  function getItemShops(item){
    var shopPrices = []
    for(var i in item.shopPrices){
      var newPrice = { shop: i, price: item.shopPrices[i] };
      shopPrices.push(newPrice);
    }
    return shopPrices;
  }

  const _getListShops = () => {
    var listOfShops = [];
    for(var item in shoppingList){
      var product = products.find(x => x.name == item.name);
      var shops = getItemShops(product);
      for(var shop in shops){
        if(listOfShops.find(x => x == shop)) continue;
        listOfShops.push(shop);
      }
    }
    setListShops(listOfShops);
    console.log(listShops);
  }

  const _configureOptimization = () =>{
    //_getListShops();
    setListShops(["MAXIMA", "IKI", "LIDL", "RIMI", "NORFA"]);
    setScreenState(optimizingList);
  }

  const _optimizeList = async () => {
    setScreenState(comparingOptimizedList);
    await _getOptimizedList();
    console.log(optimizedList);
  }

  const _addItemToShoppingList = (item) => {
    var shoppingItem = { name: item.name, unit: item.unit, amount: selectedAmount, shop: selectedShop };
    let existingItem = shoppingList.find(x => x.name == item.name && x.shop == selectedShop)
    if(existingItem == null){
      setShoppingList(oldList => [...oldList, shoppingItem]);
    }else{
      existingItem.amount += selectedAmount;
    }
    setScreenState(viewingList);
  }

  const _removeItemFromShoppingList = (item) => {
      let removed = shoppingList.filter(x => x.name != item.name || x.shop != item.shop);
      setShoppingList(removed);
  }

  const _changeAmount = (text) => {
    let amount = parseInt(text, 10);
    if(isNaN(amount)) amount = 1;
    setSelectedAmount(amount);
  }

  const _chooseShop = (shop) => {
    var existing = chosenShops.find(x => x == shop);
    var newChosen = [];
    if(existing == null) newChosen = chosenShops.concat(shop);
    else newChosen = chosenShops.filter(x => x != shop);
    setChosenShops(newChosen);
  }

  const _getOptimizedList = async () =>{
    try{
      var items = []
      for(var i in shoppingList){
        var item = shoppingList[i];
        items.push({ name: item.name, amount: item.amount, shop: item.shop });
      }

      var content = { shoppingList: items, allowedShops: chosenShops, onlyReplaceUnspecifiedShops: onlyReplaceUnspecifiedShops};

      let response = await fetch(
        config.API_URL + 'optimize', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
        }
      );
      let json = await response.json();

      console.log(json);
      setOptimizedList(json);

    }catch (error) {
      console.error('ERROR:' + error);
    }
  }

  const {viewingList, selectingItem, configuringItem, optimizingList, comparingOptimizedList} = State.ScreenState;
  switch(screenState){
    case viewingList:
      return (
        <View style={styles().containerm}>
          <View style={styles().body}>
            <View alignItems="center">
              <TouchableOpacity style={screenStyles.button} onPress={() => _selectItem()}>
                <Text style={{ color: "#fff" }}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={screenStyles.button} onPress={() => _configureOptimization()}>
                <Text style={{ color: "#fff" }}>Optimize</Text>
              </TouchableOpacity>
            </View>
            <SafeAreaView style={{color:"#ccc", marginBottom: 80}}>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={shoppingList}
                  renderItem={({item}) => (<TouchableOpacity onPress={() => {}} style={screenStyles.item} >
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text>{item.name}</Text>
                        <Text>{item.unit}</Text>
                        <Text>x{item.amount}</Text>
                        <Text>{item.shop}</Text>
                      </View>
                    </View>
                    <View alignItems="center">
                      <TouchableOpacity style={screenStyles.button} onPress={() => _removeItemFromShoppingList(item)}>
                        <Text style={{ color: "#fff" }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                    </TouchableOpacity>)}
                    keyExtractor={item => {item.name.toString()}}
                />
            </SafeAreaView>
          </View>
        </View>
      );
    case selectingItem:
      return (
        <View style={styles().containerm}>
            <View style={styles().body}>  
              <SafeAreaView style={{color:"#ccc"}}>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={products}
                  renderItem={({item}) => (<TouchableOpacity onPress={() => {}} style={screenStyles.item} >
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text>{item.name}</Text>
                        <Text>{item.unit}</Text>
                      </View>
                    </View>
                    <View alignItems="center">
                      <TouchableOpacity style={screenStyles.button} onPress={() => _configureItem(item)}>
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
    case configuringItem:
      return(
        <View style={styles().containerm}>
          <View style={styles().body}>
            <View alignItems="center">
              <Text style={screenStyles.item}>{selectedItem.name}</Text>
            </View>
            <TextInput style={{marginLeft: "30%", marginRight: "30%"}} keyboardType="decimal-pad" onChangeText={text => _changeAmount(text)}/>
            <View alignItems="center">
              <TouchableOpacity style={screenStyles.button} onPress={() => _addItemToShoppingList(selectedItem)}>
                <Text style={{ color: "#fff" }}>Add Item</Text>
              </TouchableOpacity>
            </View>
            <SafeAreaView style={{color:"#ccc", marginBottom: 200}}>
              <FlatList
                decelerationRate='normal'
                showsVerticalScrollIndicator={false}
                data={availableShops}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => setSelectedShop(item.shop)} style={[item.shop === selectedShop ? screenStyles.highlightedItem : screenStyles.item]}>
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text>Shop: {item.shop}</Text>
                        <Text>Price: {item.price}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>)}
                keyExtractor={item => item.shop.toString()}
              />
            </SafeAreaView>
          </View>
        </View>
      );
    case optimizingList:
      return(
        <View style={styles().containerm}>
          <View style={styles().body}>
            <View alignItems="center">
              <TouchableOpacity style={screenStyles.button} onPress={() => _optimizeList()}>
              <Text style={{ color: "#fff" }}>Optimize</Text>
            </TouchableOpacity>
            </View>
            <SafeAreaView>
              <FlatList
                decelerationRate='normal'
                showsVerticalScrollIndicator={false}
                data={listShops}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => _chooseShop(item)} style={[chosenShops.find(x => x == item) ? screenStyles.highlightedItem : screenStyles.item]}>
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text>Shop: {item}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>)}
              />
            </SafeAreaView>
          </View>
        </View>
      );
    case comparingOptimizedList:
      return (
        <View style={styles().containerm}>
          <View style={styles().body}>
            <SafeAreaView>
            <FlatList
              decelerationRate='normal'
              showsVerticalScrollIndicator={false}
              data={optimizedList}
              renderItem={({item}) => (<TouchableOpacity onPress={() => {}} style={screenStyles.item} >
                  <View style={screenStyles.divider}>
                    <View style={screenStyles.leftText}>
                      <Text>{item.name}</Text>
                      <Text>{item.shop}</Text>
                      <Text>{item.amount}</Text>
                      <Text>{(item.pricePerUnit) * item.amount}</Text>
                    </View>
                  </View>
                  </TouchableOpacity>)}
                  keyExtractor={item => item.name.toString()}
                />
              </SafeAreaView>
          </View>
        </View>
      );
    default:
      console.log("nothing");
      return null;
  }
}
export default NewListScreen;