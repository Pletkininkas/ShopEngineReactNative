import React, {useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view'

import styles from '../config/styles';
import {ShoppingListContext} from '../components/context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config, { user } from '../config';
import { PieChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
const screenWidth = Dimensions.get('window').width


const HomeScreen = ({ navigation }) => {
    
    const theme = useTheme();
    const textColor = theme.dark ? '#fff' : '#363636';
    const itemColor = theme.dark ? '#3d3d3d' : '#f2fcf6';
    const lists = useContext(ShoppingListContext);
    const [data, setData] = useState([]);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
          fetchUserReceipts();
          
      });

      return unsubscribe;
  }, [navigation]);


    const fetchUserReceipts = () => {
      let token = user.token;
      fetch(config.API_URL+'receipt', {
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
          setData(prepareData(data.data));
        })
        .catch(err => {
          console.log(err);
        });
    }

    const prepareData = (fetchedData) => {
      let shopsData = [
        { name: 'IKI', count: 0, color: 'yellow', legendFontColor: textColor, legendFontSize: 15 },
        { name: 'MAXIMA', count: 0, color: 'blue', legendFontColor: textColor, legendFontSize: 15 },
        { name: 'NORFA', count: 0, color: 'green', legendFontColor: textColor, legendFontSize: 15 },
        { name: 'RIMI', count: 0, color: 'red', legendFontColor: textColor, legendFontSize: 15 },
        { name: 'LIDL', count: 0, color: 'orange', legendFontColor: textColor, legendFontSize: 15 }
      ];
      for(const receipt of fetchedData){
        switch(receipt.shop){
          case "IKI":
            shopsData.find(o => o.name === "IKI").count += 1;
            break;
          case "MAXIMA":
            shopsData.find(o => o.name === "MAXIMA").count += 1;
            break;
          case "NORFA":
            shopsData.find(o => o.name === "NORFA").count += 1;
            break;
          case "RIMI":
            shopsData.find(o => o.name === "RIMI").count += 1;
            break;
          case "LIDL":
            shopsData.find(o => o.name === "LIDL").count += 1;
            break;
                                
        }
      }
      
      return shopsData;
    } 

    const deleteList = (list) => {
      var removed = lists.shoppingLists.filter(x => x.name != list.name);
      lists.setShoppingLists(removed);
      lists.saveLists(removed);
    }

    const selectList = (list) => {
      lists.setCurrentList(list);
      navigation.navigate("NewList");
    }

    const renderListText = () => {
      return (
        <Text style={[screenStyle.scienceChannel, {alignSelf: 'center', marginTop: 20, fontSize: 20, color: textColor}]}>
          {lists.shoppingLists.length == 0 ? "You don't have any shopping lists." : "Your shopping lists"}
        </Text>
      )
    }

    const renderPie = () => {
      return (
        <PieChart
          data={data}
          width={screenWidth-40}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )
    }
    
    const renderShoppingLists = () => {
      if(lists.shoppingLists.length == 0){
          return (
            <TouchableOpacity 
              style={[screenStyle.button]}
              onPress={() => navigation.navigate('NewList')}>
              <Text style={{fontSize: 16, margin: 10, marginLeft: '5%', color: textColor}}>Create New Shopping List</Text>
            </TouchableOpacity>
          );
      }else{
        return (
          <SafeAreaView style={{color:"#ccc"}}>
            <SwipeListView style={{width:'100%'}}
              disableRightSwipe
              data={lists.shoppingLists}
              keyExtractor={(item) => item.name}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={[screenStyle.item, {backgroundColor: itemColor, alignItems: "center"}]}
                  onPress={() => selectList(item)}>
                  <Text style={{fontSize: 16, margin: 10, color: textColor}}>{item.name}</Text>
                </TouchableOpacity>
              )}
              renderHiddenItem={ ({item}) => (
                <View style={[screenStyle.item, {backgroundColor:'indianred'}]}>
                  <TouchableOpacity 
                    style={screenStyle.backRightBtn}
                    activeOpacity={1}
                    onPress={() => deleteList(item)}>
                    <Ionicons name='ios-trash' size={40}/>
                  </TouchableOpacity>
                </View>
              )}
              rightOpenValue={-75}
            />
          </SafeAreaView>
        )
      }
    }
    return (
      <View style={styles().containerm}>
        <View style={styles().body}>
          <View style={screenStyle.body}>
            <View style={screenStyle.headline} backgroundColor = {theme.dark ? '#1c1c1c' : "white"} >
                <View style={screenStyle.overlay}>
                  <Text style={[screenStyle.scienceChannel, {alignSelf: 'center', fontWeight: 'bold', color: textColor}]}>Hi, {user.username}!</Text>
                  <Text style={[screenStyle.scienceChannel, {alignSelf: 'center', color: textColor}]}>Your favorite shops</Text>
                  {renderPie()}
              </View>
            </View>
            {renderListText()}
            <View style={{flex:4}}>
              {renderShoppingLists()}
            </View>
          </View>
        </View>
      </View>
    );
};

export default HomeScreen;

const screenStyle = StyleSheet.create({
  root: {
    borderRadius: 10
  },
  body: {
    flex: 1
  },
  headline: {
    flex:7,
    overflow: "hidden",
    borderRadius: 10,
    elevation: 5,
    margin: 10,
    marginBottom: 5
  },
  image: {
    flex: 1,
    borderRadius: 10
  },
  image_imageStyle: {
  },
  overlay: {
    backgroundColor: "rgba(30,26,26,0.1)",
    flex: 1
  },
  scienceChannel: {
    color: "rgba(255,255,255,1)",
    fontSize: 24,
    marginTop: 20,
    alignSelf: "center"
  },
  text: {
    color: "rgba(31,178,204,1)",
    fontSize: 14,
    alignSelf: "center"
  },
  item: {
    elevation: 5,
    backgroundColor: "#f2fcf6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 10,
    marginLeft: '10%',
    marginRight: '10%'
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button:{
    width: "60%",
    margin: 10,
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: "#1db954",
    borderRadius: 10,
  },
  leftText: {
    alignSelf: 'center'
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    width: '10%'
  }
});
