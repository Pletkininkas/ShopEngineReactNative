import React from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';

//import configColors from '../config/colors';
import styles from '../config/styles';

const HomeScreen = ({ navigation }) => {
    
    //const theme = useTheme();
    //const {colors} = useTheme();

    return (
      <View style={styles().container}>        
          <View style={styles().body}>          
            </View>
      </View>

    );
};

export default HomeScreen;