import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from '../config/styles';

const NewListScreen = ({ navigation }) => {

    //const theme = useTheme();
    //const {colors} = useTheme();

    return (
        <View style={styles().container}>                  
          <View style={styles().body}>          
            </View>
      </View>
    );
};

export default NewListScreen;