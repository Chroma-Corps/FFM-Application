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

    const formatDate = (dateString) => {
        if (!dateString) return "--";
    
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "--"; // Handle invalid dates
    
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const displayGoalPeriod = () => {
        if (!goalDetails || !goalDetails.startDate || !goalDetails.endDate) return "--";
        return `Goal Period:\n${formatDate(goalDetails.startDate)} - ${formatDate(goalDetails.endDate)}`;
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
                <View style={styles.goalAmountContainer}>
                    <Text style={styles.currentAmount}>
                        {goalDetails?.bankCurrency} {goalDetails?.currentAmount || 0} 
                    </Text>
                    <Text style={styles.targetAmount}>
                        / {goalDetails?.bankCurrency} {goalDetails?.targetAmount}
                    </Text>
                </View>
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
    goalAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        width: '100%',
        textAlign: 'center',
        
    },
    
    graphContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', 
        marginVertical: 10,
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
    currentAmount: {
        fontSize: 35, 
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        
    },
    targetAmount: {
        fontSize: 25, 
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.primary,
    },
    goalPeriod: {
        fontSize: 18,
        color: theme.colors.description,
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 15,
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