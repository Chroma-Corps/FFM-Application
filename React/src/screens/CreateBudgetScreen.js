import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import { API_URL_DEVICE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import DateSelector from '../components/DateSelector';
import FilterTag from '../components/FilterTag';
import ButtonSmall from '../components/ButtonSmall';
import PeriodSelectionPopup from '../components/PeriodSelectionPopup';
import { ScreenContainer } from 'react-native-screens';
import NotificationBell from '../components/NotificationButton';

// Dummy data for bank cards
const bankCards = [
    { bankID: 1, userID: 101, bankTitle: 'Bank 1', bankCurrency: 'USD', bankAmount: 1500, remainingBankAmount: 1200 },
    { bankID: 2, userID: 102, bankTitle: 'Bank 2', bankCurrency: 'EUR', bankAmount: 2000, remainingBankAmount: 1700 },
    { bankID: 3, userID: 103, bankTitle: 'Bank 3', bankCurrency: 'GBP', bankAmount: 2500, remainingBankAmount: 2300 },
    { bankID: 4, userID: 104, bankTitle: 'Bank 4', bankCurrency: 'USD', bankAmount: 3000, remainingBankAmount: 2900 },
    { bankID: 5, userID: 105, bankTitle: 'Bank 5', bankCurrency: 'EUR', bankAmount: 1200, remainingBankAmount: 1000 },
];

const formatDate = (date) => {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
};

// Function to calculate the end date based on selected period
const calculateEndDate = (startDate, duration, selectedPeriod) => {
    const periodsInDays = {
        daily: 1,
        weekly: 7,
        monthly: 30, // Simplified; could be more precise
        yearly: 365
    };

    if (!startDate || !duration || !selectedPeriod) {
        return null;
    }

    const start = new Date(startDate); // Ensure startDate is in a valid format
    if (isNaN(start)) {
        console.error("Invalid start date.");
        return null;  // If start date is invalid
    }

    const daysToAdd = duration * periodsInDays[selectedPeriod];

    // Check if duration is a valid number
    if (isNaN(daysToAdd)) {
        console.error("Invalid duration");
        return null;
    }

    // Add the days to the start date
    start.setDate(start.getDate() + daysToAdd);

    return start;
};

export default function CreateBudgetsScreen({ navigation }) {

    //Budget Details
    const [budgetTitle, setBudgetTitle] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetType, setBudgetType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(null);

    const [duration, setDuration] = useState(''); // To help with calclation of end date

    //Pop-up Triggers
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [showPeriodPopup, setShowPeriodPopup] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Recalculate end date when any of the dependencies change
    useEffect(() => {
        const newEndDate = calculateEndDate(startDate, duration, selectedPeriod);
        setEndDate(newEndDate);
    }, [startDate, duration, selectedPeriod]);

    const displayPeriod = () => {
        const formattedStart = formatDate(startDate);
        const formattedEnd = endDate ? formatDate(endDate) : '';

        console.log('Formatted Start:', formattedStart);
        console.log('Formatted End:', formattedEnd);

        return `${formattedStart} - ${formattedEnd}`;
    };

    const handleAmountChange = (value) => {
        setBudgetAmount(value);
    };

    const handlePeriodFocus = () => {
        if (!selectedPeriod) {
            setShowPeriodPopup(true);
        }
    };

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleDateSave = (date) => {
        setStartDate(date);
        setShowDatePicker(false);
    };

    const handleDateCancel = () => {
        setShowDatePicker(false);
    };

    const renderBankCard = ({ item }) => (
        <TouchableOpacity style={styles.bankCard}>
            <Text style={styles.bankCardTitle}>{item.bankTitle}</Text>
            <Text style={styles.bankCardAmount}>
                {item.bankCurrency} {item.bankAmount.toFixed(2)}
            </Text>
            <Text style={styles.bankCardRemaining}>
                Remaining: {item.bankCurrency} {item.remainingBankAmount.toFixed(2)}
            </Text>
        </TouchableOpacity>
    );

    const createBudget = async () => {
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');

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
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.createBudgetScreen}>
            <InAppBackground>

                {showPeriodPopup && (
                    <PeriodSelectionPopup
                        setShowPeriodPopup={setShowPeriodPopup}
                        setSelectedPeriod={setSelectedPeriod}
                    />
                )}

                {showDatePicker && (
                    <DateSelector
                        showDatePicker={showDatePicker}
                        onSave={handleDateSave}
                        onCancel={handleDateCancel}
                    />
                )}

                <View style={styles.screenContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <BackButton goBack={navigation.goBack} />
                        </View>
                        <View style={styles.cardTitle}>
                            <InAppHeader>Add Budget</InAppHeader>
                        </View>
                    </View>

                    <View>
                        <Card style={styles.card}>
                            <View style={styles.cardTopHalfContainer}>
                                <TextInput
                                    placeholder="Enter Title"
                                    value={budgetTitle}
                                    onChangeText={setBudgetTitle}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    style={[styles.input, isFocused ? styles.focused : null]}
                                />

                                <View style={styles.budgetAmountContainer}>
                                    <TextInput
                                        placeholder="$0.00"
                                        value={budgetAmount}
                                        onChangeText={handleAmountChange}
                                        style={[styles.input, styles.shortInput]}
                                        keyboardType="numeric"
                                    />

                                    <Text style={styles.slashText}>/</Text>

                                    <TextInput
                                        placeholder="0"
                                        value={duration}
                                        onChangeText={setDuration}
                                        style={[styles.input, styles.shortInput]}
                                        keyboardType="numeric"
                                    />

                                    <Text style={styles.slashText}>/</Text>

                                    <TextInput
                                        placeholder="Period"
                                        value={selectedPeriod || ''}
                                        onFocus={handlePeriodFocus}
                                        editable={false}
                                        style={[styles.input, styles.shortInput]}
                                    />


                                </View>

                                <Text style={styles.defaultText}>Starting:</Text>

                                <ButtonSmall
                                    label={startDate ? new Date(startDate).toLocaleDateString() : 'Select Date'}
                                    onPress={handleShowDatePicker}
                                    mode="contained"
                                    style={styles.dateButton}
                                />

                                <Text style={[styles.defaultText, { marginTop: 10 }]}>Budget Period</Text>
                                <Text style={{ color: '#fff' }}>{displayPeriod()}</Text>

                            </View>

                            <View style={styles.cardBottomHalfContainer}>
                                <View style={styles.budgetPropertiesContainer}>
                                    <Text style={styles.defaultText}>Select Bank:</Text>

                                    <FlatList
                                        data={bankCards}
                                        renderItem={renderBankCard}
                                        keyExtractor={(item) => item.bankID.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollContainer}
                                    />

                                    <Text style={[styles.defaultText, { marginBottom: 0 }]}>Budget Type:</Text>

                                    <View style={styles.filterTagsContainer}>
                                        <FilterTag
                                            label="Savings"
                                            isSelected={budgetType === 'Savings'}
                                            onPress={() => setBudgetType('Savings')}
                                        />
                                        <FilterTag
                                            label="Expense"
                                            isSelected={budgetType === 'Expense'}
                                            onPress={() => setBudgetType('Expense')}
                                        />
                                    </View>

                                    <Text style={styles.defaultText}>Select Budget Category:</Text>
                                </View>

                                <Button mode="outlined" onPress={createBudget}>Create</Button>
                            </View>
                        </Card>
                    </View>
                </View>
            </InAppBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    createBudgetScreen: {
        flex: 1,
    },

    defaultText: {
        fontSize: 20,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        lineHeight: 21,
        marginBottom: 5,
    },

    headerContainer: {
        flex: 1,
        flexDirection: 'coloumn',
        gap: 50
    },

    cardTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
    },

    card: {
        flex: 1,
        margin: 10,
        marginTop: 10,
        padding: 20,
        backgroundColor: '#181818',
        borderColor: theme.colors.secondary,
        borderWidth: 2,
        borderRadius: 10,
    },

    cardTopHalfContainer: {
        maxWidth: '60%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column',

    },

    input: {
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        fontSize: 25,
        paddingVertical: 8,
        marginBottom: 20,
        color: '#fff',
        borderWidth: 0,
        textAlign: 'center',
    },

    focused: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },

    budgetAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    slashText: {
        fontSize: 25,
        color: '#fff',
        marginHorizontal: 10,
    },

    shortInput: {
        width: 80,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
    },

    periodButton: {
        marginLeft: 10,
        paddingHorizontal: 10,
        height: 40,
        width: 100,
        justifyContent: 'center',
    },

    budgetPropertiesContainer: {
        width: '100%',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#222',
        borderRadius: 8,
        gap: 10,
    },

    scrollContainer: {
        marginBottom: 5,
        marginBottom: 10,
    },

    bankCard: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 8,
        marginHorizontal: 10,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bankCardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    bankCardAmount: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    bankCardRemaining: {
        color: '#fff',
        fontSize: 14,
    },

    filterTagsContainer: {
        flexDirection: 'row',
        justifyContent: 'start',
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