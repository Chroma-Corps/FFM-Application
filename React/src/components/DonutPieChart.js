import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Pie from 'react-native-pie'; // New react-native-pie library 

export default function DonutPieChart({ value, total, radius = 80, strokeWidth = 20, textColor = 'black' }) {
    const percentage = (value / total) * 100;

    const data = [
        { value: percentage, color: '#4CAF50' },
        { value: 100 - percentage, color: '#E0E0E0' },
    ];

    return (
        <View style={styles.container}>
            <Pie
                radius={radius}
                series={data.map(item => item.value)}
                colors={data.map(item => item.color)}
                innerRadius={radius - strokeWidth}
                backgroundColor="#fff"
            />
            <Text style={[styles.text, { color: textColor }]}>{`${percentage.toFixed(2)}%`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        position: 'relative',
    },
    text: {
        position: 'absolute',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
