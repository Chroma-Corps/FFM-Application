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
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'

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

                const response = await fetch(`${API_URL_DEVICE}/budgets/${userID}`, {
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

            const response = await fetch(`${API_URL_DEVICE}/add-transaction`, {
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
                <View style={styles.container}>
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
                        placeholder="Choose Budget"
                        placeholderStyle={styles.placeholderStyle}
                        textStyle={styles.textStyle}
                        listItemLabelStyle={styles.listItemLabelStyle}
                        dropDownContainerStyle={styles.dropDownContainerStyle}
                    />
                </View>
            </Card>
            <BackButton goBack={navigation.goBack} />
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
            padding: 5,
            borderRadius: 8,
            fontSize: 14,
            color: '#333',
            marginBottom: 15,
            fontFamily: theme.fonts.medium.fontFamily,
        },

        button: { marginBottom: 0, },

        radioContainer: { 
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
        },

        radioButton: {
            padding: 10,
            marginHorizontal: 5,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.surface,
            borderRadius: 5,
            backgroundColor: "#181818",
        },

        radioSelected: { backgroundColor: theme.colors.primary },
        radioText: { color: theme.colors.surface, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 },
        radioTextSelected: { color: "white" },

        container: {
            padding: 15,
          },
          pickerContainer: {
            width: '100%',
          },
          placeholderStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
          },
          textStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
          },
          listItemLabelStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
          },
          dropDownContainerStyle: {
            backgroundColor: '#f9f9f9',
            borderColor: theme.colors.secondary,
            borderWidth: 2,
          },
    });