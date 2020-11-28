import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
    useTheme,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch 
} from 'react-native-paper';

import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../components/context';
import { user, apiUrl } from '../components/context';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { color } from 'react-native-reanimated';

import configColors from '../config/colors';
import { useEffect } from 'react/cjs/react.development';

export function DrawerContent(props) {

    const paperTheme = useTheme();

    const { signOut, toggleTheme } = React.useContext(AuthContext);

    const name = user.username;

    const [receiptCount, setReceiptCount] = useState(0)

    useEffect(() => {
        let token = user.token;
        fetch(apiUrl+'/receipt', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }).then(data => {
            return data.json();
          })
          .then(data => {
            setReceiptCount(Object(data.data).length);
            user.receipt = data.data;
          })
          .catch(err => {
            console.log(err);
          });
      }, []);
    
    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView { ... props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <Icon
                            name="ios-person"
                            size={75}                            
                            color={configColors.primary}/>
                            <View style={{flexDirection: 'column', marginTop: 15, marginLeft: 20, flexWrap: "wrap"}}>
                                <Title style={styles.title}>{name}</Title>
                                <Caption style={styles.caption}>User</Caption>
                            </View>
                        </View>
                        <View style={styles.column, {marginTop: 10}}>
                            <View style={styles.section}>
                                <Paragraph style={styles.paragraph, styles.caption}>36.19€</Paragraph>
                                <Caption style={styles.caption, {marginLeft: 15}}>Money saved</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={styles.paragraph, styles.caption}>{receiptCount}</Paragraph>
                                <Caption style={styles.caption, {marginLeft: 15}}>Total Reciept Scanned</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="ios-home"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="ios-book"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Shopping History"
                            onPress={() => {props.navigation.navigate('ShoppingHistory')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="ios-stats"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Statistics"
                            onPress={() => {props.navigation.navigate('Statistics')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="ios-person"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="ios-settings"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('Settings')}}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preferences}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon name="ios-exit"
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {
                        Alert.alert("Sign Out", "Are you sure you want to sign out?",  [
                            {text: "Yes", onPress: () => signOut()},   
                            {text: "No", style: 'cancel'}                                                 
                        ])
                    }}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20,
        backgroundColor: configColors.green,
        paddingTop: 30,
        paddingBottom: 10,
        marginBottom: -10,
        marginTop: -30
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        marginBottom: 0
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preferences: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});