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
        backgroundColor: '#1c1c1c',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
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