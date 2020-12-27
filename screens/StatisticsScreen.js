import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
    LineChart,
    BarChart
  } from "react-native-chart-kit";
import moment from 'moment';
import styles from '../config/styles';
import configColors from '../config/colors';
import config, { user } from '../config';

const StatisticsScreen = ({navigation}) => {

    const {colors} = useTheme();
    const [months, setMonths] = React.useState(['']);
    const [receipts, setReceipts] = React.useState([]);
    var numOfShoppings = [0, 0];

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
    var list = [];
    list.length = 12; 
    list.fill(0);
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
          list[i] +=  element.total;
          if(i==10||i==11){
            numOfShoppings[i-10]++;
          }
          break;
        }
      }
    });
  return list;
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

    var graphData = getGraphData();

    const barData = {
        labels: [months[10], months[11]],
        datasets: [
          {
            data: [calculateAverage(graphData[10], numOfShoppings[0]), calculateAverage(graphData[11], numOfShoppings[1])]
          }
        ]
      };

    const chartConfig = {
      backgroundGradientFrom: configColors.green,
      backgroundGradientFromOpacity: 0,
      backgroundGradientToOpacity: 0.5,
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
      <View style={styles().container} backgroundColor={colors.background}>
          <View style={styles().bodym} justifyContent={'space-evenly'}>
          <Text style={{fontSize: 30, color: colors.text, textAlign: 'center'}}>Year Spendings Pattern</Text> 
          <LineChart
            data={{
                labels: months,
                datasets: [
                    {
                        data: graphData 
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