import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    backRightBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        width: 40,
    },
    container: {
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
        paddingTop: 10,
        paddingBottom: 0
    },
    body: {
        flex: 0,
        flexGrow: 1,
        flexDirection: "column",
        height: '100%',
        width: '95%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: '#000'
    },
    buttonOnBot:{
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
        
    },
    btnStyle:{
        backgroundColor: '#1db954',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 15,
        marginLeft: 10,
        marginRight: 10
    },
    scannedImg:{
        flex:1,
        resizeMode:"contain"
    },
    titleText:{
        fontSize: 20,
        color:'#1db954'
    },
    item: {
        backgroundColor: '#1db954',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
      },
    selectedItem: {
        backgroundColor: '#0a421e',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
    },
    productItem:{
        flex:1,
        flexDirection:'row',
        backgroundColor: '#dce0dd',
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 10
    },

});