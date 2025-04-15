import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { theme } from '../../core/theme';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import ButtonSmall from '../../components/ButtonSmall';
import InAppBackground from '../../components/InAppBackground';
import TransactionType from '../../constants/TransactionTypes';
import BankTransactionsPopup from '../../components/BankTransactionsPopup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DonutChart from '../../components/DonutChart';
import categoryIcons from '../../constants/categoryIcons';

const parseTransactionAmount = (amountString) => {
    if (typeof amountString !== 'string') {
        return { amount: 0, currencySymbol: '' };
    }
    const amount = parseFloat(amountString.replace(/[^0-9.]/g, '')) || 0;
    const currencySymbol = amountString.replace(/[0-9.,\s]/g, '').trim() || '';
    return { amount, currencySymbol };
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
    const [bankCategories, setBankCategories] = useState([]);
    const [topCategories, setTopCategories] = useState([]);

    const [showBankTransactionsPopup, setShowBankTransactionsPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const stablePieChartColors = useMemo(() => [
        '#FF6B6B', '#FF8E72', '#FFA600', '#FFD166', '#06D6A0',
        '#1B9AAA', '#2A9D8F', '#118AB2', '#E63946', '#F4A261',
        '#E76F51', '#264653', '#A8DADC', '#457B9D', '#1D3557'
    ], []);

    const categoryColorMap = useMemo(() => new Map(), []);

    const getCategoryColor = useCallback((categoryName, index) => {
        if (!categoryColorMap.has(categoryName)) {
            const colorIndex = categoryColorMap.size % stablePieChartColors.length;
            categoryColorMap.set(categoryName, stablePieChartColors[colorIndex]);
        }
        return categoryColorMap.get(categoryName);
    }, [categoryColorMap, stablePieChartColors]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem("access_token");

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setLoading(false);
                return;
            }

            const API_URL = process.env.API_BASE_URL || 'https://ffm-application-main.onrender.com';

            try {
                const [bankResponse, transactionsResponse] = await Promise.all([
                    fetch(`${API_URL}/bank/${bankID}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    }),
                    fetch(`${API_URL}/bank/${bankID}/transactions`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    })
                ]);

                const bankData = await bankResponse.json();
                const transactionData = await transactionsResponse.json();

                if (bankResponse.ok) {
                    setBankDetails(bankData.bank);
                } else {
                    console.error('Bank Details Error:', bankData.message);
                }

                if (transactionsResponse.ok) {
                    setBankTransactions(transactionData.transactions || []);
                } else {
                    console.error('Transactions Error:', transactionData.message);
                }

                if (!bankResponse.ok || !transactionsResponse.ok) {
                    let combinedError = '';
                    if (!bankResponse.ok) combinedError += `Failed to load bank details (${bankResponse.status}). `;
                    if (!transactionsResponse.ok) combinedError += `Failed to load transactions (${transactionsResponse.status}).`;
                    setError(combinedError.trim() || 'An error occurred while fetching data.');
                }

            } catch (err) {
                console.error('Error Fetching Data:', err);
                setError('Network error or server issue. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bankID]);

    useEffect(() => {
        if (bankTransactions.length > 0) {
            let income = 0;
            let expense = 0;
            let incomeTotal = 0;
            let expenseTotal = 0;
            let firstSymbol = '';

            bankTransactions.forEach((transaction, index) => {
                const type = transaction.transactionType?.toLowerCase();
                const { amount, currencySymbol: symbol } = parseTransactionAmount(transaction.transactionAmount);

                if (index === 0 && symbol) {
                    firstSymbol = symbol;
                }

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
            setCurrencySymbol(firstSymbol);
        } else {
            setIncomeCount(0);
            setExpenseCount(0);
            setIncomeAmount(0);
            setExpenseAmount(0);
            setCurrencySymbol('');
        }
    }, [bankTransactions]);


    const processedCategories = useMemo(() => {
        if (!bankTransactions || bankTransactions.length === 0) return [];

        const categoriesMap = bankTransactions.reduce((acc, transaction) => {
            const category = Array.isArray(transaction.transactionCategory)
                ? transaction.transactionCategory[0]
                : transaction.transactionCategory || "Uncategorized";
            const type = transaction.transactionType?.trim().toLowerCase();
            const { amount } = parseTransactionAmount(transaction.transactionAmount);

            if (!acc[category]) {
                acc[category] = {
                    name: category,
                    income: { totalAmount: 0, count: 0 },
                    expense: { totalAmount: 0, count: 0 },
                };
            }

            if (type === TransactionType.INCOME.toLowerCase()) {
                acc[category].income.totalAmount += amount;
                acc[category].income.count += 1;
            } else if (type === TransactionType.EXPENSE.toLowerCase()) {
                acc[category].expense.totalAmount += amount;
                acc[category].expense.count += 1;
            }

            return acc;
        }, {});

        return Object.values(categoriesMap);

    }, [bankTransactions]);

    useEffect(() => {
        const relevantCategories = processedCategories
            .filter(cat => selectedOption === 'Income' ? cat.income.count > 0 : cat.expense.count > 0)
            .sort((a, b) => {
                const amountA = selectedOption === 'Income' ? a.income.totalAmount : a.expense.totalAmount;
                const amountB = selectedOption === 'Income' ? b.income.totalAmount : b.expense.totalAmount;
                return amountB - amountA;
            });

        setBankCategories(relevantCategories);
        setTopCategories(relevantCategories.slice(0, 3));

    }, [processedCategories, selectedOption]);


    const handleOptionPress = (option) => {
        setSelectedOption(option);
    };

    const handleViewAllTransactions = () => {
        setShowBankTransactionsPopup(true);
    };


    const renderTopTransactions = useCallback((categories) => {
        if (!categories || categories.length === 0) {
            return <Text style={[styles.defaultText, styles.infoText, { textAlign: 'center', paddingVertical: 20 }]}>
                No {selectedOption} transactions found.
            </Text>;
        }

        return categories.map((category, index) => {
            const categoryData = selectedOption === 'Income' ? category.income : category.expense;
            const isIncome = selectedOption === 'Income';
            const color = isIncome ? theme.colors.income : theme.colors.expense;

            return (
                <View key={`${category.name}-${index}`} style={styles.transactionRow}>
                    <View style={styles.transactionCategoryTitleContainer}>
                        <View style={styles.transactionCountCircle}>
                            <Text style={[styles.defaultText, styles.smallText, { color: 'white' }]}>
                                {categoryData.count}
                            </Text>
                        </View>
                        <Text style={[styles.defaultText, styles.mediumText]}>
                            {category.name}
                        </Text>
                    </View>
                    <View style={styles.transactionAmountContainer}>
                        <Icon
                            name={isIncome ? "arrow-up" : "arrow-down"}
                            size={18}
                            color={color}
                        />
                        <Text style={[styles.defaultText, styles.mediumText, { color: color }]}>
                            {currencySymbol} {categoryData.totalAmount.toFixed(2)}
                        </Text>
                    </View>
                </View>
            );
        });
    }, [selectedOption, currencySymbol]);

    const donutData = useMemo(() => {
        const data = bankCategories
            .map((category, index) => {
                const categoryData = selectedOption === 'Income' ? category.income : category.expense;
                const categoryNameLower = category.name.toLowerCase();
                const imageKey = categoryIcons[categoryNameLower] ? categoryNameLower : 'default';

                return {
                    name: category.name,
                    value: categoryData.count,
                    color: getCategoryColor(category.name, index),
                    label: category.name,
                    image: categoryIcons[imageKey],
                };
            })
            .filter(data => data.value > 0);

        if (data.length === 0) {

            return [{
                name: 'No Data',
                value: 1,
                color: theme.colors.disabled || '#CCCCCC',
                label: 'No Data',
                image: categoryIcons.default
            }];
        }

        return data;

    }, [bankCategories, selectedOption, getCategoryColor]);


    if (loading) {
        return (
            <View style={styles.bankDetailsScreen}>
                <InAppBackground>
                    <View style={styles.centeredContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={[styles.defaultText, styles.infoText, { marginTop: 15 }]}>Loading Bank Details...</Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.bankDetailsScreen}>
                <InAppBackground>
                    <BackButton goBack={navigation.goBack} />
                    <View style={styles.centeredContainer}>
                        <Icon name="alert-circle-outline" size={50} color={theme.colors.error} />
                        <Text style={[styles.defaultText, styles.errorText, { marginTop: 15, marginHorizontal: 20 }]}>
                            {error}
                        </Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }

    if (!bankDetails) {
        return (
            <View style={styles.bankDetailsScreen}>
                <InAppBackground>
                    <BackButton goBack={navigation.goBack} />
                    <View style={styles.centeredContainer}>
                        <Icon name="alert-circle-outline" size={50} color={theme.colors.secondary} />
                        <Text style={[styles.defaultText, styles.infoText, { marginTop: 15 }]}>
                            Bank details could not be loaded or found.
                        </Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }

    return (
        <View style={styles.bankDetailsScreen} >
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                {/* <EditButton onPress={() => {}} /> */}

                {showBankTransactionsPopup && (
                    <BankTransactionsPopup
                        selectedOption={selectedOption}
                        bankTransactions={bankTransactions.filter(t => t.transactionType?.toLowerCase() === selectedOption.toLowerCase())}
                        currencySymbol={currencySymbol}
                        setShowBankTransactionsPopup={setShowBankTransactionsPopup}
                        visible={showBankTransactionsPopup}
                    />
                )}

                <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollContentContainer}>
                    <View style={styles.bankDetailsContainer}>

                        <View style={styles.headerContainer}>
                            <Text style={[styles.defaultText, styles.headerTitle]}>{bankDetails.bankTitle}</Text>
                            <Text style={[styles.defaultText]}>
                                {bankDetails.isPrimary && (
                                        <Text style={styles.primaryBankText}>Primary Bank</Text>
                                )}
                            </Text>
                            <Text style={[styles.defaultText, styles.headerAmount]}>{bankDetails.remainingBankAmount}</Text>
                            <Text style={styles.createdByText}>Created By {bankDetails.owner}</Text>

                            <View style={styles.allTimeSummaryContainer}>
                                <Text style={[styles.defaultText, styles.subHeaderText]}>All Time</Text>
                                <View style={styles.transactionRow}>
                                    <Text style={[styles.defaultText, styles.mediumText, { color: theme.colors.income }]}>Income (x{incomeCount})</Text>
                                    <View style={styles.lineSeparator} />
                                    <Text style={[styles.defaultText, styles.mediumText, { color: theme.colors.income }]}>
                                        {currencySymbol} {incomeAmount.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.transactionRow}>
                                    <Text style={[styles.defaultText, styles.mediumText, { color: theme.colors.expense }]}>Expense (x{expenseCount})</Text>
                                    <View style={styles.lineSeparator} />
                                    <Text style={[styles.defaultText, styles.mediumText, { color: theme.colors.expense }]}>
                                        {currencySymbol} {expenseAmount.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.statisticsOptionsContainer}>
                            <Button
                                mode={selectedOption === 'Income' ? 'contained' : 'outlined'}
                                onPress={() => handleOptionPress('Income')}
                                style={[
                                    styles.optionButton,
                                    selectedOption === 'Income' ? styles.incomeSelected : styles.defaultButton,
                                ]}
                                labelStyle={[styles.buttonText, selectedOption !== 'Income' && styles.defaultButtonText]}
                                theme={{ colors: { primary: theme.colors.income } }}
                            >
                                Income
                            </Button>
                            <Button
                                mode={selectedOption === 'Expense' ? 'contained' : 'outlined'}
                                onPress={() => handleOptionPress('Expense')}
                                style={[
                                    styles.optionButton,
                                    selectedOption === 'Expense' ? styles.expenseSelected : styles.defaultButton,
                                ]}
                                labelStyle={[styles.buttonText, selectedOption !== 'Expense' && styles.defaultButtonText]}
                                theme={{ colors: { primary: theme.colors.expense } }}
                            >
                                Expense
                            </Button>
                        </View>

                        <View style={styles.bankStatisticsContainer}>
                            <Text style={[styles.defaultText, styles.subHeaderText, { alignSelf: 'flex-start', paddingLeft: 10, marginBottom: 15 }]}>
                                {selectedOption} Breakdown by Category
                            </Text>
                            <View style={styles.chartAndKeyWrapper}>
                                <View style={styles.chartContainer}>
                                    <DonutChart
                                        widthAndHeight={180}
                                        series={donutData.map(data => ({
                                            value: data.value,
                                            // Ensure color is passed, provide fallback
                                            color: data.color || '#CCCCCC',
                                        }))}
                                        strokeWidth={20}
                                    />
                                </View>
                                <View style={styles.graphKeyContainer}>
                                    {donutData.map((data, index) => (
                                        <View key={`${data.name}-${index}-key`} style={styles.keyRow}>
                                            <View style={[styles.colorBlock, { backgroundColor: data.color || '#CCCCCC' }]} />
                                            <Image
                                                source={data.image}
                                                style={styles.keyImage}
                                                resizeMode="contain"
                                            />
                                            <Text style={[styles.defaultText, styles.smallText, { flexShrink: 1 }]}>{data.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.defaultText, styles.subHeaderText, { alignSelf: 'flex-start', marginVertical: 15, paddingLeft: 10 }]}>
                            Top {selectedOption} Categories
                        </Text>
                        <View style={styles.transactionsListingContainer}>
                            {renderTopTransactions(topCategories)}
                        </View>

                        <View style={styles.viewAllButtonContainer}>
                            <ButtonSmall
                                label={`View All ${selectedOption} Transactions`}
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
    scrollViewContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 30,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bankDetailsContainer: {
        flex: 1,
        alignItems: 'center',
    },
    defaultText: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        textAlign: 'center',
    },
    infoText: {
        fontSize: 16,
        lineHeight: 24,
    },
    errorText: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.error,
    },
    smallText: {
        fontSize: 12,
        lineHeight: 16,
    },
    mediumText: {
        fontSize: 15,
        lineHeight: 21,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 60,
        paddingBottom: 15,
        borderBottomWidth: 3,
        borderColor: theme.colors.primary,
        marginBottom: 20,
    },
    headerTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 32,
        marginBottom: 5,
    },
    headerAmount: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 26,
        marginBottom: 15,
        color: theme.colors.primary,
    },
    allTimeSummaryContainer: {
        width: '95%',
        marginTop: 10,
    },
    subHeaderText: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        marginBottom: 10,
        alignSelf: 'flex-start',
        paddingLeft: 10,
    },
    statisticsOptionsContainer: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
    },
    optionButton: {
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    defaultButton: {
        borderColor: 'rgba(255, 255, 255, 0.7)',
        backgroundColor: 'transparent',
    },
    incomeSelected: {
        backgroundColor: theme.colors.income,
        borderColor: theme.colors.income,
    },
    createdByText: {
        fontSize: 14,
        color: theme.colors.grayedText,
        fontFamily: theme.fonts.medium.fontFamily,
        lineHeight: 20,
    },
    expenseSelected: {
        backgroundColor: theme.colors.expense,
        borderColor: theme.colors.expense,
    },
    buttonText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 15,
        lineHeight: 26,
        color: 'white',
    },
    defaultButtonText: {
        color: 'rgba(255, 255, 255, 0.9)',
    },
    bankStatisticsContainer: {
        width: '95%',
        alignItems: 'center',
        marginBottom: 15,
    },
    chartAndKeyWrapper: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    chartContainer: {
    },
    graphKeyContainer: {
        flex: 1,
        marginLeft: 15,
        alignSelf: 'center',
    },
    keyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    colorBlock: {
        width: 14,
        height: 14,
        borderRadius: 3,
        marginRight: 6,
    },
    keyImage: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    transactionsListingContainer: {
        width: '95%',
        paddingBottom: 10,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginVertical: 4,
    },
    transactionCategoryTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    transactionAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    transactionCountCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    lineSeparator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 5,
        flexGrow: 1,
    },
    viewAllButtonContainer: {
        marginTop: 15,
        width: '60%',
        alignSelf: 'center',
    }
});