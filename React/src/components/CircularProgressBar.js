import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { theme } from '../core/theme';

export default function CircularProgressBar({ count, color }) {


    return (
        <View style={styles.container}>
            {/* <CircularProgress
                radius={90}
                value={count}
                textColor='#222'
                fontSize={20}
                valueSuffix={'%'}
                inActiveStrokeColor={'#2ecc71'}
                inActiveStrokeOpacity={0.2}
                inActiveStrokeWidth={6}
                duration={3000}
                onAnimationComplete={() => setValue(50)}
            /> */}

            <CircularProgress
                radius={100}
                value={count}
                textColor='#222'
                fontSize={20}
                // valueSuffix={''}
                activeStrokeColor={color || 'theme.colors.primary'}
                inActiveStrokeOpacity={0.2}
                duration={4000}
            />

            {/* <StatusBar style="auto" /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});