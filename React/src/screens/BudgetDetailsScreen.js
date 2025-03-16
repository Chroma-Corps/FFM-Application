import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import InAppHeader from '../components/InAppHeader'
import PlusFAB from '../components/PlusFAB';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import ProgressBar from '../components/ProgressBar';
import CircleGraph from '../components/CircleGraph';
import BudgetsScreen from './BudgetsScreen';

export default function BudgetDetailsScreen({ navigation, route }) {
    const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            try {
                const response = await fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}`);
                const data = await response.json();
                if (response.ok) {
                    setBudgetDetails(data);
                } else {
                    console.error('Failed to fetch budget details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching budget details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgetDetails();
    }, [budgetID]);

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
                <Text style={styles.descriptionText}>{item.transactionDescription}</Text>
                <Text style={styles.descriptionText}>Amount: ${item.transactionAmount}</Text>
                <Text style={styles.descriptionText}>Category: {item.transactionCategory}</Text>
                <Text style={styles.descriptionText}>Date: {item.transactionDate}</Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                <EditButton />
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

                        <Text style={styles.descriptionText}>
                            {budgetDetails.budgetType === null ? budgetDetails.budgetType : "BudgetType_Placeholder"}
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
                            data={budgetDetails.transactions}
                            renderItem={renderTransaction}
                            keyExtractor={(item) => `${item.transactionID}`}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>

                {/* <PlusFAB onPress={() => navigation.push('AddTransaction')}/> */}
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
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: theme.colors.surface,
    },

    transactionTitle: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
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
