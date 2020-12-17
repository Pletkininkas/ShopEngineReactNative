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
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: "#1db954",
      borderRadius: 10,
    },
    disabledButton:{
      width: "40%",
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: "#667069",
      borderRadius: 10,
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
    }
  });