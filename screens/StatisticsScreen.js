import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Dimensions } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import * as scale from 'd3-scale'
import {
    LineChart,
    BarChart
  } from "react-native-chart-kit";
import moment from 'moment';
import styles from '../config/styles';
import configColors from '../config/colors';
import { render } from 'react-dom';
import config, { user } from '../config';

const StatisticsScreen = () => {

    const {colors} = useTheme();

    function getListOfAllMonths() {
        var currentDate = moment();
        var startDate = moment().subtract(11, 'months');
        var months = [];

        while (startDate <= currentDate) {
            months.push(startDate.format("MMM"));
            startDate.add(1, 'months');
        }
        return months;
    }


    var months = getListOfAllMonths();

    const barData = {
        labels: [months[10], months[11]],
        datasets: [
          {
            data: [20, 45]
          }
        ]
      };
      const chartConfig = {
        backgroundGradientFrom: configColors.green,
        //backgroundGradientFromOpacity: 0,
        backgroundGradientTo: colors.background,
        //backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => colors.text,
        //strokeWidth: 10, // optional, default 3
        barPercentage: 2,
        useShadowColorFromDataset: false, // optional
        data: barData.datasets,
        decimalPlaces: 2, // optional, defaults to 2dp
        labelColor: (opacity = 1) => colors.text,
        fillShadowGradient:'skyblue',
        fillShadowGradientOpacity:1,
        style: {
            borderRadius: 16
        }
        
        
      };

    return (
      <View style={styles().containerm}>
          <View>
                <Text style={styles().title}>Statistics</Text>
          </View>
          <View style={styles().bodym}>
          <Text style={{fontSize: 20, color: colors.text, textAlign: 'center'}}>Year Spendings Pattern</Text> 
          <LineChart
            data={{
                labels: months,
                datasets: [
                    {
                        data: [20, 45, 28, 80, 99, 43, 20, 45, 28, 80, 99, 43]
                    }
                ]
                }}
                width={Dimensions.get("window").width - 20} // from react-native
                height={220}
                yAxisSuffix="€"
                yAxisInterval={1} // optional, defaults to 1
                fromZero = "true"
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                // bezier
                // style={{
                //     marginVertical: 8,
                //     borderRadius: 16
                // }}
                />

                <Text style={{fontSize: 20, color: colors.text, textAlign: 'center'}}>Average Monthly Spendings</Text>

                <BarChart
                    //style={graphStyle}
                    data={barData}
                    width={Dimensions.get("window").width - 20}
                    height={220}
                    yAxisSuffix="€"
                    fromZero = "true"
                    chartConfig={chartConfig}
                    showValuesOnTopOfBars="true"

                    //verticalLabelRotation={30}
                />
            </View>             
            
      </View>
    );
};

export default StatisticsScreen;
