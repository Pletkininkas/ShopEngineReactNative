import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LineChart, BarChart, StackedBarChart} from "react-native-chart-kit";
import moment from 'moment';
import {Svg, Rect, Text as TextSVG} from 'react-native-svg';
import styles from '../config/styles';
import configColors from '../config/colors';
import config, { user } from '../config';

const StatisticsScreen = ({navigation}) => {

    const {colors} = useTheme();
    const [months, setMonths] = React.useState(['']);
    const [receipts, setReceipts] = React.useState([]);
    const [tooltipPos,setTooltipPos] = useState(
      { x:0, y:0, visible:false, value:0 });
    var numOfShoppings = [0, 0];
    var totalNumOfShoppings = 0;
    var total = 0;
    var avgList = [];
    avgList.length = 12;
    var graphData = [];
    graphData.length = 12; 
    var savedMoneyData1 = [];
    savedMoneyData1.length = 12;
    //var savedMoneyData2 = 0;  

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setMonths(getListOfAllMonths());
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
              setReceipts(data.data);
            })
            .catch(err => {
              console.log(err);
            });    
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

  function getGraphData() {
    graphData.fill(0);
    savedMoneyData1.fill(0);
    graphData[10] = 14.78;//hardcoded value
    total = 14.78;//hardcoded value
    numOfShoppings[0]=2;//hardcoded value
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
          graphData[i] +=  element.total;
          total += element.total;

          // element.receiptProducts.forEach(product => {
          //   if(i==10||i==11){
          //     //savedMoneyData1[i-10]+=product.discount;
          //     savedMoneyData1[i-10]+=(product.discount*(-1));
          //     console.log(savedMoneyData1[1]);
          //   }
          //   savedMoneyData2+=product.discount;
          // });

          totalNumOfShoppings++;

          if(i==10||i==11){
            numOfShoppings[i-10]++;

            element.receiptProducts.forEach(product => {
                //savedMoneyData1[i-10]+=product.discount;
                savedMoneyData1[i-10]+=(product.discount*(-1));
                console.log(savedMoneyData1[1]);
            });
          }
          break;
        }
      }
    });
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

    getGraphData();

    // const barData = {
    //     labels: [months[10], months[11]],
    //     datasets: [
    //       {
    //         data: [calculateAverage(graphData[10], numOfShoppings[0]), calculateAverage(graphData[11], numOfShoppings[1])],
    //       }
    //     ]
    //   };

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
      //data: barData.datasets,
      decimalPlaces: 2, 
      labelColor: () => colors.text,
      fillShadowGradient:configColors.green,
      fillShadowGradientOpacity:1,
      style: {
          borderRadius: 16
      },        
    };

    var average = calculateAverage(total, totalNumOfShoppings)
    avgList.fill(average);

    return (
      <View style={styles().container} backgroundColor={colors.background}>
          <View style={styles().bodym} justifyContent={'space-evenly'}>
          <Text style={{fontSize: 30, color: colors.text, textAlign: 'center'}}>Year Spendings Pattern</Text> 
          <LineChart
            data={{
                labels: months,
                datasets: [
                    {
                        data: avgList,
                        withDots: false,
                        strokeWidth: 4,
                        color: () => colors.text,            
                    },
                    {
                      data: graphData,  
                      color: () => configColors.green                      
                  }
                ],
                legend: [`Year average (${average}€)`, "Total spendings"]
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
                                        //fontWeight="bold"          
                                        textAnchor="middle">          
                                        {tooltipPos.value + "€"}     
                                      </TextSVG>    
                                </Svg>
                              </View> : null
                              }}
                />

                <Text style={{fontSize: 30, color: colors.text, textAlign: 'center'}}>Average Monthly Spendings</Text>

                <StackedBarChart
                    data={{
                      labels: [months[10], months[11]],
                      legend: ['You\'ve spent', 'You\'ve saved'],
                      data: [
                        //calculateAverage(savedMoneyData1[0], numOfShoppings[0])
                        [calculateAverage(graphData[10], numOfShoppings[0]), calculateAverage(savedMoneyData1[0], numOfShoppings[0])], 
                        [calculateAverage(graphData[11], numOfShoppings[1]), calculateAverage(savedMoneyData1[1], numOfShoppings[1])]
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
                  {/* <BarChart
                    data={barData}
                    width={Dimensions.get("window").width - 20}
                    height={220}
                    yAxisSuffix="€"
                    fromZero = "true"
                    chartConfig={barChartConfig}
                    showValuesOnTopOfBars="true"
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
                /> */}
            </View>             
            
      </View>
    );
};

export default StatisticsScreen;