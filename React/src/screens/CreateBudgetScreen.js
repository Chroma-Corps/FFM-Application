import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
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
import ButtonSmall from '../components/ButtonSmall';
import PeriodSelectionPopup from '../components/PeriodSelectionPopup';
import { ScreenContainer } from 'react-native-screens';

// Dummy data for bank cards
const bankCards = [
    { bankID: 1, userID: 101, bankTitle: 'Bank 1', bankCurrency: 'USD', bankAmount: 1500, remainingBankAmount: 1200 },
    { bankID: 2, userID: 102, bankTitle: 'Bank 2', bankCurrency: 'EUR', bankAmount: 2000, remainingBankAmount: 1700 },
    { bankID: 3, userID: 103, bankTitle: 'Bank 3', bankCurrency: 'GBP', bankAmount: 2500, remainingBankAmount: 2300 },
    { bankID: 4, userID: 104, bankTitle: 'Bank 4', bankCurrency: 'USD', bankAmount: 3000, remainingBankAmount: 2900 },
    { bankID: 5, userID: 105, bankTitle: 'Bank 5', bankCurrency: 'EUR', bankAmount: 1200, remainingBankAmount: 1000 },
];

export default function CreateBudgetsScreen({ navigation }) {
    const [budgetTitle, setBudgetTitle] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [remainingBudgetAmount, setRemainingBudgetAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budgetType, setBudgetType] = useState('Individual');
    const [periodSelectionPickerVisible, setPeriodSelectionPickerVisible] = useState(false);
    const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleAmountChange = (value) => {
        setBudgetAmount(value);
        setRemainingBudgetAmount(value);
    };

    const handleSave = (startDate, endDate) => {
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        setStartDate(startDate);
        setEndDate(endDate);
        // setDateRangePickerVisible(false);
    };

    const handleCancel = () => {
        setDateRangePickerVisible(false);
        setPeriodSelectionPickerVisible(false);
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

                {dateRangePickerVisible && (
                    <DateRangeSelector
                        periodSelectionPickerVisible={periodSelectionPickerVisible}
                        setPeriodSelectionPickerVisible={setPeriodSelectionPickerVisible}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}


                {periodSelectionPickerVisible && (
                    <PeriodSelectionPopup setPeriodSelectionPickerVisible={setPeriodSelectionPickerVisible} />
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

                                    <Text style={styles.slashText}>/</Text>

                                    <ButtonSmall label="Period" onPress={() => {
                                        setPeriodSelectionPickerVisible(true);
                                        setDateRangePickerVisible(false);
                                    }} />
                                </View>

                                <Text style={styles.defaultText}>Starting:</Text>

                                <ButtonSmall label="Select Date" onPress={() => {
                                    setDateRangePickerVisible(true);
                                    setPeriodSelectionPickerVisible(false);
                                }} />
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

                                    <Text style={styles.defaultText}>Budget Type:</Text>

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
        marginBottom: 10,
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
        borderBottomWidth: 2, // Bold underline when focused
        borderBottomColor: '#000', // Bold underline color
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
        width: 80,  // Adjust width for a more compact look
        textAlign: 'center',
        borderBottomWidth: 1.5,  // Thinner underline
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
        paddingVertical: 10, // Optional: to give some space at the top and bottom
        alignItems: 'center',  // Optional: to center the bank cards vertically within the scrollview
    },
    bankCard: {
        backgroundColor: '#333', // Card background color
        padding: 20,  // Padding inside the card
        borderRadius: 8, // Rounded corners
        marginHorizontal: 10, // Spacing between cards
        width: 150, // Width of each bank card
        alignItems: 'center', // Center content inside the card
        justifyContent: 'center', // Center content inside the card
    },

    bankCardTitle: {
        color: '#fff', // Text color for bank title
        fontSize: 18, // Adjust the text size
        fontWeight: 'bold',
        marginBottom: 5,
    },

    bankCardAmount: {
        color: '#fff', // Text color for the amount
        fontSize: 16, // Adjust the text size
        marginBottom: 5,
    },
    bankCardRemaining: {
        color: '#fff', // Text color for the remaining balance
        fontSize: 14, // Adjust the text size
    },

    filterTagsContainer: {
        flexDirection: 'row',
        justifyContent: 'start',
        marginVertical: 10,
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