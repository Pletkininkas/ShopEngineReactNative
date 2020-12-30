import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { AuthContext } from '../../../components/context';

function validateIsEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

function validateIsUsername(username) {
    return /^[a-zA-Z0-9]+$/.test(username);
}

function validatePassword(password) {
    return /(?=.*[0-9])/.test(password);
}

const SignUpScreen = ({ navigation }) => {

    const [data, setData] = React.useState ({
        useremail: '',
        username: '',
        password: '',
        confirm_password: '',
        check_emailInputChange: false,
        check_nameInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true
    });

    const { signUp } = React.useContext(AuthContext);

    const emailInputChange = (value) => {
        if(validateIsEmail(value)) {
            setData({
                ...data,
                useremail: value,
                check_emailInputChange: true
            });
        } else {
            setData({
                ...data,
                useremail: value,
                check_emailInputChange: false
            });
        }
    };

    const usernameInputChange = (value) => {
        if( value.length > 3 && validateIsUsername(value)) {
            setData({
                ...data,
                username: value,
                check_nameInputChange: true
            });
        } else {
            setData({
                ...data,
                username: value,
                check_nameInputChange: false
            });
        }
    };

    const handlePasswordChange = (value) => {
        setData({
            ...data,
            password: value
        });
    }

    const handleConfirmPasswordChange = (value) => {
        setData({
            ...data,
            confirm_password: value
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const registerHandle = (useremail, username, password, confirm_password) => {
        if (password == confirm_password && validatePassword(password)) {
            if (username.length > 3 && validateIsEmail(useremail) && validateIsUsername(username))
            {
                signUp(useremail, username, password, confirm_password);
            } else {
                let errorMessage = 'Username is not valid.';
                if (!validateIsEmail(useremail))
                    errorMessage = 'Email is not valid.'
                if (username.length <= 3)
                    errorMessage = 'Username must have atleast 4 characters.';
                Alert.alert(
                'Sign Up - Error',
                errorMessage,
                [
                { text: 'OK', onPress: () => {} }
                ],
                { cancelable: true }
                );
            }
        } else {
            let errorMessage = 'Password should have atleast one number.';
            if (password != confirm_password)
                errorMessage = 'Passwords do not match.';
            if (password.length < 8)
                errorMessage = 'Password is too short (atleast 8 symbols and 1 numeric character)';
            Alert.alert(
                'Sign Up - Error',
                errorMessage,
                [
                { text: 'OK', onPress: () => {} }
                ],
                { cancelable: true }
                );
        }
    }

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
                <Text style={styles.text_header}>Register now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
            <ScrollView decelerationRate='fast' showsVerticalScrollIndicator={false}>
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="envelope"
                        colors='#05375a'
                        size={16}
                    />
                    <TextInput
                        placeholder="Your Email"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value)=> emailInputChange(value)}
                    />
                    {data.check_emailInputChange ?
                    <Animatable.View
                        animation="bounceIn"
                    >
                    <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                    </Animatable.View>
                    : null }
                </View>

                <Text style={[styles.text_footer, {
                    marginTop: 35
                }]}>Username</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user"
                        colors='#05375a'
                        size={20}
                    />
                    <TextInput
                        placeholder="Your username"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value)=> usernameInputChange(value)}
                    />
                    {data.check_nameInputChange ?
                    <Animatable.View
                        animation="bounceIn"
                    >
                    <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                    </Animatable.View>
                    : null }
                </View>

                <Text style={[styles.text_footer, {
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors='#05375a'
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value)=> handlePasswordChange(value)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                        <Feather
                            name="eye-off"
                            color="grey"
                            size={20}
                        />
                        :
                        <Feather
                            name="eye"
                            color="grey"
                            size={20}
                        />
                        }
                    </TouchableOpacity>
                </View>

                <Text style={[styles.text_footer, {
                    marginTop: 35
                }]}>Confirm Password</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        colors='#05375a'
                        size={20}
                    />
                    <TextInput
                        placeholder="Confirm Your Password"
                        secureTextEntry={data.confirm_secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value)=> handleConfirmPasswordChange(value)}
                    />
                    <TouchableOpacity
                        onPress={updateConfirmSecureTextEntry}
                    >
                        {data.confirm_secureTextEntry ?
                        <Feather
                            name="eye-off"
                            color="grey"
                            size={20}
                        />
                        :
                        <Feather
                            name="eye"
                            color="grey"
                            size={20}
                        />
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={() => {registerHandle( data.useremail, data.username, data.password, data.confirm_password )}}
                        style={[styles.sign ]}
                    >
                        <LinearGradient
                            colors={['#08d4c4', '#1db954']}
                            style={styles.sign} >
                                <Text style={[styles.textSign, { color:'#fff' }]}>
                                    Sign Up
                                </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.sign, {
                            borderColor: '#009387',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#009387'
                        }]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1db954'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a'
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    sign: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});