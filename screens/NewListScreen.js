import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const NewListScreen = ({ navigation }) => {

    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.body} backgroundColor={theme.dark ? '#1c1c1c' : '#fff'}>
            
          </View>
    </View>
    );
};

export default NewListScreen;

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
        paddingTop: 10,
        paddingBottom: 0
    },
    body: {
        flex: 0,
        flexGrow: 1,
        flexDirection: "column",
        height: '100%',
        width: '95%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: '#000'
    }
  });