import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import { API_URL_DEVICE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import DateRangeSelector from '../components/DateRangeSelector';
import FilterTag from '../components/FilterTag';

export default function CreateBudgetsScreen({ navigation }) {
    export default function CreateBudgetsScreen({ navigation }) {
        const [budgetTitle, setBudgetTitle] = useState('');
        const [budgetAmount, setBudgetAmount] = useState('');
        const [remainingBudgetAmount, setRemainingBudgetAmount] = useState('');
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');
        const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);

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
                const response = await fetch(`${API_URL_DEVICE}/create-budget`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ budgetTitle, budgetAmount, remainingBudgetAmount, startDate, endDate, userID, budgetType })
                });

                if (response.ok) {
                    Alert.alert('Success', 'Budget created successfully');
                    navigation.goBack();
                } else {
                    Alert.alert('Error', 'Failed to create budget');
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
                        <View style={styles.headerContainer}>
                            <InAppHeader>
                                <BackButton goBack={navigation.goBack} style={styles.backButtonOverride} />
                                Add Budget
                            </InAppHeader>
                        </View>

                        <Card style={styles.card}>
                            <TextInput
                                placeholder="Budget Title"
                                value={budgetTitle}
                                onChangeText={setBudgetTitle}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Amount"
                                value={budgetAmount}
                                onChangeText={handleAmountChange}
                                style={styles.input}
                                keyboardType="numeric"
                            />

                            <Button mode="outlined" onPress={() => setDateRangePickerVisible(!dateRangePickerVisible)}>
                                Select Period
                            </Button>

                            <View style={styles.budgetTypeContainer}>
                                <Text style={styles.defaultText}>Select Budget Type:</Text>
                                <View style={styles.filterTagsContainer}>
                                    <FilterTag
                                        label="Individual"
                                        isSelected={budgetType === 'Individual'}
                                        onPress={() => setBudgetType('Individual')}
                                    />
                                    <FilterTag
                                        label="Family"
                                        isSelected={budgetType === 'Family'}
                                        onPress={() => setBudgetType('Family')}
                                    />
                                </View>
                            </View>
                        </Card>

                        <Button onPress={createBudget}>Create</Button>

                        {dateRangePickerVisible && (
                            <View style={styles.overlayContainer}>
                                <View style={styles.centeredContainer}>
                                    <DateRangeSelector
                                        onSave={(start, end) => {
                                            setStartDate(start);
                                            setEndDate(end);
                                            setDateRangePickerVisible(false);
                                        }}
                                        onCancel={() => setDateRangePickerVisible(false)}
                                    />
                                </View>
                            </View>
                        )}
                    </InAppBackground>
                </View>
            );
        }

        const styles = StyleSheet.create({
            defaultText: {
                fontSize: 20,
                fontFamily: theme.fonts.bold.fontFamily,
                color: 'white',
                lineHeight: 21,
                marginBottom: 10,
            },

            headerContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingVertical: 5,
                gap: 10,
            },

            backButtonOverride: {
                position: 'relative',
                top: 'auto',
                left: 'auto',
            },

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

            filterTagsContainer: {
                flexDirection: 'row',
                justifyContent: 'start',
                marginVertical: 10,
            },

            budgetTypeContainer: {
                marginTop: 20,
                padding: 10,
                backgroundColor: '#222',
                borderRadius: 8,
            },

            overlayContainer: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            },

            centeredContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            },
        });
