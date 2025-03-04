import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

// Helper function to get a color based on the category index
const getCategoryColor = (index) => {
    const colorPalette = [
        '#FF6347', // Tomato Red
        '#87CEEB', // Sky Blue
        '#FFD700', // Gold
        '#32CD32', // Lime Green
        '#FF4500', // Orange Red
        '#DA70D6', // Orchid
        '#20B2AA', // Light Sea Green
        '#B0C4DE', // Light Steel Blue
    ];


    return colorPalette[index % colorPalette.length];
};


export default function CircleGraph({ transactions }) {

    const categories = transactions.reduce((acc, transaction) => {
        const { transactionCategory, transactionAmount } = transaction;
        acc[transactionCategory] = (acc[transactionCategory] || 0) + transactionAmount;
        return acc;
    }, {});


    const totalSpent = Object.values(categories).reduce((acc, amount) => acc + amount, 0);


    const getPercentage = (categoryAmount) => totalSpent === 0 ? 0 : (categoryAmount / totalSpent) * 100;


    const data = Object.keys(categories).map((category, index) => ({
        category,
        amount: categories[category],
        percentage: getPercentage(categories[category]),
        color: getCategoryColor(index),
    }));

    const radius = 80;


    const getStrokeDasharray = (percentage) => {
        const circumference = 2 * Math.PI * radius;
        return (percentage / 100) * circumference;
    };

    let startAngle = -90;

    return (
        <View style={styles.graphContainer}>
            <Svg height="200" width="200">
                <G rotation="90" origin="100,100">
                    {data.map((item, index) => {
                        const strokeDasharray = getStrokeDasharray(item.percentage);
                        const strokeDashoffset = startAngle;
                        startAngle += item.percentage * 3.6;

                        const path = `M 100 100 L ${100 + radius * Math.cos(Math.PI * startAngle / 180)} ${100 + radius * Math.sin(Math.PI * startAngle / 180)} A ${radius} ${radius} 0 ${item.percentage > 50 ? 1 : 0} 1 ${100 + radius * Math.cos(Math.PI * (startAngle + item.percentage * 3.6) / 180)} ${100 + radius * Math.sin(Math.PI * (startAngle + item.percentage * 3.6) / 180)} Z`;

                        return (
                            <Path
                                key={index}
                                d={path}
                                fill={item.color}
                            />
                        );
                    })}
                </G>
            </Svg>
            {data.map((item, index) => (
                <Text key={index} style={[styles.categoryText, { top: 10 + 30 * (index + 1) }]}>
                    {item.category}: {item.percentage.toFixed(2)}%
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    graphContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        position: 'relative',
    },
    categoryText: {
        position: 'absolute',
        fontSize: 12,
        color: 'black',
    },
});
