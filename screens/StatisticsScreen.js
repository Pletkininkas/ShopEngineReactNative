import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LineChart, StackedBarChart} from "react-native-chart-kit";
import moment from 'moment';
import {Svg, Rect, Text as TextSVG} from 'react-native-svg';
import styles from '../config/styles';
import configColors from '../config/colors';
import config, { user } from '../config';

const StatisticsScreen = ({navigation}) => {

    const {colors} = useTheme();
    const [months, setMonths] = React.useState(['']);
    const [receipts, setReceipts] = React.useState(user.receipt);
    const [totalSaved, setTotalSaved] = React.useState(user.receiptTotalSaved);
    const [products, setProducts] = useState([]);
    const [tooltipPos,setTooltipPos] = useState(
      { x:0, y:0, visible:false, value:0 });

    useState(() => {fetchProducts().then(data => {setProducts(data);})});

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setMonths(getListOfAllMonths());
        setTotalSaved(user.receiptTotalSaved);
        fetchReceipts().then(data => {setReceipts(data);})   
        });
      return unsubscribe;
        
    }, [navigation]);
    

    async function fetchProducts(){
      var _products = []
      try{
        var response = fetch(config.API_URL+'product', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
        });
        var data = await response;
        _products = await data.json();
      }catch(err){
        console.error(err);
      }
      return _products.data;
    }

    async function fetchReceipts(){
      var receipts = []
      let token = user.token;
      try{
        var response = fetch(config.API_URL+'receipt', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
        });
        var data = await response;
        receipts = await data.json();
      }catch(err){
        console.error(err);
      }
      return receipts.data;
    }

  function calculateAverage(numerator, denominator) {
    if (denominator === 0 || isNaN(denominator)) {
          return 0;
    }
    else {
          return Math.round((numerator / denominator)*100)/100;
    }
  }

  function getGraphData() {
    var avgSpent;
    var avgSaved;
    var numOfShoppings = [0, 0];
    var yearAverage;
    var avgList = [];
    var totalNumOfShoppings = 0;
    var totalSpent = 0;
    var savedList = [];
    var savedMoneyList = [0, 0];
    var graphData = [];
    graphData.length = 12; 
    graphData.fill(0);

    receipts.forEach(element => {

      var date = new Date(element.date);
      var year = date.getFullYear();
      var month = date.getMonth();

      var currentDate = moment().add(1, 'days');
      var startDate = moment().subtract(11, 'months');
      
      var i;
      for (i = 0; startDate < currentDate; i++, startDate.add(1, 'months')) {
        if (year === startDate.year() && month === startDate.month())
        {
          graphData[i] +=  element.total 
          totalSpent += element.total 

          element.receiptProducts.forEach(product => {
            var result = getMaxPrice(product);
            if(result > product.price && i==10||i==11) {
              savedMoneyList[i-10]+=result - product.price;
            }           
          });

          totalNumOfShoppings++;

          if(i==10||i==11){
            numOfShoppings[i-10]++;
          }
          break;
        }
      }
      for (i = 0; i < 12; i++){
        graphData[i] = Math.round(graphData[i]*100)/100;
      }
    });

    savedList.length =12;
    savedList.fill(totalSaved);

    avgSpent = [calculateAverage(graphData[10], numOfShoppings[0]), calculateAverage(graphData[11], numOfShoppings[1])];
    avgSaved = [calculateAverage(savedMoneyList[0], numOfShoppings[0]), calculateAverage(savedMoneyList[1], numOfShoppings[1])];
    yearAverage = calculateAverage(totalSpent, totalNumOfShoppings)
    avgList.length = 12;
    avgList.fill(yearAverage);
    
    return {graphData: graphData, avgSpent: avgSpent, avgSaved: avgSaved, yearAverage: yearAverage, avgList: avgList, savedList: savedList}
}

    function getMaxPrice(item){
        var maxPrice = Number.NEGATIVE_INFINITY;
        var product = products.find(x => x.name == item.name);
        if(product != undefined){
          var amount = item.price / item.pricePerQuantity;
          for(var shop in product.shopPrices){
            var price = product.shopPrices[shop] * amount;
            if(price > maxPrice) maxPrice = price;
          }
        }
        if(maxPrice == Number.NEGATIVE_INFINITY){
          maxPrice = 0;
        }
        return maxPrice;
      }
    
  function getListOfAllMonths() {
        var currentDate = moment();
        var startDate = moment().subtract(11, 'months');
        var list = [];

        while (startDate < currentDate) {
          list.push(startDate.format("MMM"));
          startDate.add(1, 'months');
        }
        list.push(currentDate.format("MMM"));
        return list;
    }

    const lineChartConfig = {
      backgroundGradientFrom: configColors.green,
      backgroundGradientFromOpacity: 0,
      backgroundGradientToOpacity: 0.5,
      backgroundGradientTo: configColors.green,
      color: () => colors.text,
      barPercentage: 2,
      decimalPlaces: 2, 
      labelColor: () => colors.text,
      fillShadowGradientOpacity:0.5,
      style: {
          borderRadius: 16
      },
      useShadowColorFromDataset: true        
    };

    const barChartConfig = {
      backgroundGradientFrom: configColors.green,
      backgroundGradientFromOpacity: 0,
      backgroundGradientToOpacity: 0.5,
      backgroundGradientTo: configColors.green,
      color: () => colors.text,
      barPercentage: 2,
      decimalPlaces: 2, 
      labelColor: () => colors.text,
      fillShadowGradient:configColors.green,
      fillShadowGradientOpacity:1,
      style: {
          borderRadius: 16
      },        
    };
  
    return (
      <View style={styles().containerm}>
          <View>
              <Text style={styles().title}>Statistics</Text>
          </View>
          <View style={styles().bodym} justifyContent={'space-evenly'}>
          <Text style={{fontSize: 20, color: colors.text, textAlign: 'center'}}>Year Spendings Pattern</Text>
          <View> 
          <ScrollView horizontal pagingEnabled={true}>
          <LineChart
            data={{
                labels: months,
                datasets: [
                    {
                        data: getGraphData().avgList,
                        withDots: false,
                        strokeWidth: 4,
                        color: () => colors.text,            
                    },
                    {
                      data: getGraphData().graphData,  
                      color: () => configColors.green                      
                  }
                ],
                legend: [`Year average (${getGraphData().yearAverage.toFixed(2)}€)`, "Total spendings"]
                }}
                width={Dimensions.get("window").width - 20}
                height={220}
                yAxisSuffix="€"
                yAxisInterval={1}
                fromZero = "true"
                verticalLabelRotation={30}
                chartConfig={lineChartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}

                onDataPointClick={  
                  (data) => {
                  // check if we have clicked on the same point again
                  let isSamePoint = (tooltipPos.x === data.x 
                                      && tooltipPos.y ===  data.y)
                
                  // if clicked on the same point again toggle visibility
                  // else,render tooltip to new position and update its value     
                  isSamePoint ? setTooltipPos((previousState)=> {
                                     return {
                                          ...previousState, 
                                          value: data.value,
                                          visible: !previousState.visible}
                                     })
                               : 
                             setTooltipPos({x: data.x, 
                                value: data.value, y: data.y,
                                visible: true
                             });   
                            } // end function
                          }
                          decorator={() => {   
                            return tooltipPos.visible ? 
                            <View>    
                              <Svg>          
                                <Rect x={tooltipPos.x -15} y={tooltipPos.y + 10} width="40"  
                                  height="30" fill={configColors.green} fillOpacity="0.7" />
                                      <TextSVG          
                                        x={tooltipPos.x + 5}         
                                        y={tooltipPos.y + 30}
                                        fill={colors.text}
                                        fontSize="12"                  
                                        textAnchor="middle">          
                                        {tooltipPos.value + "€"}     
                                      </TextSVG>    
                                </Svg>
                              </View> : null
                              }}
                />
          <LineChart
            data={{
                labels: months,
                datasets: [
                    {
                        data: getGraphData().savedList,
                        withDots: false,
                        strokeWidth: 4,
                        color: () => 'skyblue',            
                    },
                    {
                      data: getGraphData().graphData,  
                      color: () => configColors.green                      
                  }
                ],
                legend: [`You've saved (${totalSaved.toFixed(2)}€)`, "Total spendings"]
                }}
                width={Dimensions.get("window").width - 20}
                height={220}
                yAxisSuffix="€"
                yAxisInterval={1}
                fromZero = "true"
                verticalLabelRotation={30}
                chartConfig={lineChartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}

                onDataPointClick={  
                  (data) => {
                  let isSamePoint = (tooltipPos.x === data.x 
                                      && tooltipPos.y ===  data.y)   
                  isSamePoint ? setTooltipPos((previousState)=> {
                                     return {
                                          ...previousState, 
                                          value: data.value,
                                          visible: !previousState.visible}
                                     })
                               : 
                             setTooltipPos({x: data.x, 
                                value: data.value, y: data.y,
                                visible: true
                             });   
                            }
                          }
                          decorator={() => {   
                            return tooltipPos.visible ? 
                            <View>    
                              <Svg>          
                                <Rect x={tooltipPos.x -15} y={tooltipPos.y + 10} width="40"  
                                  height="30" fill={configColors.green} fillOpacity="0.7" />
                                      <TextSVG          
                                        x={tooltipPos.x + 5}         
                                        y={tooltipPos.y + 30}
                                        fill={colors.text}
                                        fontSize="12"                   
                                        textAnchor="middle">          
                                        {tooltipPos.value + "€"}     
                                      </TextSVG>    
                                </Svg>
                              </View> : null
                              }}
                />
                </ScrollView>
                </View>

                <Text style={{fontSize: 20, color: colors.text, textAlign: 'center'}}>Average Monthly Spendings {'&'} Savings</Text>

                <StackedBarChart
                    data={{
                      labels: [months[10], months[11]],
                      legend: ['You\'ve spent', 'You\'ve saved'],
                      data: [
                        [getGraphData().avgSpent[0], getGraphData().avgSaved[0]], 
                        [getGraphData().avgSpent[1], getGraphData().avgSaved[1]]
                      ],
                      barColors: [configColors.green, colors.background],
                      
                    }}
                    
                    width={Dimensions.get("window").width - 20}
                    height={220}
                    yAxisSuffix="€"
                    fromZero = "true"
                    chartConfig={barChartConfig}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
                    
                />
            </View>             
            
      </View>
    );
};

export default StatisticsScreen;