import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import HomeScreen from './HomeScreen'
import ScanScreen from './ScanScreen'
import NewListScreen from './NewListScreen'

const HomeStack = createStackNavigator();
const ScanStack = createStackNavigator();
const NewListStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      barStyle={{
        backgroundColor: '#121212'
        }}
      activeColor="#1db954"
      inactiveColor="#E9F1F7"
      shifting={true}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        style={styles}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-menu" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStackScreen}
        style={styles}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-qr-scanner" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="NewList"
        component={NewListStackScreen}
        style={styles}
        options={{
          tabBarLabel: 'NewList',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-add" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
)

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
    <HomeStack.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerStyle: {
        backgroundColor: '#1db954',
    },
    headerTintColor: '#000',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff'
    }
    }}>
    <HomeStack.Screen name="What's new?" component={HomeScreen} options={{
        headerLeft: () => {
        <Ionicons.Button name="ios-menu" size={25} backgroundColor="#00ffff" onPress={() => navigation.openDrawer()}></Ionicons.Button>
        },
    }}/>
    </HomeStack.Navigator>
);
  
const ScanStackScreen = ({navigation}) => (
<ScanStack.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerStyle: {
    backgroundColor: '#1db954'
    },
    headerTintColor: '#000',
    headerTitleStyle: {
    fontWeight: 'bold',
    color: '#fff'
    }
    }}>
    <ScanStack.Screen name="New Receipt Scan" component={ScanScreen} options={{
    headerLeft: () => {
        <Ionicons.Button name="ios-settings" size={25} backgroundColor="#00ffff" onPress={() => navigation.openDrawer()}></Ionicons.Button>
    }
    }}/>
</ScanStack.Navigator>
);
  
const NewListStackScreen = ({navigation}) => (
<NewListStack.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerStyle: {
    backgroundColor: '#1db954'
    },
    headerTintColor: '#000',
    headerTitleStyle: {
    fontWeight: 'bold',
    color: '#fff'
    }
    }}>
    <NewListStack.Screen name="New Shopping List" component={NewListScreen} options={{
    headerLeft: () => {
        <Ionicons.Button name="ios-add" size={25} backgroundColor="#00ffff" onPress={() => navigation.openDrawer()}></Ionicons.Button>
    }
    }}/>
</NewListStack.Navigator>
);

const styles = StyleSheet.create({
    tabBar: {
      height: 49, // Default tab bar height in iOS 10
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: 'rgba(0, 0, 0, .2)',
      backgroundColor: '#f4f4f4', // Default background color in iOS 10
    },
    tab: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-end',
    },
    iconInBar: {
      flexGrow: 1,
    },
    label: {
      textAlign: 'center',
      fontSize: 10,
      marginBottom: 1.5,
      backgroundColor: 'transparent',
    },
    icon: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });