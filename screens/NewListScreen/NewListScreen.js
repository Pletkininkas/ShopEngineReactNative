import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from '../../config/styles';
import screenStyles from './styles.js'
import State from './state.js'

import config from '../../config';
import { TextInput } from 'react-native-paper';
import {ShoppingListContext} from '../../components/context'

const NewListScreen = ({navigation}) => {

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
  const [listName, setListName] = useState("");
  const [searchText, setSearchText] = useState("");

  const theme = useTheme();
  const textColor = theme.dark ? '#fff' : '#000';
  const itemColor = theme.dark ? '#3d3d3d' : '#f2fcf6';
  const listsContext = useContext(ShoppingListContext);

  useState(() => {fetchProducts().then(data => {setProducts(data); setDisplayedProducts(data)})}, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      listsContext.setCurrentList(null);
      setShoppingList([]);
      setSelectedItem(null);
      setSelectedShop(null);
      setOptimizedList([]);
      setListShops([]);
      setOnlyReplaceUnspecifiedShops(false);
      setScreenState(viewingList);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedAmount(1);
      setAvailableShops([]);
      setSelectedShop(null);
      setChosenShops([]);
      setScreenState(viewingList);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    editList();
  }, [listsContext.currentList]);

  const editList = () => {
    //console.log(listsContext.currentList);
    if(listsContext.currentList != undefined && listsContext.currentList != null){
      setShoppingList(listsContext.currentList.items);
      setListName(listsContext.currentList.name);
    }else{
      setShoppingList([]);
      setListName("");
    }
    
  }

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
        console.error(err);
    }
    return products.data;
  }

  const _searchProducts = async (entry) => {
    setSearchText(entry);
    var upperEntry = entry.toUpperCase();
    if (entry === ""){
      setDisplayedProducts(products);
    }else{
      setDisplayedProducts(products.filter(x => x.name.toUpperCase().includes(upperEntry)));
    }
  }

  const _selectItem = () => {
    _searchProducts("");
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

  const renderShopLogo = (shopName, specificStyle) => {
    switch (shopName) {
      case 'NORFA':
        return <Image style={specificStyle != null ? specificStyle : screenStyles.modalShopImage} source={require('../../assets/shop_logos/NORFA.png')}></Image>
      case 'MAXIMA':
        return <Image style={specificStyle != null ? specificStyle : screenStyles.modalShopImage} source={require('../../assets/shop_logos/MAXIMA.png')}></Image>
      case 'IKI':
        return <Image style={specificStyle != null ? specificStyle : screenStyles.modalShopImage} source={require('../../assets/shop_logos/IKI.png')}></Image>
      case 'RIMI':
        return <Image style={specificStyle != null ? specificStyle : screenStyles.modalShopImage} source={require('../../assets/shop_logos/RIMI.png')}></Image>
      case 'LIDL':
        return <Image style={specificStyle != null ? specificStyle : screenStyles.modalShopImage} source={require('../../assets/shop_logos/LIDL.png')}></Image>
      default:
        //return <Text style={{fontSize: 20, textAlign: 'center'}}>?</Text>
        break;
    }
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
    setChosenShops([]);
    setOnlyReplaceUnspecifiedShops(false);
    setScreenState(State.ScreenState.optimizingList);
  }

  const _optimizeList = async () => {
    setScreenState(State.ScreenState.loading);
    await _getOptimizedList();
    setScreenState(State.ScreenState.comparingOptimizedList);
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

    var newList = []

    for(var id in optimizedList){
      var item = optimizedList[id];
      var shop = item.shop == "UNKNOWN" ? "ANY" : item.shop; 
      newList.push({name: item.name, unit: item.unit, amount: item.amount, shop: shop});
    }

    setShoppingList(newList);
    setScreenState(viewingList);
    setOptimizedList([]);
    _searchProducts("");
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

  const _saveList = () => {
    
    var oldLists = [...listsContext.shoppingLists];
    var foundList = oldLists.find(x => x.name == listName);
    if(foundList == undefined){
      var newList = { name: listName, items: shoppingList };
      oldLists.push(newList);
    }else{
      foundList.items = shoppingList;
    }

    listsContext.setShoppingLists(oldLists);
    listsContext.saveLists(oldLists);
    navigation.navigate('Home');
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

  const {viewingList, selectingItem, configuringItem, optimizingList, comparingOptimizedList, loading} = State.ScreenState;
  switch(screenState){
    case viewingList:
      return (
        <View style={styles().containerm}>
          <View style={styles().body}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: "center", padding: 5, marginLeft: '3%', marginRight: '3%'}}>
              <TextInput
                  style={{height: 80, flex: 2, alignSelf: 'center', marginLeft: '15%'}}
                  placeholder="Name"
                  value={listName}
                  defaultValue={listName}
                  onChangeText={text => setListName(text)}/>
              <TouchableOpacity 
                  style={[shoppingList.length > 0 ? screenStyles.smallButton : screenStyles.disabledSmallButton, {flex: 1, alignSelf: 'center'}]} 
                  onPress={() => _saveList()}
                  disabled={shoppingList.length > 0 ? false : true}>
                  <Text style={shoppingList.length > 0 ? {color: textColor} : screenStyles.disabledText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View alignItems="center" style={{marginLeft: '5%', marginRight: '3%', flex: 0.3}}>
            <Text style={{fontSize: 18, marginBottom: 0, color: textColor, alignSelf: "center", marginTop: 0, flexWrap: "wrap", flex: 2}}>Estimated Price: {displayPrice(calculatePriceRange(shoppingList))}€</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 0.5, justifyContent: "center", marginLeft: '3%', marginRight: '3%', marginTop: 5}}>
              <TouchableOpacity 
                style={[screenStyles.button, {marginTop: 0}]} 
                onPress={() => _selectItem()}>
                <Text style={{color: textColor}}>Add Item</Text>
              </TouchableOpacity>
              <View style={{flex: 0.5}}/>
              <TouchableOpacity 
                style={[shoppingList.length > 0 ? screenStyles.button : screenStyles.disabledButton, {marginTop: 0}]} 
                disabled={shoppingList.length > 0 ? false : true} 
                onPress={() => _configureOptimization()}>
                <Text style={shoppingList.length > 0 ? {color: textColor} : screenStyles.disabledText}>Find Cheaper List</Text>
              </TouchableOpacity>
            </View>
            <SafeAreaView style={{color:"#ccc", flex: 3}}>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={shoppingList}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      onPress={() => {}} 
                      style={[screenStyles.item, {backgroundColor: itemColor}]}>
                      <View style={screenStyles.divider}>
                        <View style={[screenStyles.leftText, {flexDirection: 'row'}]}>
                          <View style={{flex: 1}}>
                            <Text style={{color: textColor, fontSize: 16}}>{item.name}</Text>
                            <Text style={{color: textColor}}>{item.unit}</Text>
                            <Text style={{color: textColor}}>x{item.amount}</Text>
                            <Text style={{color: textColor}}>{item.shop}</Text>
                          </View>
                          <View>
                            {renderShopLogo(item.shop, screenStyles.largeShopImage)}
                          </View>
                        </View>
                      </View>
                      <View alignItems="center">
                        <TouchableOpacity 
                          style={screenStyles.button} 
                          onPress={() => _removeItemFromShoppingList(item)}>
                          <Text style={{color: textColor}}>Remove</Text>
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
              <View style={{flexDirection: 'row', marginTop: 5, padding: 10}}>
                <TextInput style={{height: 50, flex: 3, marginLeft: '20%'}} 
                  placeholder="Search"
                  value={searchText}
                  onChangeText={text => _searchProducts(text)}/>
                <View style={{flex: 0.2}}/>
                <TouchableOpacity 
                  style={[screenStyles.button, {flex: 1}]} 
                  onPress={() => setScreenState(State.ScreenState.viewingList)}>
                  <Text style={{color: textColor}}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <SafeAreaView style={{color:"#ccc", marginBottom:70}}>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={displayedProducts}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      onPress={() => {}} 
                      style={[screenStyles.item, {backgroundColor: itemColor}]}>
                      <View style={screenStyles.divider}>
                        <View style={screenStyles.leftText}>
                          <Text style={{color: textColor}}>{item.name}</Text>
                          <Text style={{color: textColor}}>{item.unit}</Text>
                        </View>
                      </View>
                      <View alignItems="center">
                        <TouchableOpacity 
                          style={screenStyles.button} 
                          onPress={() => _configureItem(item)}>
                          <Text style={{color: textColor}}>Select</Text>
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
              <Text style={[screenStyles.item, {backgroundColor: itemColor}, {color: textColor}]}>{selectedItem.name}</Text>
            </View>
            <TextInput 
              style={{marginLeft: "30%", marginRight: "30%"}}
              alignItems="center"
              placeholder="Amount" 
              defaultValue={selectedAmount.toString()} 
              keyboardType="decimal-pad" 
              onChangeText={text => _changeAmount(text)}/>
            <View flexDirection="row" alignSelf="center">
              <TouchableOpacity style={screenStyles.button} 
                onPress={() => _addItemToShoppingList(selectedItem)}>
                <Text style={{color: textColor}}>Add Item</Text>
              </TouchableOpacity>
              <View style={{flex: 0.3}}/>
              <TouchableOpacity style={screenStyles.button} 
                onPress={() => _selectItem()}>
                <Text style={{color: textColor}}>Cancel</Text>
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
                    style={item.shop === selectedShop ? screenStyles.highlightedItem : [screenStyles.item, {backgroundColor: itemColor}]}>
                    <View style={[screenStyles.divider]}>
                      <View style={[screenStyles.leftText, {flexDirection: 'row', width: '100%', flex: 1, display: 'flex'}]}>
                        <View style={{alignItems:'flex-start', justifyContent:'center', flex: 1}}>
                          <Text style={{color: textColor}}>Shop: {item.shop}</Text>
                          <Text style={{color: textColor}}>Price: {item.price}€</Text>
                        </View>
                        <View style={{alignItems:'flex-end', justifyContent:'center'}}>
                          {renderShopLogo(item.shop, null)}
                        </View>
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
            <View alignItems="center" style={{marginTop: 5}}>
              <View style={{flexDirection: 'row', padding: 10}}>
                <TouchableOpacity 
                  style={[chosenShops.length > 0 ? screenStyles.button : screenStyles.disabledButton, {flex: 2, marginLeft: '10%'}]} 
                  disabled={chosenShops.length > 0 ? false : true} 
                  onPress={() => _optimizeList()}>
                  <Text style={chosenShops.length > 0 ? {color: textColor} : screenStyles.disabledText}>Generate Cheaper List</Text>
                </TouchableOpacity>
                <View style={{flex: 0.3}}/>
                <TouchableOpacity style={[screenStyles.button, {flex: 1, marginRight: '10%'}]} 
                  onPress={() => setScreenState(State.ScreenState.viewingList)}>
                  <Text style={{color: textColor}}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={onlyReplaceUnspecifiedShops ? screenStyles.highlightedItem : [screenStyles.item, {backgroundColor: itemColor}]} 
                onPress={() => _checkSpecifiedShops()}>
                <View style={screenStyles.leftText}>
                  <Text style={{color: textColor}}>Only replace unspecified shops</Text>
                </View>
              </TouchableOpacity>
              <Text style={{color: textColor, fontSize: 16, margin: 5}}>Select shops you can visit:</Text>
            </View>
            <SafeAreaView>
              <FlatList
                decelerationRate='normal'
                showsVerticalScrollIndicator={false}
                data={listShops}
                renderItem={({item}) => (
                  <TouchableOpacity 
                    onPress={() => _chooseShop(item)} 
                    style={chosenShops.find(x => x == item) ? screenStyles.highlightedItem : [screenStyles.item, {backgroundColor: itemColor}]}>
                    <View style={screenStyles.divider}>
                      <View style={screenStyles.leftText}>
                        <Text style={{color: textColor}}>Shop: {item}</Text>
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
      return (
          <View style={styles().containerm}>
            <View style={styles().body}>
              <View alignItems="center">
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={[screenStyles.button, {marginTop: 20}]} 
                    onPress={() => _replaceShoppingList()}>
                    <View style={screenStyles.leftText}>
                      <Text style={{color: textColor}}>Replace</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{flex: 0.3}}/>
                  <TouchableOpacity 
                    style={[screenStyles.button, {marginTop: 20}]} 
                    onPress={() => setScreenState(State.ScreenState.viewingList)}>
                    <View style={screenStyles.leftText}>
                      <Text style={{color: textColor}}>Cancel</Text>
                    </View>
                </TouchableOpacity>
                </View>
                <Text style={{margin:5, color: textColor}}>Estimated Price: {displayPrice(calculatePriceRange(optimizedList))}€</Text>
                <Text style={{margin:5, color: textColor}}>This list will save you: {displayPrice(comaparePriceRanges(shoppingList, optimizedList))}€</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  decelerationRate='normal'
                  showsVerticalScrollIndicator={false}
                  data={optimizedList}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      onPress={() => {}} 
                      style={[screenStyles.item, {backgroundColor: itemColor}]}>
                      <View style={screenStyles.divider}>
                        <View style={[screenStyles.leftText, {flexDirection: 'row'}]}>
                          <View style={{flex: 1}}>
                            <Text style={{color: textColor, fontSize: 16}}>{item.name}</Text>
                            <Text style={{color: textColor}}>{item.unit}</Text>
                            <Text style={{color: textColor}}>x{item.amount}</Text>
                            <Text style={{color: textColor}}>{item.shop}</Text>
                            <Text style={{color: textColor}}>{(item.pricePerUnit * item.amount).toFixed(2)}€</Text>
                          </View>
                          <View>
                            {renderShopLogo(item.shop, screenStyles.largeShopImage)}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>)}
                    keyExtractor={item => item.name.toString()}
                  />
              </SafeAreaView>
            </View>
          </View>
        );
    case loading:
      return(
        <View style={styles().containerm}>
          <View style={styles().body}>
            <View alignItems="center" style={{height: '100%', justifyContent: "center"}}>
              <Image style={{width:128, height:128}} source={require('../../assets/loading.gif')}/>
              <Text style={{color:'green'}}> Loading... </Text>
            </View>
          </View>
        </View>
      );
    default:
      return null;
  }
}
export default NewListScreen;