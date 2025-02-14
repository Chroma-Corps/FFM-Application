import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import PlusFAB from '../components/PlusFAB';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateBudgetsScreen({navigation}) {
    const [budgetTitle, setBudgetTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const createBudget = async () => {
        const token = await AsyncStorage.getItem("access_token");
        const userID = await AsyncStorage.getItem('user_id');

        if (!budgetTitle || !startDate || !endDate) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`${API_URL_LOCAL}/create`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ budgetTitle, startDate, endDate, userID })
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
                    <TextInput placeholder="Start Date" value={startDate} onChangeText={setStartDate} style={styles.input} />
                    <TextInput placeholder="End Date" value={endDate} onChangeText={setEndDate} style={styles.input} />
                </Card>
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
        padding: 15,
        margin: 25,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 8,
    },
});