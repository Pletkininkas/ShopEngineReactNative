import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';

const SettingsScreen = () => {
    return (
      <View style={styles.mainContainer}>
            <View style={styles.navBar}>
                <Text style={{fontSize: 20, color: '#fff', fontWeight: 'bold'}}>Settings</Text>
            </View>
            <View style={styles.body}>
                <Text>Settings Screen</Text>
            </View>
      </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1db954'
      },
      navBar: {
        display: 'none',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        height: 60,
      },
      body: {
        flex: 1,
        display: 'flex',
      },
});