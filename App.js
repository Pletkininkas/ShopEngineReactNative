import React, { useEffect } from 'react';
import { View, Alert, Keyboard, StatusBar, StyleSheet, ToastAndroid } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import ShoppingHistoryScreen from './screens/ShoppingHistoryScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import { AuthContext, ShoppingListContext, ReceiptProductContext } from './components/context';

import RootStackScreen from './screens/root/RootStackScreen'

import AsyncStorage from '@react-native-community/async-storage'

import config, { user, setUser, defaultImages } from './config'

const Drawer = createDrawerNavigator();

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [shoppingLists, setShoppingLists] = React.useState([]);
  const [currentList, setCurrentList] = React.useState(null);
  const [screenIsWaiting, setScreenIsWaiting] = React.useState(false);
  const [receiptList, setReceiptList] = React.useState([]);
  const [productList, setProductList] = React.useState([]);
  const updateReceipts = async () => {
    try {
      const sdd = await fetch(config.API_URL+'receipt', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token
        }
      });
      let data = await sdd.json();
      const _data = data.data.reverse();
      setReceiptList(_data);
      calculateSavings(_data);
    } catch (err) {
      console.log(err);
    }
  }
  
  useEffect(() => {
    if (user.token != null || user.token != undefined)
      updateReceipts();
  }, [productList]);

  const updateProducts = async () => {
    try{
      var response = fetch(config.API_URL+'product', {
          method: 'GET',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
          }
      });
      var data = await response;
      var products = await data.json();
      setProductList(products.data);
    }catch(err){
        console.error(err);
    }
  }

  function calculateSavings(_data) {
    let saved = 0;
    _data.forEach(element => {saved += _calculateSavings(element)});
    user.receiptTotalSaved = saved;
  }

  function _calculateSavings(receipt){
      var sum = 0;
      receipt.receiptProducts.forEach(product => {
          var result = getAvgPrice(product);
          if(result > product.price) {
              sum+=result - product.price;
          }
      });
      return sum;
  }

  function getAvgPrice(item){
    var sum = 0;
    var counter = 0; 
    var amount = 0;
    var product;
    if (productList != undefined)
        product = productList.find(x => x.name == item.name);
        if(product != undefined){
          if(item.pricePerQuantity > 0) amount = item.price / item.pricePerQuantity;
          else amount = 1;
            for(var shop in product.shopPrices){
              var price = product.shopPrices[shop] * amount;
              sum += price;
        counter++;
      }
    }
      return calculateAverage(sum, counter);
    }

    function calculateAverage(numerator, denominator) {
        if (denominator === 0 || isNaN(denominator)) {
              return 0;
        }
        else {
              return Math.round((numerator / denominator)*100)/100;
        }
      }

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loadShoppingLists = async () => {
    try{
      let msg = await AsyncStorage.getItem('shoppingLists');
      let loaded = await JSON.parse(msg);
      if(Array.isArray(loaded)) setShoppingLists(loaded);
      else setShoppingLists([]);
    } catch(e) {
      console.log(e);
      setShoppingLists([]);
    }
  }

  const saveShoppingLists = async (lists) => {
    try{
      await AsyncStorage.removeItem('shoppingLists');
      var json = JSON.stringify(lists);
      await AsyncStorage.setItem('shoppingLists', json)
    } catch(e) {
      console.log(e);
    }
  }

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(userName, password) => {
      setScreenIsWaiting(true);
      Keyboard.dismiss();
      let userToken;
      userToken = null;
      let success = false;
      let errorMessage = 'Fields are empty!';
      if (userName.length != 0 && password.length != 0 ) {
        const response = await fetch(config.API_URL+'auth/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: userName,
            password: password
          })
        });
        const data = await response.json();
        userToken = await data.data;
        success = data.success;
        errorMessage = data.message;
      }

      if( success ) {
        try{
          await AsyncStorage.setItem('userToken', userToken)
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('darkTheme', 'false');
          user.token = userToken;
          user.username = userName;
          updateProducts();
        } catch(e) {
          Alert.alert(
            'Sign In - Error',
            'Application does not have privileges to device storage',
            [
              { text: 'OK', onPress: () => {}}
            ],
            { cancelable: true }
          );
        }
      } else {
        if (errorMessage == null) {
          errorMessage = 'Could not connect to the server. Please try again later.';
        }
        Alert.alert(
          'Sign In',
          errorMessage,
          [
            { text: 'OK', onPress: () => {}}
          ],
          { cancelable: true }
        );
      }
      setScreenIsWaiting(false);
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async() => {
      try{
        user.token = null;
        user.username = null;
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('profileImage');
        await AsyncStorage.removeItem('darkTheme');
        await AsyncStorage.removeItem('userTotalSaved');
        await AsyncStorage.removeItem('userReceiptCount');
        await AsyncStorage.removeItem('userReceipt');
        user.receiptCount = 0;
        user.receiptTotalSaved = 0.00;
        user.receipt = null;
        user.profileImage = null;
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async(userEmail, userName, password, confirm_password) => {
      Keyboard.dismiss();
      let success = false;
      let errorMessage;
      if (password != confirm_password)
      {
        errorMessage = 'Passwords do not match!';
      } else {
        errorMessage = 'Fields are empty!';
      }
      if (userName.length != 0 && password.length != 0 && password == confirm_password) {
        const response = await fetch(config.API_URL+'auth/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            useremail: userEmail,
            username: userName,
            password: password
          })
        });
        const data = await response.json();
        success = data.success;
        errorMessage = data.message;
      }

      if( !success )
      {
        Alert.alert(
          'Sign Up - Error',
          errorMessage,
          [
            { text: 'OK', onPress: () => {} }
          ],
          { cancelable: true }
        );
      } else {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Registration was successful!', ToastAndroid.SHORT)
        } else {
            Alert.alert('Registration was successful!');
        }
        authContext.signIn(userName, password);
      }
    },
    toggleTheme: async () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
      let themeStorage = await AsyncStorage.getItem('darkTheme');
      if (themeStorage == 'true') {
        await AsyncStorage.setItem('darkTheme', 'false');
      } else {
        await AsyncStorage.setItem('darkTheme', 'true');
      }
    }
  }), []);

  // Check if user is logged in on app loading
  useEffect(() => {
    setTimeout(async() => {
      let userToken;
      userToken = null;
      try{
        userToken = await AsyncStorage.getItem('userToken')
        let userName = await AsyncStorage.getItem('userName');
        let automaticSaveReceipt = await AsyncStorage.getItem('optionAutomaticReceiptSave');
        let pushNotifications = await AsyncStorage.getItem('optionAllowPushNotifications');
        let themeStorage = await AsyncStorage.getItem('darkTheme');
        let receivedImage = await AsyncStorage.getItem('profileImage');
        if (receivedImage != null) {
            user.profileImage = receivedImage;
        } else {
            user.profileImage = defaultImages.profileImage;
        }
        if (themeStorage == 'true')
            setIsDarkTheme(isDarkTheme => !isDarkTheme);
        if (automaticSaveReceipt != null) {
          switch(automaticSaveReceipt) {
            case 'true':
              user.automaticallySaveReceipts = true;
              break;
            case 'false':
              user.automaticallySaveReceipts = false;
              break;
            default:
              user.automaticallySaveReceipts = true;
              break;
          }
        }
        if (pushNotifications != null) {
          switch(pushNotifications) {
            case 'true':
              user.allowPushNotifications = true;
              break;
            case 'false':
              user.allowPushNotifications = false;
              break;
            default:
              user.allowPushNotifications = true;
              break;
          }
        }
        user.userName = userName;
        setUser(userName, userToken);
        updateProducts();
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( screenIsWaiting ) {
    return(
      <View style={{flex:1,justifyContent:'center'}}>
        <Spinner visible={screenIsWaiting}
                 textContent={'Loading...'}
                 textStyle={styles.spinnerTextStyle}/>
      </View>
    )
  } else {
    return (
      <PaperProvider theme={theme}>
        <StatusBar hidden={true} />
          <AuthContext.Provider value={authContext}>
            <ShoppingListContext.Provider value = {{shoppingLists: shoppingLists, currentList: currentList, setCurrentList: setCurrentList, setShoppingLists: setShoppingLists, saveLists: saveShoppingLists}}>
              <ReceiptProductContext.Provider value = {{receipts: receiptList, products: productList, updateReceipts: updateReceipts }}>
                <NavigationContainer theme={theme}>
                  { loginState.userToken != null ? (
                    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                      <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
                      <Drawer.Screen name="ShoppingHistory" component={ShoppingHistoryScreen} />
                      <Drawer.Screen name="Statistics" component={StatisticsScreen} />
                      <Drawer.Screen name="Profile" component={ProfileScreen} />
                      <Drawer.Screen name="Settings" component={SettingsScreen} />
                  </Drawer.Navigator>
                  )
                :
                  <RootStackScreen/>
                }
                </NavigationContainer>
              </ReceiptProductContext.Provider>
            </ShoppingListContext.Provider>
          </AuthContext.Provider>
      </PaperProvider>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  }
});