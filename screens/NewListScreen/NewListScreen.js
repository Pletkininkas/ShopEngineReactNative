import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, SafeAreaView, FlatList, Item, ListItem, TouchableHighlight, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from '../../config/styles';
import screenStyles from './styles.js'
import State from './state.js'

import config from '../../config';
import { TextInput } from 'react-native-paper';
import { debug, max, min } from 'react-native-reanimated';
import { ThemeColors } from 'react-navigation';

const NewListScreen = ({ navigation }) => {

  const [screenState, setScreenState] = useState(State.ScreenState.viewingList)
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [availableShops, setAvailableShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [optimizedList, setOptimizedList] = useState([]);
  const [onlyReplaceUnspecifiedShops, setOnlyReplaceUnspecifiedShops] = useState(false);
  const [chosenShops, setChosenShops] = useState([]);
  const [listShops, setListShops] = useState([]);

  const theme = useTheme();

  useState(() => {fetchProducts().then(data => {setProducts(data); setDisplayedProducts(data)})}, []);

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
      setDisplayedProducts(products);
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
      _searchProducts("");
    });
    return unsubscribe;
  }, [navigation]);

  async function fetchProducts(){
    var products = []
    try{
        var response = fetch(config.API_URL+'product', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
        });
        var data = await response;
        products = await data.json();
    }catch(err){
        console.log(err);
    }
    return products.data;
  }

  const _searchProducts = async (entry) => {
    var upperEntry = entry.toUpperCase();
    if (entry === ""){
      setDisplayedProducts(products);
    }else{
      setDisplayedProducts(products.filter(x => x.name.toUpperCase().includes(upperEntry)));
    }
  }

  const _selectItem = () => {
    setScreenState(selectingItem);
  }

  const _configureItem = async (item) => {
    setSelectedAmount(1);
    
    var shopPrices = getItemShops(item);
    shopPrices.unshift({shop: "ANY", price: "-"});

    setSelectedShop(shopPrices[0].shop);
    setAvailableShops(shopPrices);
    setSelectedItem(item);
    setScreenState(configuringItem);
  }

  const _checkSpecifiedShops = () => {
    setOnlyReplaceUnspecifiedShops(!onlyReplaceUnspecifiedShops);
  }

  function getItemShops(item){
    var shopPrices = []
    for(var i in item.shopPrices){
      var newPrice = { shop: i, price: item.shopPrices[i] };
      shopPrices.push(newPrice);
    }
    return shopPrices;
  }

  function getListItemShop(item){
    var product = products.find(x => x.name == item.name);
    if(product == undefined) return undefined;
    for(var shop in product.shopPrices){
      if(shop == item.shop){
        return { shop: shop, price: product.shopPrices[shop] };
      }
    }
  }

  function calculatePriceRange(list){
    var minPrice = 0;
    var maxPrice = 0;
    var i = 0;
    for(i = 0; i < list.length; i++){
      var item = list[i];
      if(item.shop == "ANY" || item.shop == "UNKNOWN"){
        var price = getMinMaxPrices(item);
        minPrice += price.min;
        maxPrice += price.max;
      }else{
        var shopPrice = getListItemShop(item);
        if(shopPrice != undefined){
          var price = item.amount * shopPrice.price;
          minPrice += price;
          maxPrice += price;
        }
      }
    }
    
    return {min: minPrice, max: maxPrice};
  }

  function getMinMaxPrices(item){
    var minPrice = Number.POSITIVE_INFINITY;
    var maxPrice = Number.NEGATIVE_INFINITY;
    var product = products.find(x => x.name == item.name);
    if(product != undefined){
      for(var shop in product.shopPrices){
        var price = product.shopPrices[shop] * item.amount;
        if(price < minPrice) minPrice = price;
        if(price > maxPrice) maxPrice = price;
      }
    }
    if(minPrice == Number.POSITIVE_INFINITY || maxPrice == Number.NEGATIVE_INFINITY){
      minPrice = 0;
      maxPrice = 0;
    }
    return {min: minPrice, max: maxPrice};
  }

  function displayPrice(range){
    var priceString = "";
    if(range.min == range.max){
      priceString = range.min.toFixed(2).toString();
    }else{
      priceString = range.min.toFixed(2).toString() + " - " + range.max.toFixed(2).toString();
    }
    return priceString;
  }

  const _getListShops = () => {
    var listOfShops = [];
    for(var item in shoppingList){
      var product = products.find(x => x.name == shoppingList[item].name);
      var shops = getItemShops(product);
      for(var index in shops){
        var shop = shops[index].shop;
        if(listOfShops.find(x => x == shop)) continue;
        listOfShops.push(shop);
      }
    }
    setListShops(listOfShops);
  }

  const _configureOptimization = () =>{
    _getListShops();
    setScreenState(optimizingList);
  }

  const _optimizeList = async () => {
    setScreenState(comparingOptimizedList);
    await _getOptimizedList();
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
    _searchProducts("");
  }

  const _removeItemFromShoppingList = (item) => {
      let removed = shoppingList.filter(x => x.name != item.name || x.shop != item.shop);
      setShoppingList(removed);
  }

  const _replaceShoppingList = () => {
    setShoppingList(optimizedList);
    setScreenState(viewingList);
    setOptimizedList([]);
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
        var shop = item.shop == "ANY" ? "UNKNOWN" : item.shop;
        items.push({ name: item.name, amount: item.amount, shop: shop });
      }

      var content = { shoppingList: items, allowedShops: chosenShops, onlyReplaceUnspecifiedShops: onlyReplaceUnspecifiedShops};

      console.log(content);

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
      setOptimizedList(json);
    }catch (error) {
      console.error('ERROR:' + error);
    }
  }

  function comaparePriceRanges(list1, list2){
    var range1 = calculatePriceRange(list1);
    var range2 = calculatePriceRange(list2);

    var minDiff = range1.min - range2.max;
    var maxDiff = range1.max - range2.min;

    return ({min: minDiff, max: maxDiff});
  }

  const {viewingList, selectingItem, configuringItem, optimizingList, comparingOptimizedList} = State.ScreenState;
  switch(screenState){
    case viewingList:
      return (
        <View style={styles().containerm}>
          <View style={styles().body}>
            <View alignItems="center">
              <TouchableOpacity 
                style={[screenStyles.button, {marginBottom: 0}]} 
                onPress={() => _selectItem()}>
                <Text style={{color: theme.dark ? '#fff' : '#000'}}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={shoppingList.length > 0 ? screenStyles.button : screenStyles.disabledButton} 
                disabled={shoppingList.length > 0 ? false : true} 
                onPress={() => _configureOptimization()}>
                <Text style={shoppingList.length > 0 ? {color: theme.dark ? '#fff' : '#000'} : screenStyles.disabledText}>Find Cheaper List</Text>
              </TouchableOpacity>
              <Text style={{marginBottom: 20, color: theme.dark ? '#fff' : '#000'}}>Estimated Price: {displayPrice(calculatePriceRange(shoppingList))}</Text>
            </View>
            <SafeAreaView style={{color:"#ccc", marginBottom: 180}}>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={shoppingList}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      onPress={() => {}} 
                      style={[screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}]}>
                      <View style={screenStyles.divider}>
                        <View style={screenStyles.leftText}>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.name}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.unit}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>x{item.amount}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.shop}</Text>
                        </View>
                      </View>
                      <View alignItems="center">
                        <TouchableOpacity 
                          style={screenStyles.button} 
                          onPress={() => _removeItemFromShoppingList(item)}>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>)}
                    keyExtractor={item => item.name.toString() + item.shop}
                />
            </SafeAreaView>
          </View>
        </View>
      );
    case selectingItem:
      return (
        <View style={styles().containerm}>
            <View style={styles().body}>
              <TextInput style={{height: 50, marginRight: "20%", marginLeft: "20%", marginTop: 10, marginBottom: 10}} 
                placeholder="Search" 
                onChangeText={text => _searchProducts(text)}/>
              <SafeAreaView style={{color:"#ccc", marginBottom:70}}>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={displayedProducts}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      onPress={() => {}} 
                      style={[screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}]}>
                      <View style={screenStyles.divider}>
                        <View style={screenStyles.leftText}>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.name}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.unit}</Text>
                        </View>
                      </View>
                      <View alignItems="center">
                        <TouchableOpacity 
                          style={screenStyles.button} 
                          onPress={() => _configureItem(item)}>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>Select</Text>
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
              <Text style={[screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}, {color: theme.dark ? '#fff' : '#000'}]}>{selectedItem.name}</Text>
            </View>
            <TextInput 
              style={{marginLeft: "30%", marginRight: "30%"}} 
              placeholder="Amount" 
              defaultValue={selectedAmount.toString()} 
              keyboardType="decimal-pad" 
              onChangeText={text => _changeAmount(text)}/>
            <View alignItems="center">
              <TouchableOpacity style={screenStyles.button} 
                onPress={() => _addItemToShoppingList(selectedItem)}>
                <Text style={{color: theme.dark ? '#fff' : '#000'}}>Add Item</Text>
              </TouchableOpacity>
            </View>
            <SafeAreaView style={{color:"#ccc", marginBottom: 200}}>
              <FlatList
                decelerationRate='normal'
                showsVerticalScrollIndicator={false}
                data={availableShops}
                renderItem={({item}) => (
                  <TouchableOpacity 
                    onPress={() => setSelectedShop(item.shop)} 
                    style={item.shop === selectedShop ? screenStyles.highlightedItem : [screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}]}>
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text style={{color: theme.dark ? '#fff' : '#000'}}>Shop: {item.shop}</Text>
                        <Text style={{color: theme.dark ? '#fff' : '#000'}}>Price: {item.price}</Text>
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
              <TouchableOpacity 
                style={chosenShops.length > 0 ? screenStyles.button : screenStyles.disabledButton} 
                disabled={chosenShops.length > 0 ? false : true} 
                onPress={() => _optimizeList()}>
                <Text style={chosenShops.length > 0 ? {color: theme.dark ? '#fff' : '#000'} : screenStyles.disabledText}>Generate Cheaper List</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={onlyReplaceUnspecifiedShops ? screenStyles.highlightedItem : [screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}]} 
                onPress={() => _checkSpecifiedShops()}>
                <View style={screenStyles.leftText}>
                  <Text style={{color: theme.dark ? '#fff' : '#000'}}>Only replace unspecified shops</Text>
                </View>
              </TouchableOpacity>
              <Text style={{color: theme.dark ? '#fff' : '#000'}}>Select shops you can visit:</Text>
            </View>
            <SafeAreaView>
              <FlatList
                decelerationRate='normal'
                showsVerticalScrollIndicator={false}
                data={listShops}
                renderItem={({item}) => (
                  <TouchableOpacity 
                    onPress={() => _chooseShop(item)} 
                    style={chosenShops.find(x => x == item) ? screenStyles.highlightedItem : [screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}]}>
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text style={{color: theme.dark ? '#fff' : '#000'}}>Shop: {item}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>)}
                  keyExtractor={item => item}
              />
            </SafeAreaView>
          </View>
        </View>
      );
    case comparingOptimizedList:
      if(optimizedList.length > 0){
      return (
          <View style={styles().containerm}>
            <View style={styles().body}>
              <View alignItems="center">
                <TouchableOpacity 
                  style={screenStyles.button} 
                  onPress={() => _replaceShoppingList()}>
                  <View style={screenStyles.leftText}>
                    <Text style={{color: theme.dark ? '#fff' : '#000'}}>Replace</Text>
                  </View>
                </TouchableOpacity>
                <Text style={{margin:10, color: theme.dark ? '#fff' : '#000'}}>Estimated Price: {displayPrice(calculatePriceRange(optimizedList))}</Text>
                <Text style={{margin:10, color: theme.dark ? '#fff' : '#000'}}>This list will save you: {displayPrice(comaparePriceRanges(shoppingList, optimizedList))}</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={optimizedList}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      onPress={() => {}} 
                      style={[screenStyles.item, {backgroundColor: theme.dark ? '#3d3d3d' : '#f2fcf6'}]}>
                      <View style={screenStyles.divider}>
                        <View style={screenStyles.leftText}>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.name}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.shop}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{item.amount}</Text>
                          <Text style={{color: theme.dark ? '#fff' : '#000'}}>{(item.pricePerUnit * item.amount).toFixed(2)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>)}
                    keyExtractor={item => item.name.toString()}
                  />
              </SafeAreaView>
            </View>
          </View>
        );
      }else{
        return(
          <View style={styles().containerm}>
            <View style={styles().body}>
              <View alignItems="center" style={{height: '100%', justifyContent: "center"}}>
                <Text style={{fontSize: 32, color: theme.dark ? '#fff' : '#000'}}>Loading...</Text>
              </View>
            </View>
          </View>
        );
      }
    default:
      console.log("nothing");
      return null;
  }
}
export default NewListScreen;