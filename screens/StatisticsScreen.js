import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
    LineChart,
    BarChart
  } from "react-native-chart-kit";
import moment from 'moment';
import styles from '../config/styles';
import configColors from '../config/colors';

const StatisticsScreen = ({navigation}) => {

    const {colors} = useTheme();
    const [months, setMonths] = useState(['']);
    
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
      });
      return unsubscribe;
    }, [navigation]);

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
        backgroundGradientTo: colors.background,
        color: (opacity = 1) => colors.text,
        barPercentage: 2,
        useShadowColorFromDataset: false, 
        data: barData.datasets,
        decimalPlaces: 2, 
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
                width={Dimensions.get("window").width - 20}
                height={220}
                yAxisSuffix="€"
                yAxisInterval={1}
                fromZero = "true"
                verticalLabelRotation={30}
                chartConfig={chartConfig}
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
                />
            </View>             
            
      </View>
    );
};

export default StatisticsScreen;
