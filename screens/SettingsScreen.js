import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors';
import styles from '../config/styles';

const SettingsScreen = () => {

  //const theme = useTheme();

    return (
      <View style={styles().containerm}>
            <View>
                <Text style={styles().title}>Settings</Text>
            </View>
            <View style={styles().bodym}>
                
            </View>
      </View>
    );
};

export default SettingsScreen;