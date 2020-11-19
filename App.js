import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import ShoppingHistoryScreen from './screens/ShoppingHistoryScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import { AuthContext } from './components/context';

import RootStackScreen from './screens/root/RootStackScreen'

import AsyncStorage from '@react-native-community/async-storage'

const Drawer = createDrawerNavigator();

const App = () => {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

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
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(userName, password) => {
      let userToken;
      userToken = null;
      if( userName == 'user' && password == 'pass' ) {
        try{
          userToken = 'asdasd';
          await AsyncStorage.setItem('userToken', userToken)
        } catch(e) {
          console.log(e);
        }
      }
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async() => {
      try{
        await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      
    },
  }), []);

  // Check if user is logged in
  useEffect(() => {
    setTimeout(async() => {
      let userToken;
      userToken = null;
      try{
        userToken = await AsyncStorage.getItem('userToken')
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer hideStatusBar={false}>
        { loginState.userToken != null ? (
          <Drawer.Navigator hideStatusBar={false} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen hideStatusBar={true} name="HomeDrawer" component={MainTabScreen} />
            <Drawer.Screen hideStatusBar={true} name="ShoppingHistory" component={ShoppingHistoryScreen} />
            <Drawer.Screen hideStatusBar={true} name="Statistics" component={StatisticsScreen} />
            <Drawer.Screen hideStatusBar={true} name="Profile" component={ProfileScreen} />
            <Drawer.Screen hideStatusBar={true} name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
        )
      :
        <RootStackScreen  hideStatusBar={true}/>
      }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
