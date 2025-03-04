import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../core/theme'

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ProgressBar = ({ startDate, endDate, budgetColorTheme }) => {

    const today = new Date();

    const start = new Date(startDate);
    const end = new Date(endDate);

    const totalDuration = end - start;
    const elapsedTime = today - start;

    let progress = Math.min((elapsedTime / totalDuration) * 100, 100);

    progress = today > start
        ? progress
        : '0';

    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: budgetColorTheme }]} >
                    <Text style={styles.progressBarPercent}> {Math.round(progress)}% </Text>
                </View>
            </View>

            <View style={styles.datesContainer}>
                <Text style={styles.dates}>{formatDate(start)}</Text>

                <Text style={styles.dates}>{formatDate(end)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
    },

    progressBarContainer: {
        height: 20,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
    },

    progressBar: {
        height: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },

    progressBarPercent: {
        color: theme.colors.description,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 12,
    },

    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 5,
    },

    dates: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 12,
    },
})

export default ProgressBar;