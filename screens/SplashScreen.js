import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors'

const SplashScreen = ({ navigation }) => {
    //const { colors } = useTheme();
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <LinearGradient
            // Background Linear Gradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 300,
            }}/>
            <View style={styles.header}>
                <Animatable.Image
                animation="bounceIn"
                duration={2500}
                source={require('../assets/stadia.png')}
                style={styles.logo}
                resizeMode="stretch"
                />
            </View>
            <Animatable.View
                  style={[styles.footer, {
                    backgroundColor: configColors.secondary
                }]}
                animation="fadeInUpBig"
                delay={500}
                duration={1000}
            >
                <Text style={[styles.title, {
                color: configColors.primary
            }]}>Follow up your shopping habits and save up!</Text>
                <Text sstyle={[styles.title, {
                color: configColors.primary
            }]}>Sign in with account</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                        <LinearGradient
                            colors={['#08d4c4', '#1db954']}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Get Started</Text>
                            <MaterialIcons
                                name="navigate-next"
                                color="#fff"
                                size={20}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1db954'
    },
    header: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});