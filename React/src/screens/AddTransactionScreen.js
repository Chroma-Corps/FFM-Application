import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../components/Button';
import TransactionType from '../constants/TransactionTypes';
import TransactionCategories from '../constants/TransactionCategories';

export default function AddTransactionScreen({ navigation }) {
    const [transactionTitle, setTransactionTitle] = useState('');
    const [transactionDesc, setTransactionDesc] = useState('');
    const [transactionType, setTransactionType] = useState('expense');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionTime, setTransactionTime] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [budgets, setBudgets] = useState(null);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const userID = await AsyncStorage.getItem('user_id');

                if (!token || !userID) {
                    console.error('No Token or UserID Found');
                    return;
                }

                const response = await fetch(`${API_URL_LOCAL}/budgets/${userID}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setBudgets(data);
                } else {
                    console.error('Failed to fetch budgets:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        fetchBudgets();
    }, []);

    // Add Transaction
    const addTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const userID = await AsyncStorage.getItem('user_id');

            if (!token || !userID) {
            console.error('Missing required data');
            return;
            }

            const response = await fetch(`${API_URL_LOCAL}/add-transaction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                transactionTitle,
                transactionDesc,
                transactionType,
                transactionCategory,
                transactionAmount,
                transactionDate,
                transactionTime,
                budgetID: selectedBudget,
            }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message)
                navigation.goBack();
            } else {
            alert(data.error)
            }
        } catch (error) {
            alert(data.error)
        }
    };

    return (
    <View style={styles.screen}>
        <InAppBackground>
            <InAppHeader>Add Transaction</InAppHeader>

            <Card style={styles.card}>
                <View style={styles.radioContainer}>
                    {Object.values(TransactionType).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.radioButton,
                                transactionType === type && styles.radioSelected,
                            ]}
                            onPress={() => setTransactionType(type)}
                        >
                            <Text style={transactionType === type ? styles.radioTextSelected : styles.radioText}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    placeholder="Transaction Title"
                    value={transactionTitle}
                    onChangeText={setTransactionTitle}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Description"
                    value={transactionDesc}
                    onChangeText={setTransactionDesc}
                    style={styles.input}
                />
                <Text style={styles.label}>Categories</Text>
                <View style={styles.radioContainer}>
                    {Object.values(TransactionCategories).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.radioButton,
                                transactionCategory === type && styles.radioSelected,
                            ]}
                            onPress={() => setTransactionCategory(type)}
                        >
                            <Text style={transactionCategory === type ? styles.radioTextSelected : styles.radioText}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    placeholder="Amount"
                    value={transactionAmount}
                    onChangeText={setTransactionAmount}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Date (YYYY-MM-DD)"
                    value={transactionDate}
                    onChangeText={setTransactionDate}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Time (HH:MM)"
                    value={transactionTime}
                    onChangeText={setTransactionTime}
                    style={styles.input}
                />

                <Text style={styles.label}>Select Budget</Text>
                <DropDownPicker
                    open={open}
                    value={selectedBudget}
                    items={[
                    { label: 'No Budget', value: null },
                    ...(Array.isArray(budgets) ? budgets : []).map((budget) => ({
                        label: budget.budgetTitle,
                        value: budget.budgetID,
                    })),
                    ]}
                    setOpen={setOpen}
                    setValue={setSelectedBudget}
                    containerStyle={styles.pickerContainer}
                    style={styles.picker}
                    placeholder="Select a Budget"
                />
            </Card>
            <Button onPress={addTransaction} style={styles.button}>
                Add
            </Button>
        </InAppBackground>
    </View>
    );
    }

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            justifyContent: 'space-between',
        },

        card: {
            margin: 20,
            padding: 15,
            flex: 1,
        },

        input: {
            borderBottomWidth: 1,
            marginBottom: 10,
            padding: 8,
        },

        label: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
        },

        button: { marginBottom: 20, },

        radioContainer: { 
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
        },

        radioButton: {
            padding: 10,
            marginHorizontal: 5,
            borderWidth: 1,
            borderColor: "#007AFF",
            borderRadius: 5,
            backgroundColor: "transparent",
        },

        radioSelected: { backgroundColor: "#007AFF",},
        radioText: { color: "black" },
        radioTextSelected: { color: "white" },
        pickerContainer: { marginBottom: 10 },
        picker: { borderColor: "#ccc" },
    });