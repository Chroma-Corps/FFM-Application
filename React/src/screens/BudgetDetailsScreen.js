import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';

export default function BudgetDetailsScreen({ route }) {
    const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState(null);

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            try {
                const response = await fetch(`${API_URL_LOCAL}/budget/${budgetID}`);
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
            <Text style={styles.title}>{budgetDetails.budgetTitle}</Text>
            <Text>From: {budgetDetails.startDate} to {budgetDetails.endDate}</Text>

            <Text style={styles.subtitle}>Transactions:</Text>
            <FlatList
                data={budgetDetails.transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => `${item.transactionID}`}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
