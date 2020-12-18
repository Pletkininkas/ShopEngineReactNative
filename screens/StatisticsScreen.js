import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
    LineChart,
    BarChart
  } from "react-native-chart-kit";
import moment from 'moment';
import configStyles from '../config/styles';
import configColors from '../config/colors';
import config, { user } from '../config';
import { color } from 'react-native-reanimated';

const StatisticsScreen = ({navigation}) => {

    const {colors} = useTheme();
    const [months, setMonths] = useState(['']);
    //const[graphData, setGraphData] = useState([0]);
    //const [receipts, setReceipts] = useState([]);
    
      // useState(() => {
      //   let token = user.token;
      //   fetch(config.API_URL+'receipt', {
      //     method: 'GET',
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json',
      //       'Authorization': 'Bearer ' + token
      //     }
      //   }).then(data => {
      //       return data.json();
      //     })
      //     .then(data => {
      //       setReceipts(data.data);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
  
      // }, []);

    //   function getGraphData() {
    //     var data = [];
    //     data.length = 12; 
    //     data .fill(0);
    //     receipts.forEach(element => {
    //     var date = new Date(element.date);
    //     var year = date.getFullYear();
    //     var month = date.getMonth();

    //     var currentDate = moment().add(1, 'days');
    //     var startDate = moment().subtract(11, 'months');
    //     var i;
    //     for (i = 0; startDate < currentDate; i++, startDate.add(1, 'months')) {
    //       if (year === startDate.year() && month === (startDate.month()+1))
    //       {
    //         data[i] +=  element.total;
    //         break;
    //       }
    //     }
    //   })
    //  return data;
    // }
    
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
  
    React.useEffect(() => {
      // Subscribe for the focus Listener
      const unsubscribe = navigation.addListener('focus', () => {
        setMonths(getListOfAllMonths());
        //setGraphData(getGraphData());
      });
      return unsubscribe;
    }, [navigation]);

    const barData = {
        labels: [months[10], months[11]],
        datasets: [
          {
            data: [20, 45]
            //data: graphData 
          }
        ]
      };

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      //backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
        // backgroundGradientFrom: colors.background,
      backgroundGradientTo: configColors.green,
        color: (opacity = 1) => colors.text,
        barPercentage: 2,
        useShadowColorFromDataset: false, 
        data: barData.datasets,
        decimalPlaces: 2, 
        labelColor: (opacity = 1) => colors.text,
        fillShadowGradient:configColors.green,
        fillShadowGradientOpacity:1,
        style: {
            borderRadius: 16
        }        
      };

    return (
      <View style={configStyles().container} backgroundColor={colors.background}>
          <View style={configStyles().bodym} justifyContent={'space-evenly'}>
          <Text style={{fontSize: 30, color: colors.text, textAlign: 'center'}}>Year Spendings Pattern</Text> 
          <LineChart
            data={{
                labels: months,
                datasets: [
                    {
                        data: [20, 45, 28, 80, 99, 43, 20, 45, 28, 80, 99, 43]
                        //data: graphData 
                    }
                ]
                }}
                width={Dimensions.get("window").width - 20}
                height={220}
                yAxisSuffix="€"
                yAxisInterval={1}
                fromZero = "true"
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                />

                <Text style={{fontSize: 30, color: colors.text, textAlign: 'center'}}>Average Monthly Spendings</Text>

                <BarChart
                    //style={graphStyle}
                    data={barData}
                    width={Dimensions.get("window").width - 20}
                    height={220}
                    yAxisSuffix="€"
                    fromZero = "true"
                    chartConfig={chartConfig}
                    showValuesOnTopOfBars="true"
                />
            </View>             
            
      </View>
    );
};

export default StatisticsScreen;
