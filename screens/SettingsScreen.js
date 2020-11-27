import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors';
import style from '../config/styles';

const SettingsScreen = () => {

  //const theme = useTheme();

    return (
      <View style={styles.mainContainer}>
            <View style={styles.navBar}>
                <Text style={style().title}>Settings</Text>
            </View>
            <View style={styles.body}>
                
            </View>
      </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: '#1db954',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      paddingTop: 30,
      paddingBottom: 0
  },
  body: {
      flex: 0,
      flexGrow: 1,
      flexDirection: "column",
      height: '95%',
      width: '95%',
      marginTop: 10,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      borderColor: '#000'
  }
});