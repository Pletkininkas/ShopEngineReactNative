import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors';
import styles from '../config/styles';

const ProfileScreen = () => {

    const theme = useTheme();
    const { colors } = useTheme();

    return (
      <View style={styles.containerm}>
            <View>
                <Text style={styles.title}>Profile</Text>
            </View>
            <View style={styles.bodym} backgroundColor={colors.background}> 

            </View>    
      </View>
    );
};

export default ProfileScreen;