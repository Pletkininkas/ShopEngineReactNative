import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    item: {
      elevation: 10,
      backgroundColor: "#f2fcf6",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      margin: 10
    },
    highlightedItem:{
      elevation: 10,
      backgroundColor: "#1db954",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      margin: 10
    },
    button:{
      width: "40%",
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: "#1db954",
      borderRadius: 10,
    },
    smallButton:{
      marginRight: '10%',
      marginLeft: '5%',
      height: '40%',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: "#1db954",
      borderRadius: 10,
    },
    disabledButton:{
      width: "40%",
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: "#667069",
      borderRadius: 10,
    },
    disabledSmallButton:{
      marginRight: '10%',
      marginLeft: '5%',
      height: '40%',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: "#667069",
      borderRadius: 10
    },
    disabledText:{
      alignSelf: 'center',
      color: 'rgba(0.5,0.5,0.5,0.5)'
    },
    leftText: {
      alignSelf: 'center'
    },
    rightButton: {
      width: 30,
      height: 50,
      alignItems: 'center'
    },
    divider: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    modalShopImage: {
      width: 50,
      height: 50,
      resizeMode: 'contain'
    },
    largeShopImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain'
    }
  });