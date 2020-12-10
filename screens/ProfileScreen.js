import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors';
import styles from '../config/styles';
import colors from '../config/colors';

import { user } from '../config'

const ProfileScreen = () => {
    const {colors} = useTheme();
    const theme = useTheme();

    return (
      <View style={styles().containerm}>
            <View>
                <Text style={styles().title}>Profile</Text>
            </View>
            <View style={styles().bodym} backgroundColor={theme.dark ? '#1c1c1c' : '#fff'} padding={20}>
                <View>
                    <Text style={{color: colors.text}}>Email address: Evaldas.Grublys@gmail.com</Text>
                    <Text style={{color: colors.text}}>Username: {user.username}</Text>
                    <Text style={{color: colors.text}}>Joined: 2020-11-27 8:30:59</Text>
                    <Button title="Change password"/>
                </View>
            </View>
      </View>
    );
};

export default ProfileScreen;
