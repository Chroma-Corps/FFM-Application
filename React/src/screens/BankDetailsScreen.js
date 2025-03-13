import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import ButtonSmall from '../components/ButtonSmall';
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import { API_URL_LOCAL, API_URL_DEVICE, API_URL_RENDER } from '@env';


export default function BankDetailsScreen({ navigation, route }) {
    const { bankID } = route.params;
    const [bankDetails, setBankDetails] = useState(null);
    const [bankTransactions, setBankTransactions] = useState([]);

    const [selectedOption, setSelectedOption] = useState(null);

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

    const handleOptionPress = (option) => {
        setSelectedOption(option);
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

    const showTransactionsPopup = () => {
        // Show popup message when button is pressed
        Alert.alert("No Bank Transactions", "You have No Bank Transactions");
    };

    return (

        <View style={styles.bankDetailsScreen} >
            <InAppBackground>

                <BackButton goBack={navigation.goBack} />
                <EditButton />

                <View style={styles.bankDetailsContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.defaultText, { fontSize: 40 }]}>{bankDetails.bankTitle}</Text>
                        <Text style={[styles.defaultText, { fontSize: 30 }]}>{bankDetails.bankAmount}</Text>

                        <View style={styles.transactionsListingContainer}>

                            <Text style={[styles.defaultText, { fontSize: 20, alignSelf: 'flex-start', marginVertical: 10, paddingLeft: 10 }]}>All Time</Text>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.defaultText, { fontSize: 15 }]}>Income (x1)</Text>
                                <View style={styles.line} />
                                <Text style={[styles.defaultText, { fontSize: 15 }]}>$100</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.defaultText, { fontSize: 15 }]}>Expense (x2)</Text>
                                <View style={styles.line} />
                                <Text style={[styles.defaultText, { fontSize: 15 }]}>$200</Text>
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

                    <Text style={[styles.defaultText, { fontSize: 20, alignSelf: 'flex-start', marginVertical: 10, paddingLeft: 10 }]}>Transactions Oveview</Text>

                    <View style={styles.transactionsListingContainer}>
                        <View style={styles.transactionRow}>
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
                        </View>

                        <View style={styles.transactionRow}>
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
                        </View>
                    </View>

                    <View>
                        <ButtonSmall
                            label="All Transactions"
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
