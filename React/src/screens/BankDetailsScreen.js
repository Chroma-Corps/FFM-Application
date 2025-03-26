import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import ButtonSmall from '../components/ButtonSmall';
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import TransactionType from '../constants/TransactionTypes';
import BankTransactionsPopup from '../components/BankTransactionsPopup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BankDetailsScreen({ navigation, route }) {
    const { bankID } = route.params;
    const [bankDetails, setBankDetails] = useState(null);
    const [bankTransactions, setBankTransactions] = useState([]);

    const [selectedOption, setSelectedOption] = useState('Expense');
    const [incomeCount, setIncomeCount] = useState(0);
    const [expenseCount, setExpenseCount] = useState(0);
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [topCategories, setTopCategories] = useState([]);

    const [showBankTransactionsPopup, setShowBankTransactionsPopup] = useState(false);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBankDetails = async () => {

            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("access_token");

                if (!token) {
                    console.error('No Token Found');
                    return;
                }

                const response = await fetch(`https://ffm-application-main.onrender.com/bank/${bankID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const bankData = await response.json();

                if (response.ok) {
                    setBankDetails(bankData.bank);
                } else {
                    console.error(bankData.message);
                }

                console.log('Fetch Bank Details Status:', bankData.status)

            } catch (error) {
                console.error('Error Fetching Bank Details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBankTransactions = async () => {
            try {

                setLoading(true);
                const token = await AsyncStorage.getItem("access_token");

                if (!token) {
                    console.error('No Token Found');
                    return;
                }

                const response = await fetch(`https://ffm-application-main.onrender.com/bank/${bankID}/transactions`, {
                    methods: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const transactionData = await response.json();

                if (response.ok) {
                    setBankTransactions(transactionData.transactions);
                } else {
                    console.error(transactionData.message);
                }

                console.log('Fetch Bank Transactions Status:', transactionData.status)

            } catch (error) {
                console.error('Error Fetching Bank Transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBankDetails();
        fetchBankTransactions();
    }, [bankID]);

    useEffect(() => {
        if (bankTransactions.length > 0) {
            let income = 0;
            let expense = 0;
            let incomeTotal = 0;
            let expenseTotal = 0;
            let symbol = '';

            bankTransactions.forEach(transaction => {
                const type = transaction.transactionType.toLowerCase();

                symbol = transaction.transactionAmount.replace(/[^a-zA-Z$€£]/g, "").trim() || ''; // This will capture currency symbols like $ € £ TT$
                let amount = parseFloat(transaction.transactionAmount.replace(/[^0-9.]/g, "")) || 0; //This Removes the Currency Symbol from the amount

                if (type === TransactionType.INCOME.toLowerCase()) {
                    income++;
                    incomeTotal += amount;

                } else if (type === TransactionType.EXPENSE.toLowerCase()) {
                    expense++;
                    expenseTotal += amount;
                }
            });

            setIncomeCount(income);
            setExpenseCount(expense);
            setIncomeAmount(incomeTotal);
            setExpenseAmount(expenseTotal);
            setCurrencySymbol(symbol);
        }
    }, [bankTransactions]);

    const handleOptionPress = (option) => {
        setSelectedOption(option);
        setTopCategories(getTopCategories());
    };

    const handleViewAllTransactions = () => {
        setShowBankTransactionsPopup(true);
    };

    const filteredTransactions = bankTransactions.filter(transaction =>
        transaction.transactionType && (
            selectedOption === 'Income'
                ? transaction.transactionType.toLowerCase() === 'income'
                : transaction.transactionType.toLowerCase() === 'expense'
        )
    );

    console.log("Filtered Transactions:", filteredTransactions);

    const getTopCategories = (filteredTransactions) => {
        if (!filteredTransactions) return [];

        const topCategoriesMap = {};

        filteredTransactions.forEach(transaction => {

            const amount = parseFloat(transaction.transactionAmount.replace("TT$", "").trim()) || 0;
            const category = Array.isArray(transaction.transactionCategory) ? transaction.transactionCategory[0] : transaction.transactionCategory || "Uncategorized";
            const type = transaction.transactionType.trim().toLowerCase();

            if (!topCategoriesMap[category]) {
                topCategoriesMap[category] = {
                    Income: { totalAmount: 0, count: 0, transactions: [] },
                    Expense: { totalAmount: 0, count: 0, transactions: [] }
                };
            }

            if (type === 'income') {
                topCategoriesMap[category].Income.totalAmount += amount;
                topCategoriesMap[category].Income.count += 1;
                topCategoriesMap[category].Income.transactions.push(transaction);

            } else if (type === 'expense') {
                topCategoriesMap[category].Expense.totalAmount += amount;
                topCategoriesMap[category].Expense.count += 1;
                topCategoriesMap[category].Expense.transactions.push(transaction);
            }
        });

        const result = Object.keys(topCategoriesMap)
            .map(category => ({
                name: category,
                income: {
                    totalAmount: topCategoriesMap[category].Income.totalAmount,
                    count: topCategoriesMap[category].Income.count,
                    transactions: topCategoriesMap[category].Income.transactions
                },
                expense: {
                    totalAmount: topCategoriesMap[category].Expense.totalAmount,
                    count: topCategoriesMap[category].Expense.count,
                    transactions: topCategoriesMap[category].Expense.transactions
                }
            }))
            .sort((a, b) =>
                (b.income.totalAmount + b.expense.totalAmount) - (a.income.totalAmount + a.expense.totalAmount)
            )
            .slice(0, 3);

        return result;
    };

    useEffect(() => {
        setTopCategories(getTopCategories(filteredTransactions));
    }, [bankTransactions, selectedOption]);

    const renderTopTransactions = (categories) => {
        if (!categories) {
            return <Text style={[styles.defaultText, { fontSize: 15 }]}>No transactions available</Text>;
        }

        return categories.map((category, index) => {

            const categoryData = selectedOption === 'income' ? category.income : category.expense;

            return (
                <View key={index} style={styles.transactionRow}>
                    <View style={styles.transactionCategoryTitleContainer}>

                        <View style={styles.transactionCountCircle}>
                            <Text style={[styles.defaultText, { fontSize: 15 }]}>
                                {categoryData.count}
                            </Text>
                        </View>

                        <Text style={[styles.defaultText, { fontSize: 15 }]}>
                            {category.name}
                        </Text>
                    </View>

                    <View style={styles.transactionAmountContainer}>

                        <Text style={[styles.defaultText, { fontSize: 15 }]}>
                            ${categoryData.totalAmount.toFixed(2)}
                        </Text>
                    </View>
                </View>
            );
        });
    };


    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!bankDetails) {
        return (
            <View style={styles.bankDetailsScreen}>
                <InAppBackground>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.defaultText}>No Bank Details Available</Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }

    return (

        <View style={styles.bankDetailsScreen} >
            <InAppBackground>

                <BackButton goBack={navigation.goBack} />
                <EditButton />

                {showBankTransactionsPopup && (
                    <BankTransactionsPopup
                        bankTransactions={bankTransactions}
                        setShowBankTransactionsPopup={setShowBankTransactionsPopup}
                    />
                )}

                <View style={styles.bankDetailsContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.defaultText, { fontSize: 40 }]}>{bankDetails.bankTitle}</Text>
                        <Text style={[styles.defaultText, { fontSize: 30 }]}>{bankDetails.remainingBankAmount}</Text>

                        <View style={styles.transactionsListingContainer}>

                            <Text style={[styles.defaultText, { fontSize: 20, alignSelf: 'flex-start', marginVertical: 10, paddingLeft: 10 }]}>All Time</Text>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.defaultText, { fontSize: 15, color: '#80c582' }]}>Income (x{incomeCount})</Text>
                                <View style={styles.line} />
                                <Text style={[styles.defaultText, { fontSize: 15, color: '#80c582' }]}>{currencySymbol} {incomeAmount}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.defaultText, { fontSize: 15, color: '#e57373' }]}>Expense (x{expenseCount})</Text>
                                <View style={styles.line} />
                                <Text style={[styles.defaultText, { fontSize: 15, color: '#e57373' }]}>{currencySymbol} {expenseAmount}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statisticsOptionsContainer}>
                        <Button
                            mode={selectedOption === 'Income' ? 'contained' : 'outlined'}
                            onPress={() => handleOptionPress('Income')}
                            style={[
                                styles.button,
                                selectedOption === 'Income' && styles.incomeSelected,
                                selectedOption !== 'Income' && styles.defaultButton,
                            ]}
                            labelStyle={styles.text}
                        >
                            Income
                        </Button>
                        <Button
                            mode={selectedOption === 'Expense' ? 'contained' : 'outlined'}
                            onPress={() => handleOptionPress('Expense')}
                            style={[
                                styles.button,
                                selectedOption === 'Expense' && styles.expenseSelected,
                                selectedOption !== 'Expense' && styles.defaultButton,
                            ]}
                            labelStyle={styles.text}
                        >
                            Expense
                        </Button>
                    </View>

                    <View style={styles.bankStatisticsContainer}>
                        <Text style={[styles.defaultText, { fontSize: 15 }]}>Graph Goes Here</Text>

                        <Text style={[styles.defaultText, { fontSize: 15 }]}>Graph key Goes Here</Text>

                        <View style={styles.graphKeyContainer}>
                            <Text style={[styles.defaultText, { fontSize: 15 }]}>Key</Text>
                            <Text style={[styles.defaultText, { fontSize: 15 }]}>Key</Text>
                            <Text style={[styles.defaultText, { fontSize: 15 }]}>Key</Text>
                        </View>
                    </View>

                    <Text style={[styles.defaultText, { fontSize: 20, alignSelf: 'flex-start', marginVertical: 10, paddingLeft: 10 }]}>Transaction Overview</Text>

                    <View style={styles.transactionsListingContainer}>
                        {renderTopTransactions(topCategories)}
                    </View>

                    <View>
                        <ButtonSmall
                            label="View All Transactions"
                            onPress={handleViewAllTransactions}
                        />
                    </View>
                </View>
            </InAppBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    bankDetailsScreen: {
        flex: 1,
    },

    defaultText: {
        fontSize: 15,
        fontFamily: theme.fonts.medium.fontFamily,
        color: 'white',
        lineHeight: 21,
        textAlign: 'center',
        paddingTop: 100
    },

    bankDetailsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    defaultText: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        color: 'white',
    },

    headerContainer: {
        width: '100%',
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 50,
        borderBottomWidth: 5,
        borderColor: theme.colors.primary,
    },

    statisticsOptionsContainer: {
        width: '98%',
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 30,
    },

    button: {
        flex: 1,
        marginHorizontal: 5,
    },

    defaultButton: {

        borderColor: 'white',
        backgroundColor: 'transparent',
    },

    incomeSelected: {
        backgroundColor: '#80c582',
        borderColor: '#FFCDD2',
    },

    expenseSelected: {
        backgroundColor: '#e57373',
        borderColor: '#C8E6C9',
    },

    text: {
        color: 'white',
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 15,
        lineHeight: 26,
    },

    bankStatisticsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },

    graphKeyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    transactionsListingContainer: {
        width: '100%',
        padding: 10,
    },

    transactionRow: {
        width: '98%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },

    transactionCategoryTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    transactionAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});
