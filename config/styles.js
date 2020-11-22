import {StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';

import configColors from './colors';

const style = () =>
{
    const {colors} = useTheme();

    return StyleSheet.create({
        //used in the main three windows
        body: {
            flex: 0,
            flexGrow: 1,
            flexDirection: "column",
            height: '95%',
            width: '95%',
            marginTop: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderColor: '#000',
            backgroundColor: colors.background
        },
        
        //used in other menu windows
        bodym: {
            flex: 0,
            flexGrow: 1,
            flexDirection: "column",
            backgroundColor: colors.background,
            height: '95%',
            width: '95%',
            marginTop: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderColor: '#000'
        },
    
        btnStyle:{
            backgroundColor: configColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            padding: 15,
            marginLeft: 10,
            marginRight: 10,
            borderWidth: 1
        },
    
        buttonOnBot:{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 25
        },
        //used in the main three windows
        container: {
            flex: 1,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            backgroundColor: '#1c1c1c',
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
        },
    
        //used in other menu windows
        containerm: {
            flex: 1,
            flexGrow: 1,
            backgroundColor: '#1db954',
            alignItems: 'center',
            justifyContent: 'center',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            padding: 30,
            paddingBottom: 0
        },
    
        title: {
            fontSize: 20, 
            color: configColors.primary, 
            fontWeight: 'bold'
        }
    });
}

export default style;