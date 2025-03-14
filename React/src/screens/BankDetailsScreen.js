import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import ButtonSmall from '../components/ButtonSmall';
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import TransactionType from '../constants/TransactionTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

{/* <Icon
                  name={isExpense ? "arrow-down" : "arrow-up"}
                  size={18}
                  color={isExpense ? theme.colors.expense : theme.colors.income}
                /> */}


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


    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBankDetails = async () => {

            try {
                const response = await fetch(`https://ffm-application-midterm.onrender.com/bank/${bankID}`);
                if (response.ok) {
                    const bankData = await response.json();
                    setBankDetails(bankData);
                } else {
                    console.error('Failed to fetch bank details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching bank details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBankTransactions = async () => {
            try {
                const response = await fetch(`https://ffm-application-midterm.onrender.com/bank/${bankID}/transactions`);

                if (response.ok) {
                    const transactionData = await response.json();
                    setBankTransactions(transactionData);
                } else {
                    console.error('Failed to Fetch Bank Transactions:', response.status,);
                }
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

    const getTopCategories = (filteredTransactions) => {
        if (!Array.isArray(filteredTransactions)) {
            console.error("filteredTransactions is not an array:", filteredTransactions);
            return [];
        }

        const topCategoriesMap = {};

        filteredTransactions.forEach(transaction => {
            const category = transaction.transactionCategory;
            const amount = parseFloat(transaction.transactionAmount.replace(/[^0-9.]/g, "")) || 0;

            if (!topCategoriesMap[category]) {
                topCategoriesMap[category] = { count: 0, totalAmount: 0, transactions: [] };
            }

            topCategoriesMap[category].count += 1;
            topCategoriesMap[category].totalAmount += amount;
            topCategoriesMap[category].transactions.push(transaction);
        });
        // Return the top 3 categories (descending), Includes: (1)Category (2)Count (3)Associated Transactions in a Nested List
        return Object.keys(topCategoriesMap)
            .sort((a, b) => topCategoriesMap[b].count - topCategoriesMap[a].count)
            .map(category => ({
                category,
                count: topCategoriesMap[category].count,
                totalAmount: topCategoriesMap[category].totalAmount,
                transactions: topCategoriesMap[category].transactions
            }))
            .slice(0, 3);
    };

    useEffect(() => {
        if (bankTransactions.length > 0) {
            const filteredTransactions = bankTransactions.filter(transaction =>
                selectedOption === 'Income'
                    ? transaction.transactionType.toLowerCase() === 'income'
                    : transaction.transactionType.toLowerCase() === 'expense'
            );

            setTopCategories(getTopCategories(filteredTransactions));  // Use filteredTransactions here
        }
    }, [selectedOption, bankTransactions]);  // Trigger when `selectedOption` or `bankTransactions` changes


    const handleOptionPress = (option) => {

        console.log('Button pressed:', option);

        setSelectedOption(option);
        setTopCategories(getTopCategories());
    };

    const showTransactionsPopup = () => {
        Alert.alert("No Bank Transactions", "You have No Bank Transactions");
    };

    const renderTopTransactions = (transactions) => {
        if (!transactions || !Array.isArray(transactions)) {
            return <Text style={[styles.defaultText, { fontSize: 15 }]}>No transactions available</Text>;
        }

        return transactions.map((transaction, index) => {
            return (
                <View key={index} style={styles.transactionRow}>
                    <View style={styles.transactionCategoryTitleContainer}>
                        <View style={styles.transactionCountCircle}>
                            <Text style={[styles.defaultText, { fontSize: 15 }]}>
                                {transaction.count || 0}
                            </Text>
                        </View>
                        <Text style={[styles.defaultText, { fontSize: 15 }]}>
                            {transaction.category}
                        </Text>
                    </View>

                    <View style={styles.transactionAmountContainer}>
                        <Text style={[styles.defaultText, { fontSize: 15, fontWeight: 'bold' }]}>
                            {transaction.totalAmount > 0 ? '↑' : '↓'}
                        </Text>
                        <Text style={[styles.defaultText, { fontSize: 15 }]}>
                            {transaction.totalAmount ? `$${transaction.totalAmount.toFixed(2)}` : 'N/A'}
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

                        {/* <View style={styles.transactionRow}>
                            <View style={styles.transactionCategoryTitleContainer}>

                                <View style={styles.transactionCountCircle}>
                                    <Text style={[styles.defaultText, { fontSize: 15 }]}>10</Text>
                                </View>

                                <Text style={[styles.defaultText, { fontSize: 15 }]}>Groceries</Text>
                            </View>

                            <View style={styles.transactionAmountContainer}>
                                <Text style={[styles.defaultText, { fontSize: 15, fontWeight: 'bold' }]}>↑</Text>
                                <Text style={[styles.defaultText, { fontSize: 15 }]}>$250</Text>
                            </View>
                        </View> */}

                    </View>

                    <View>
                        <ButtonSmall
                            label="View All Transactions"
                            onPress={showTransactionsPopup}
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
