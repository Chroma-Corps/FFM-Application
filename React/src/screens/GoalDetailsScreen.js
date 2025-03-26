import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import InAppBackground from '../components/InAppBackground';
import InAppHeader from '../components/InAppHeader';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import ProgressBar from '../components/ProgressBar';
import DonutChart from '../components/DonutChart';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalDetailsScreen({ route, navigation }) {
    const { goalID } = route.params;
    const [goalDetails, setGoalDetails] = useState(null);
    const [goalTransactions, setGoalTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoalDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                if (!token) {
                    console.error('No Token Found');
                    return;
                }

                const response = await fetch(`https://ffm-application-main.onrender.com/goal/${goalID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setGoalDetails(data.goal);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error Fetching Goal Details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchGoalTransactions = async () => {
            try {
                const response = await fetch(`https://ffm-application-main.onrender.com/goal/${goalID}/transactions`);
                const data = await response.json();
                if (response.ok) {
                    setGoalTransactions(data.transactions);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error Fetching Goal Transactions:', error);
            }
        };

        fetchGoalDetails();
        fetchGoalTransactions();
    }, [goalID]);

    const formatDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const [year, month, day] = date.split("-");
        return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
    };

    const displayGoalPeriod = () => {
        if (!goalDetails) return "--";
        return `${formatDate(goalDetails.startDate)} - ${formatDate(goalDetails.endDate)}`;
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <InAppBackground>
            <BackButton goBack={navigation.goBack} />

            <View style={styles.container}>
                <Text style={styles.goalTitle}>{goalDetails?.goalTitle}</Text>
                <Text style={styles.goalAmount}>Current: ${goalDetails?.currentAmount || 0}</Text>
                <Text style={styles.goalAmount}>Target: ${goalDetails?.targetAmount}</Text>
                <Text style={styles.goalPeriod}>{displayGoalPeriod()}</Text>

                <View style={styles.graphContainer}>
                            {goalDetails && goalDetails.currentAmount !== undefined && goalDetails.targetAmount !== undefined ? (
                    <DonutChart 
                            currentAmount={goalDetails.currentAmount} 
                            targetAmount={goalDetails.targetAmount} 
                            radius={150}
                            strokeWidth={40}
                            color="#48A6A7"
                            delay={1000}
                    />
                    ) : (
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    )}
            </View>


                
                <Button mode="contained" onPress={() => navigation.navigate('EditGoal', { goal: goalDetails })}>
                    Edit Goal
                </Button>
            </View>

            <View style={styles.transactionsContainer}>
                <Text style={styles.transactionsHeader}>Goal Transactions</Text>
                {goalTransactions.length === 0 ? (
                    <Text style={styles.noTransactionsText}>No transactions recorded for this goal.</Text>
                ) : (
                    <FlatList
                        data={goalTransactions}
                        keyExtractor={(item) => `${item.transactionID}`}
                        renderItem={({ item }) => (
                            <View style={styles.transactionItem}>
                                <Text style={styles.transactionTitle}>{item.transactionTitle}</Text>
                                <Text style={styles.transactionAmount}>${item.transactionAmount}</Text>
                                <Text style={styles.transactionDate}>{formatDate(item.transactionDate)}</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </InAppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    goalTitle: {
        fontSize: 24,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        marginBottom: 10,
        padding: 15,
        marginTop: 30,
    },
    goalAmount: {
        fontSize: 20,
        color: theme.colors.surface,
        marginBottom: 10,
    },
    goalPeriod: {
        fontSize: 16,
        color: theme.colors.description,
        marginBottom: 20,
    },
    transactionsContainer: {
        padding: 20,
    },
    transactionsHeader: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        marginBottom: 10,
        color: theme.colors.textSecondary,
    },
    transactionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.secondary,
    },
    transactionTitle: {
        fontSize: 16,
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.surface,
    },
    transactionAmount: {
        fontSize: 16,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.primary,
    },
    transactionDate: {
        fontSize: 14,
        color: theme.colors.description,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});