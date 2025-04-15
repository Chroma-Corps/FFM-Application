import React from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../core/theme';
import categoryIcons from '../constants/categoryIcons';

const BankTransactionsPopup = ({ visible, selectedOption, bankTransactions, setShowBankTransactionsPopup }) => {
    let previousTransactionDate = '';
    const transactionsByDate = [];

    const transactionRows = bankTransactions.map((transaction, index) => {
        const transactionDate = transaction.transactionDate;

        if (transactionDate !== previousTransactionDate) {
            previousTransactionDate = transactionDate;
            transactionsByDate.push({ date: transactionDate, transactions: [] });
        }

        transactionsByDate[transactionsByDate.length - 1].transactions.push(transaction);

        return null; // No need to return anything here
    });

    transactionsByDate.reverse();

    const getCategoryImage = (category) => {
        return categoryIcons[category.toLowerCase()] || require('../assets/default_img.jpg');
    };

    return (
        <Modal transparent={true} visible={visible} animationType='fade'>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    <TouchableOpacity
                        onPress={() => setShowBankTransactionsPopup(false)}
                        style={styles.closeIcon}
                    >
                        <Icon name="close" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle="white"
                    >
                        <Text style={styles.modalTitle}>All Transactions</Text>

                        {transactionsByDate.length > 0 ? (
                            transactionsByDate.map((dateGroup, index) => (
                                <View key={index} style={styles.dateSection}>

                                    <Text style={[styles.transactionDate, { color: theme.colors.secondary }]}>{dateGroup.date}</Text>

                                    {dateGroup.transactions.map((transaction, transactionIndex) => {
                                        const categoryImage = getCategoryImage(transaction.transactionCategory[0]);

                                        return (
                                            <View key={transactionIndex} style={styles.transactionRow}>

                                                <Image source={categoryImage} style={styles.transactionImage} />

                                                <View style={styles.transactionDetails}>
                                                    <Text style={[styles.defaultText, { maxWidth: '70%', justifyContent: 'flex-start', textAlign: 'left' }]}>{transaction.transactionTitle}</Text>
                                                    <Text style={[styles.defaultText, { color: transaction.transactionType === 'Income' ? '#80c582' : '#e57373' }]}>{transaction.transactionAmount}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.defaultText}>No transactions available</Text>
                        )}

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        position: "relative",
    },

    closeIcon: {
        position: "absolute",
        right: 10,
        top: 10,
        padding: 10,
        zIndex: 10,
    },

    scrollView: {
        width: '100%',
    },

    scrollContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        marginBottom: 10,
    },

    dateSection: {
        marginBottom: 20,
        width: '100%',
    },

    transactionDate: {
        fontSize: 16,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        marginBottom: 10,
    },

    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },

    transactionImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
    },

    transactionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
    },

    transactionTitle: {
        fontSize: 14,
        color: 'white',
    },

    transactionAmount: {
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
    },

    defaultText: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 15,
        color: 'white',
    },
});

export default BankTransactionsPopup;
