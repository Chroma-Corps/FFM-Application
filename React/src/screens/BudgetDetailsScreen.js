import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import InAppHeader from '../components/InAppHeader'
import PlusFAB from '../components/PlusFAB';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import ProgressBar from '../components/ProgressBar';
import CircleGraph from '../components/CircleGraph';

export default function BudgetDetailsScreen({ navigation, route }) {
    // const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState(null);


    useEffect(() => {
        const fetchBudgetDetails = async () => {
            try {
                const response = await fetch(`${API_URL_DEVICE}/budget/${1}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Budget Details:', data);
                    setBudgetDetails(data);
                } else {
                    console.error('Failed to fetch budget details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching budget details:', error);
            }
        };

        fetchBudgetDetails();
    }, [1]);

    if (!budgetDetails) {
        return <Text>Loading...</Text>;
    }

    const renderTransaction = ({ item }) => {
        console.log('Transaction Item:', item);
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
                <BackButton onPress={() => navigation.goBack()} />
                <EditButton />

                <View style={styles.headerContainer}>

                    <Text style={styles.titleText}>{budgetDetails.budgetTitle}</Text>

                    <Text style={styles.amountText}>
                        <Text style={styles.amountTextBold}>${budgetDetails.remainingBudgetAmount} </Text>
                        left of ${budgetDetails.budgetAmount}
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

                    <CircleGraph transactions={budgetDetails.transactions} />

                    <View styles={styles.graphKey}>
                        <Text style={styles.descriptionText}>Graph Key Goes Here</Text>
                    </View>
                </View>


                <View style={styles.transactionsActivityContainer}>
                    <View style={styles.dashLines} />

                    <Text style={[styles.titleText, { color: theme.colors.textSecondary }]}>Transactions Activity</Text>

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

    dashLines: {
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dashed',
        width: '100%',
        marginVertical: 10,
    },

    headerContainer: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        marginBottom: 12,
    },

    titleText: {
        fontSize: 25,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'flex-start',
    },

    descriptionText: {
        fontSize: 15,
        color: theme.colors.surface,
        fontFamily: theme.fonts.medium.fontFamily,
    },

    amountText: {
        fontSize: 20,
        color: theme.colors.text,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'flex-start',
        paddingTop: 10,
        marginBottom: 5,
    },

    amountTextBold: {
        fontSize: 20,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'flex-start',
        paddingTop: 20,
    },

    graphContainer: {
        flexDirection: 'row',
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
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderColor: theme.colors.surface,
        borderRadius: 20,
    },

    transactionTitle: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 18,
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
