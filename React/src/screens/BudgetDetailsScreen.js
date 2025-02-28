import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import InAppHeader from '../components/InAppHeader'
import PlusFAB from '../components/PlusFAB';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import InAppBackground from '../components/InAppBackground';

export default function BudgetDetailsScreen({ navigation, route }) {
    const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState(null);

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            try {
                const response = await fetch(`https://ffm-application-test.onrender.com/budget/${budgetID}`);
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
    }, [budgetID]);

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
                {/* <Text style={styles.descriptionText}>Time: {item.transactionTime}</Text> */}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <InAppBackground>
                <Text style={styles.titleText}>{budgetDetails.budgetTitle}</Text>
                <Text style={styles.dateText}>From: {budgetDetails.startDate} to {budgetDetails.endDate}</Text>
                <Text style={styles.amountText}>
                    <Text style={styles.amountTextBold}>${budgetDetails.remainingBudgetAmount} </Text>
                    left of ${budgetDetails.budgetAmount}
                </Text>
                <FlatList
                    data={budgetDetails.transactions}
                    renderItem={renderTransaction}
                    keyExtractor={(item) => `${item.transactionID}`}
                />
                <BackButton goBack={navigation.goBack} />
                {/* <PlusFAB onPress={() => navigation.push('AddTransaction')}/> */}
            </InAppBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
          textAlign: 'center',
          paddingTop: 10
      },
      titleText: {
        fontSize: 25,
        color: theme.colors.surface,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
      },

      descriptionText: {
        fontSize: 15,
        color: theme.colors.surface,
        fontFamily: theme.fonts.medium.fontFamily,
      },
      amountText: {
        fontSize: 20,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'center',
        paddingTop: 20,
      },
      amountTextBold: {
        fontSize: 20,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
        paddingTop: 20,
      },
});
