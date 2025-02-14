import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import InAppHeader from '../components/InAppHeader'
import PlusFAB from '../components/PlusFAB';
import BackButton from '../components/BackButton'

export default function BudgetDetailsScreen({ navigation, route }) {
    const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState(null);

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            try {
                const response = await fetch(`${API_URL_DEVICE}/budget/${budgetID}`);
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
                <Text>{item.transactionDescription}</Text>
                <Text>Amount: ${item.transactionAmount}</Text>
                <Text>Category: {item.transactionCategory}</Text>
                <Text>Date: {item.transactionDate}</Text>
                <Text>Time: {item.transactionTime}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <InAppHeader>{budgetDetails.budgetTitle}</InAppHeader>
            <Text>From: {budgetDetails.startDate} to {budgetDetails.endDate}</Text>

            <Text style={styles.subtitle}>Transactions:</Text>
            <FlatList
                data={budgetDetails.transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => `${item.transactionID}`}
            />
            <BackButton goBack={navigation.goBack} />
            <PlusFAB onPress={() => navigation.push('AddTransaction')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    subtitle: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold',
    },

    transactionCard: {
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },

    transactionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
