import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../core/theme'

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ProgressBar = ({ startDate, endDate, colorTheme, amount, remainingAmount }) => {

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const cleanBudgetAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    const cleanRemainingBudgetAmount = parseFloat(remainingAmount.replace(/[^0-9.-]+/g, ""));

    let progress = 0;

    if (cleanRemainingBudgetAmount < cleanBudgetAmount) {
        progress = ((cleanBudgetAmount - cleanRemainingBudgetAmount) / cleanBudgetAmount) * 100;
      } else {
        progress = 0;
      }
    progress = Math.max(0, Math.min(progress, 100));

    return (
        <View style={styles.container}>
             <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: colorTheme }]} />
                <Text style={styles.progressBarPercent}>{progress}%</Text>
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
        backgroundColor: theme.colors.primaryDimmed,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },

    progressBar: {
        height: '100%',
        borderRadius: 10,
    },

    progressBarPercent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -15,
        marginTop: -10,
        color: theme.colors.textSecondary,
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