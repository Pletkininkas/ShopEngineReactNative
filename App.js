import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert, Keyboard, StatusBar, StyleSheet } from 'react-native';
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

import { AuthContext, apiUrl } from './components/context';

import RootStackScreen from './screens/root/RootStackScreen'

import AsyncStorage from '@react-native-community/async-storage'

import config, { user, setUser } from './config'

const Drawer = createDrawerNavigator();

/* function sleep(ms) {
  return new Promise(reslove => setTimeout(reslove, ms));
} */

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const [screenIsWaiting, setScreenIsWaiting] = React.useState(false);

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
      console.log(screenIsWaiting);
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
          user.token = userToken;
          user.username = userName;
        } catch(e) {
          Alert.alert(
            'Sign In - Error',
            'Application does not have privileges to device storage',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed (no storage privileges)') }
            ],
            { cancelable: true }
          );
        }
      } else {
        Alert.alert(
          'Sign In',
          errorMessage,
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
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
      } catch(e) {
        console.log(e);
      }
      setIsDarkTheme(false);
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
        Alert.alert(
          'Sign Up - Success',
          'You have successfully signed up!\nNow you can log in.',
          [
            { text: 'OK', onPress: () => {} }
          ],
          { cancelable: true }
        );
      }
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
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
        user.userName = userName;
        setUser(userName, userToken);
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
    
   };


  return (
    <PaperProvider theme={theme}>
      <StatusBar hidden={true} />
    <AuthContext.Provider value={authContext}>
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
    </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  }
});