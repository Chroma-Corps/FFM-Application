import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';

const DonutChart = ({ widthAndHeight, series }) => {
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <PieChart widthAndHeight={widthAndHeight} series={series} cover={0.45} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default DonutChart;
