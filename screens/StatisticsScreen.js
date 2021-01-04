import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LineChart, StackedBarChart} from "react-native-chart-kit";
import moment from 'moment';
import {Svg, Rect, Text as TextSVG} from 'react-native-svg';
import styles from '../config/styles';
import configColors from '../config/colors';
import config, { user } from '../config';
import { ReceiptProductContext } from '../components/context';
import { PieChart } from 'react-native-chart-kit'
const screenWidth = Dimensions.get('window').width

const StatisticsScreen = ({navigation}) => {

    const {colors} = useTheme();
    const theme = useTheme();
    const textColor = theme.dark ? '#fff' : '#363636';
    const [months, setMonths] = React.useState(['']);
    const [totalSaved, setTotalSaved] = React.useState(user.receiptTotalSaved);
    const [tooltipPos,setTooltipPos] = useState(
      { x:0, y:0, visible:false, value:0 });
    const [data, setData] = React.useState([]);
    const context = useContext(ReceiptProductContext);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setMonths(getListOfAllMonths());
        setTotalSaved(user.receiptTotalSaved);  
        });
      return unsubscribe;
        
    }, [navigation]);

  function calculateAverage(numerator, denominator) {
    if (denominator === 0 || isNaN(denominator)) {
          return 0;
    }
    else {
          return Math.round((numerator / denominator)*100)/100;
    }
  }

  useEffect(() => {
    setData(prepareData(context.receipts));
  }, [context.updateReceipts]);

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

  const updatedColorsData = () => {
    let tempData = [];
    data.forEach(e => {
      e.legendFontColor = textColor;
      tempData.push(e);
    });
    return tempData;
  }

  const renderPie = () => {
    if (data === undefined) {
      return (<View/>);
    } else {
      return (<PieChart
        data={updatedColorsData()}
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
      />);
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

    context.receipts.forEach(element => {

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
            if(i == 10 || i==11){
              var result = getAvgPrice(product);
              if(result > product.price) savedMoneyList[i-10]+= result - product.price;
              numOfShoppings[i-10]++;  
            }         
          });

          totalNumOfShoppings++;
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

    function getAvgPrice(item){
          var sum = 0;
          var counter = 0; 
          var amount = 0;
          var product = context.products.find(x => x.name == item.name);
          if(product != undefined){
              if(item.pricePerQuantity > 0) amount = item.price / item.pricePerQuantity;
              else amount = 1;
            for(var shop in product.shopPrices){
              var price = product.shopPrices[shop] * amount;
              sum += price;
              counter++;
            }
          }
          return calculateAverage(sum, counter);
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
            <ScrollView>
            <Text style={{fontSize: 20, color: colors.text, textAlign: 'center', marginTop: 20}}>Your Favorite Shops</Text>
            {renderPie()}
            <Text style={{fontSize: 20, color: colors.text, textAlign: 'center', marginTop: 7}}>Year Spendings Pattern</Text>
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

                <Text style={{fontSize: 20, color: colors.text, textAlign: 'center', marginTop: 20}}>Average Monthly Spendings {'&'} Savings</Text>

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
              </ScrollView>
            </View>
      </View>
    );
};

export default StatisticsScreen;