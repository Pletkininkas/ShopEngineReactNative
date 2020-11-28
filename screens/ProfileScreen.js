import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors';
import styles from '../config/styles';

const ProfileScreen = () => {

    const theme = useTheme();
    //const { colors } = useTheme();

    return (
      <View style={styles().containerm}>
            <View>
                <Text style={styles().title}>Profile</Text>
            </View>
            <View style={styles().bodym} backgroundColor={theme.dark ? '#1c1c1c' : '#fff'} padding={20}>
                <View>
                    <Text>Email address: Evaldas.Grublys@gmail.com</Text>
                    <Text>Username: Evaldas</Text>
                    <Text>Joined: 2020-11-27 8:30:59</Text>
                    <Button title="Change password"/>
                </View>
            </View>
      </View>
    );
};

export default ProfileScreen;
