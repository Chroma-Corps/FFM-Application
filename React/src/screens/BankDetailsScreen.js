import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import ButtonSmall from '../components/ButtonSmall';
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import TransactionType from '../constants/TransactionTypes';
import BankTransactionsPopup from '../components/BankTransactionsPopup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DonutChart from '../components/DonutChart';

//Random genreated colors for the donut chart until colors are assigned to a category (Rynnia.R)
const pieChartColors = [
    '#FF6B6B', // Soft Red
    '#FF8E72', // Warm Orange
    '#FFA600', // Gold
    '#FFD166', // Soft Yellow
    '#06D6A0', // Mint Green
    '#1B9AAA', // Teal Blue
    '#2A9D8F', // Deep Turquoise
    '#118AB2', // Light Blue
    '#E63946', // Deep Red
    '#F4A261', // Peach
];

const getRandomColor = () => {
    return pieChartColors[Math.floor(Math.random() * pieChartColors.length)];
};



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
    const [bankCategories, setBankCategories] = useState([]);

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

    const getBankCategories = (filteredTransactions) => {
        if (!filteredTransactions) return [];

        const topCategoriesMap = {};

        filteredTransactions.forEach(transaction => {

            const amount = parseFloat(transaction.transactionAmount.replace(/[^\d.-]/g, "").trim()) || 0;
            const category = Array.isArray(transaction.transactionCategory) ? transaction.transactionCategory[0] : transaction.transactionCategory || "Uncategorized";
            const type = transaction.transactionType ? transaction.transactionType.trim().toLowerCase() : "";

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

        return result;
    };

    useEffect(() => {
        const bankCategoriesResult = getBankCategories(filteredTransactions);
        const topThreeCategories = bankCategoriesResult.slice(0, 3);

        setBankCategories(bankCategoriesResult)
        setTopCategories(topThreeCategories);
    }, [bankTransactions, selectedOption]);

    const renderTopTransactions = (categories) => {
        if (!categories) {
            return <Text style={[styles.defaultText, { fontSize: 15 }]}>No transactions available</Text>;
        }

        return categories.map((category, index) => {

            const categoryData = selectedOption === 'Income' ? category.income : category.expense;

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

                        <Icon
                            name={selectedOption === 'Income' ? "arrow-up" : "arrow-down"} // Arrow-down for positive, arrow-up for negative
                            size={18}
                            color={selectedOption === 'Income' ? '#80c582' : '#e57373'} // Red for expense, green for income
                        />

                        <Text style={[
                            styles.defaultText,
                            { fontSize: 15, color: selectedOption === 'Income' ? '#80c582' : '#e57373' }
                        ]}>
                            {currencySymbol} {categoryData.totalAmount.toFixed(2)}
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

    const defaultColor = '#d3d3d3';

    const categoryImages = {
        bills: require('../assets/icons/bills.png'),
        entertainment: require('../assets/icons/entertainment.png'),
        groceries: require('../assets/icons/groceries.png'),
        income: require('../assets/icons/income.png'),
        shopping: require('../assets/icons/shopping.png'),
        transit: require('../assets/icons/transit.png')
    };

    let donutData = bankCategories.map(category => {
        const incomeAmount = category.income.count || 0;
        const expenseAmount = category.expense.count || 0;
        const categoryName = category.name.toLowerCase();

        return {
            name: category.name,
            value: selectedOption === 'Income' ? incomeAmount : expenseAmount,
            color: getRandomColor(),
            label: {
                text: category.name, // Add text label first (testing if images are supported)
                image: categoryImages[categoryName] || require('../assets/default_img.jpg'), // Image as a label
            }
        };
    }).filter(data => data.value > 0);

    if (donutData.length === 0) {
        donutData = [{ value: 1, color: defaultColor, label: { text: 'No Data', fontSize: 10 } }];

    } else if (donutData.length === 1) {
        donutData[0].value = 1;
    }

    return (

        <View style={styles.bankDetailsScreen} >
            <InAppBackground>

                <BackButton goBack={navigation.goBack} />
                <EditButton />

                {showBankTransactionsPopup && (
                    <BankTransactionsPopup
                        selectedOption={selectedOption}
                        bankTransactions={bankTransactions}
                        setShowBankTransactionsPopup={setShowBankTransactionsPopup}
                    />
                )}
                <ScrollView style={styles.scrollViewContainer}>
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

                            <View style={{ height: 250, width: 250 }}>
                                <DonutChart
                                    widthAndHeight={250}
                                    series={donutData.map(data => ({
                                        value: data.value,
                                        color: data.color,
                                    }))}
                                />

                            </View>


                            <View style={styles.graphKeyContainer}>
                                {donutData.map((data, index) => (
                                    <View key={index} style={styles.keyRow}>
                                        <View style={[styles.colorBlock, { backgroundColor: data.color }]} />

                                        <Image
                                            source={data.label.image}
                                            style={styles.keyImage}
                                        />

                                        <Text style={[styles.defaultText, { fontSize: 12 }]}>{data.name}</Text>
                                    </View>
                                ))}
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
                </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    graphKeyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        paddingVertical: 10,
    },

    keyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginVertical: 5,
    },

    colorBlock: {
        width: 20,
        height: 20,
        marginRight: 5,
        borderRadius: 8,
    },

    keyImage: {
        width: 30,
        height: 30,
        marginRight: 5,
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

    transactionCountCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'transparent',
    }
});
