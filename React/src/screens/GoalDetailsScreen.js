import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import InAppBackground from '../components/InAppBackground';
import InAppHeader from '../components/InAppHeader';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import ProgressBar from '../components/ProgressBar';
import DonutChart from '../components/DonutChart';
import EditButton from '../components/EditButton';
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

    const totalTransactionAmount = goalTransactions.reduce((sum, txn) => {
        let raw = txn.transactionAmount;
      
        if (typeof raw === "string") {
          // Remove $ signs, commas, and trim whitespace
          raw = raw.replace(/[^0-9.-]+/g, '').trim();
        }
      
        const amount = parseFloat(raw);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
    

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
            <EditButton onPress={() => navigation.navigate('EditGoal', { goal: goalDetails })} />

            <View style={styles.container}>
                <Text style={styles.goalTitle}>{goalDetails?.goalTitle}</Text>
                <View style={styles.goalAmountContainer}>
                    <Text style={styles.currentAmount}>
                        {(goalDetails?.bankCurrency || "$") + totalTransactionAmount.toFixed(2)}
                    </Text>

                    <Text style={styles.targetAmount}>
                        / {goalDetails?.bankCurrency} {goalDetails?.targetAmount}
                    </Text>
                </View>

                <View style={styles.goalPeriodContainer}>
                    <Text style={styles.goalPeriodTitle}>Goal Period</Text>
                    <Text style={styles.goalPeriod}>{displayGoalPeriod()}</Text>
                </View>

                <View style={styles.graphContainer}>
                
                    {goalDetails && goalDetails.currentAmount !== undefined && goalDetails.targetAmount !== undefined ? (
                        <DonutChart 
                            currentAmount={totalTransactionAmount} 
                            targetAmount={goalDetails.targetAmount} 
                            radius={150}
                            strokeWidth={40}
                            color={theme.colors.primary}
                            delay={1000}
                        />
                    ) : (
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    )}
                </View>

                {/* Transactions Section */}
                <View style={styles.transactionsContainer}>
                    <Text style={styles.transactionsHeader}>Goal Transactions </Text>
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
    goalAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        width: '100%',
        textAlign: 'center',
    },
    currentAmount: {
        fontSize: 35, 
        fontFamily: theme.fonts.bold.fontFamily,
        color: "#FFFFFF",
    },
    targetAmount: {
        fontSize: 25, 
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.primary,
    },

    goalPeriodContainer: {
        marginVertical: 10,
    },
    goalPeriodTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
    },
    goalPeriod: {
        fontSize: 16,
        color: theme.colors.description,
    },

    graphContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', 
        marginVertical: 10,
    },

    transactionsContainer: {
        padding: 20,
        width: '100%',
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