import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

const ProfileScreen = () => {

    const theme = useTheme();

    return (
      <View style={styles.container}>
          <View>
                <Text style={{fontSize: 20, color: '#fff', fontWeight: 'bold'}}>Profile</Text>
          </View>
          <View style={styles.body} backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
              
            </View>
      </View>
    );
};

export default ProfileScreen;

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
        padding: 30,
        paddingBottom: 0
    },
    body: {
        flex: 0,
        flexGrow: 1,
        flexDirection: "column",
        //backgroundColor: '#fff',
        height: '95%',
        width: '95%',
        marginTop: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: '#000'
    }
});