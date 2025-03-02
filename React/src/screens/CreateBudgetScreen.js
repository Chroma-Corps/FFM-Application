import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'

export default function CreateBudgetsScreen({ navigation }) {
    const [budgetTitle, setBudgetTitle] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [remainingBudgetAmount, setRemainingBudgetAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const handleAmountChange = (value) => {
        setBudgetAmount(value);
        setRemainingBudgetAmount(value);
    };

    const createBudget = async () => {
        const token = await AsyncStorage.getItem("access_token");
        const userID = await AsyncStorage.getItem('user_id');

        if (!token || !userID) {
            console.error('No Token or UserID Found');
            return;
        }

        if (!budgetTitle || !startDate || !endDate) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`${API_URL_LOCAL}/create-budget`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ budgetTitle, budgetAmount, remainingBudgetAmount, startDate, endDate, userID })
            });

            if (response.ok) {
                Alert.alert('Success', 'Budget created successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to create budget');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.budgetsScreen}>
            <InAppBackground>
                <InAppHeader>New Budget</InAppHeader>
                <Card style={styles.card}>
                    <TextInput placeholder="Budget Title" value={budgetTitle} onChangeText={setBudgetTitle} style={styles.input} />
                    <TextInput placeholder="Amount" value={budgetAmount} onChangeText={handleAmountChange} style={styles.input} keyboardType="numeric" />
                    <TextInput placeholder="Start Date" value={startDate} onChangeText={setStartDate} style={styles.input} />
                    <TextInput placeholder="End Date" value={endDate} onChangeText={setEndDate} style={styles.input} />
                </Card>
                <BackButton goBack={navigation.goBack} />
                <Button onPress={createBudget}>Create</Button>
            </InAppBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    budgetsScreen: {
        flex: 1,
    },
    card: {
        flex: 1,
        margin: 10,
        padding: 25,
        backgroundColor: '#181818',
        borderColor: theme.colors.secondary,
        borderWidth: 2,
        borderRadius: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
        marginBottom: 30,
    },
});