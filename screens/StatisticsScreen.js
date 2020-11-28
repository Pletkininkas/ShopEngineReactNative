import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import { LineChart, BarChart, YAxis, XAxis, Grid} from 'react-native-svg-charts'
import * as scale from 'd3-scale'


import configColors from '../config/colors';
import styles from '../config/styles';
import colors from '../config/colors';
import { render } from 'react-dom';

const StatisticsScreen = () => {

    //const theme = useTheme();
    const {colors} = useTheme();
    const lineData = [12.4, 25.67, 16.96, 12.4, 25.67, 16.96, 12.4, 25.67, 16.96, 12.4, 25.67, 16.96];
    const contentInset = { top: 20, bottom: 20 };

    const axesSvg = { fontSize: 10, fill: colors.text };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30

    const fill = 'rgb(134, 65, 244)';
    const barData = [
        {
            index: 0,
            value: 23.78,
            label: 'October'
        }, 
        {
            index: 1,
            value:16.47,
            label: 'November'
        }
    ];

    return (
      <View style={styles().containerm}>
          <View>
                <Text style={styles().title}>Statistics</Text>
          </View>
          <View style={styles().bodym}>
          <Text style={{fontSize: 20, color: colors.text, textAlign: 'center'}}>Year Spendings Pattern</Text> 
          <View style={{ height: 200, padding: 20, flexDirection: 'row'  }}>                           
                <YAxis
                    data={lineData}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                    numberOfTicks = {6}
                    min={0}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart                        
                        style={{ flex: 1 }}
                        data={lineData}
                        contentInset={verticalContentInset}
                        svg={{ stroke: colors.text, strokeWidth: 2 }}
                        gridMin={0}                                                
                    >
                        <Grid svg={{stroke: colors.text}}/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={lineData}
                        formatLabel={(value, index) => index}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}                        
                    />
                </View>
                </View>

                <Text style={{fontSize: 20, color: colors.text, textAlign: 'center'}}>Average Monthly Spendings</Text>

                <View style={{ height: 200, padding: 20, flexDirection: 'row'  }}>                           
                <YAxis
                    data={barData}
                    yAccessor={({ item }) => item.value}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                    numberOfTicks = {6}
                    min={0}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <BarChart                       
                        data={barData}
                        yAccessor={({ item }) => item.value}
                        contentInset={verticalContentInset}
                        svg={{ fill: colors.text}}
                        gridMin={0}
                        style={{ flex: 1}}
                        spacingOuter={0.5}
                        spacingInner={0.5}                                                                                                
                    >
                        <Grid svg={{stroke: colors.text}}/>
                    </BarChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={ barData }
                        xAccessor={({ index }) => index}                        
                        scale={scale.scaleBand}
                        spacingOuter={0.5}
                        spacingInner={0.3} 
                        formatLabel={(_, index) => barData[ index ].label}
                        svg={axesSvg}
                    />
                </View>
                </View>
            </View>             
            
      </View>
    );
};

export default StatisticsScreen;
