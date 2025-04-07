import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import ProgressBar from '../components/ProgressBar';

export default function BudgetDetailsScreen({ navigation, route }) {
    const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState([]);
    const [budgetTransactions, setBudgetTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            // Define the async function to fetch all data
            const fetchData = async () => {
                // Set loading to true each time the screen focuses
                setLoading(true);
                try {
                    // Use Promise.all to fetch details and transactions concurrently
                    const [detailsResponse, transactionsResponse] = await Promise.all([
                        fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}`),
                        fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}/transactions`)
                    ]);

                    // Process details
                    const detailsData = await detailsResponse.json();
                    if (detailsResponse.ok) {
                        setBudgetDetails(detailsData.budget);
                    } else {
                        console.error("Failed to fetch budget details:", detailsData.message);
                        setBudgetDetails(null); // Clear or set error state if needed
                    }

                    // Process transactions
                    const transactionsData = await transactionsResponse.json();
                    if (transactionsResponse.ok) {
                        setBudgetTransactions(transactionsData.transactions);
                    } else {
                        console.error("Failed to fetch budget transactions:", transactionsData.message);
                        setBudgetTransactions([]); // Clear or set error state if needed
                    }

                    console.log('Fetch Budget Status:', detailsData.status);
                    console.log('Fetch Budget Transactions Status:', transactionsData.status);

                } catch (error) {
                    console.error('Error fetching budget data:', error);
                    // Optionally set an error state here to show feedback to the user
                    setBudgetDetails(null);
                    setBudgetTransactions([]);
                } finally {
                    // Always set loading to false after fetching (or error)
                    setLoading(false);
                }
            };

            // Call the function to fetch data when the screen is focused
            fetchData();

            // Optional: Return a cleanup function if needed
            // return () => {
            //   console.log('BudgetDetailsScreen unfocused');
            // };

        }, [budgetID]) // Dependency array, refetch if budgetID changes
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!budgetDetails) {
        return (
            <View style={styles.centered}>
                <Text>No Budget Details Available</Text>
            </View>
        );
    }

    const renderTransaction = ({ item }) => {
        return (
            <View style={styles.transactionCard}>
                <Text style={styles.transactionTitle}>{item.transactionTitle}</Text>
                <Text style={styles.transactionAmount}>{item.transactionAmount}</Text>
                <Text style={styles.descriptionText}>{item.transactionCategory.join(' • ')}</Text>
                <Text style={styles.descriptionText}>{item.transactionDate}</Text>
                <Text style={styles.descriptionText}> {item.transactionDescription}</Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />

                <EditButton
                    navigateTo="EditBudgetScreen"
                    params={{ budgetID: budgetID }}
                />


                <View style={styles.headerContainer}>

                    <Text style={styles.titleText}>{budgetDetails.budgetTitle}</Text>

                    <Text style={styles.amountText}>
                        <Text style={styles.amountTextBold}>{budgetDetails.remainingBudgetAmount} </Text>
                        left of {budgetDetails.budgetAmount}
                    </Text>

                    <View style={styles.progressBarContainer}>
                        <ProgressBar
                            startDate={budgetDetails.startDate}
                            endDate={budgetDetails.endDate}
                            budgetColorTheme={budgetDetails.color || '#9ACBD0'}
                        />

                        <Text style={styles.categoryText}>
                            {budgetDetails.budgetType ?? "BudgetType_Placeholder"}
                        </Text>

                    </View>
                </View>

                <View style={styles.graphContainer}>
                    {/* <CircleGraph transactions={budgetDetails.transactions} /> */}
                    <View style={styles.graphKey}>
                        <Text style={styles.descriptionText}>Graph Key Goes Here</Text>
                    </View>
                </View>


                <View style={styles.transactionsActivityContainer}>
                    <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>Transactions Activity</Text>

                    <View style={styles.transactionsContainer}>
                        <FlatList
                            data={budgetTransactions}
                            renderItem={renderTransaction}
                            keyExtractor={(item) => `${item.transactionID}`}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </InAppBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#181818'
    },

    headerContainer: {
        borderColor: theme.colors.primary,
        padding: 15,
        marginTop: 30,
        borderBottomWidth: 5,
    },

    titleText: {
        fontSize: 25,
        color: "#fff",
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'flex-start',
    },

    descriptionText: {
        fontSize: 15,
        color: theme.colors.surface,
        fontFamily: theme.fonts.medium.fontFamily,
    },

    categoryText: {
        fontSize: 15,
        color: theme.colors.surface,
        fontFamily: theme.fonts.bold.fontFamily,
        alignSelf: 'center',
    },

    amountText: {
        fontSize: 15,
        color: theme.colors.description,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'flex-start',
        paddingTop: 10,
        marginBottom: 5,
    },

    amountTextBold: {
        fontSize: 15,
        color: theme.colors.description,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
        paddingTop: 20,
    },

    graphContainer: {
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
    },

    transactionsActivityContainer: {
        marginTop: 10,
        padding: 16,
    },

    transactionsContainer: {
        maxHeight: 500,
    },

    transactionCard: {
        padding: 15,
        marginVertical: 20,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: theme.colors.secondary,
    },

    transactionTitle: {
        color: theme.colors.description,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
    },
    transactionAmount: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 15,
    },
    dateText: {
        fontSize: 15,
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.description,
        lineHeight: 21,
        textAlign: 'flex-start',
        paddingTop: 10
    },
});
