import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import DateSelector from '../components/DateSelector';
import FilterTag from '../components/FilterTag';
import ButtonSmall from '../components/ButtonSmall';
import PeriodSelectionPopup from '../components/PeriodSelectionPopup';

export default function CreateBudgetsScreen({ navigation }) {

    const [selectedBudgetType, setSelectedBudgetType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);


    const handleBudgetTypeOption = (type) => {
        setSelectedBudgetType(type);
    };

    const handleSelectCurrencyOption = (currency) => {
        setSelectedCurrency(currency);
    };

    return (
        <View style={styles.createBankScreen}>
            <InAppBackground>

                <BackButton goBack={() => navigation.goBack()} />

                <View style={styles.createBankDetailsContainer}>

                    <View style={styles.headerContainer}>
                        <Text style={[styles.defaultText, { fontSize: 40 }]}>[Bank Title]</Text>
                        <Text style={[styles.defaultText, { fontSize: 30 }]}>Starting at: $0</Text>
                    </View>

                    <View style={styles.bankTypeOptionsContainer}>
                        <Button
                            mode="outlined"
                            style={[
                                styles.button,
                                selectedBudgetType === 'Personal' ? styles.selectedButton : styles.button
                            ]}
                            onPress={() => handleBudgetTypeOption('Personal')}
                            labelStyle={selectedBudgetType === 'Personal' ? styles.selectedButtonText : styles.unselectedButtonText}
                        >
                            Personal
                        </Button>

                        <Button
                            mode="outlined"
                            style={[
                                styles.button,
                                selectedBudgetType === 'Family' ? styles.selectedButton : styles.button
                            ]}
                            onPress={() => handleBudgetTypeOption('Family')}
                            labelStyle={selectedBudgetType === 'Family' ? styles.selectedButtonText : styles.unselectedButtonText}
                        >
                            Family
                        </Button>
                    </View>

                    <View style={styles.bankCurrencyOptionsContainer}>

                        <Text style={[styles.defaultText, { fontSize: 20 }]}>Select Currency</Text>

                        <View style={styles.currencyContainer}>
                            {['USD', 'EUR', 'GBP', 'TTD', 'CAD', 'JPY'].map((currency) => (
                                <TouchableOpacity
                                    key={currency}
                                    style={[
                                        styles.currencyBox,
                                        selectedCurrency === currency
                                            ? styles.selectedCurrencyBox
                                            : styles.unselectedCurrencyBox,
                                    ]}
                                    onPress={() => handleSelectCurrencyOption(currency)}
                                >
                                    <Text
                                        style={[
                                            styles.currencyText,
                                            selectedCurrency === currency
                                                ? styles.selectedCurrencyText
                                                : styles.unselectedCurrencyText,
                                        ]}
                                    >
                                        {currency}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <ButtonSmall
                            label="View All Transactions"
                        // onPress={handleViewAllTransactions}
                        />
                    </View>


                    <View style={styles.bankThemeOptionsContainer}>

                        <View style={styles.themeContainer}>

                        </View>

                    </View>
                </View>
            </InAppBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    createBankScreen: {
        flex: 1,
    },

    createBankDetailsContainer: {
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 5,
        borderColor: theme.colors.primary,
    },

    bankTypeOptionsContainer: {
        width: '98%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 30,
    },

    button: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: 'transparent',
        borderColor: 'white',
    },

    selectedButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: theme.colors.primary,
        borderColor: 'none',
        borderColor: theme.colors.primary,
    },

    unselectedButtonText: {
        color: 'white',
    },

    selectedButtonText: {
        color: 'white',
    },

    bankCurrencyOptionsContainer: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },

    currencyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    currencyBox: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 2,
    },

    currencyText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    selectedCurrencyBox: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },

    unselectedCurrencyBox: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
    },

    selectedCurrencyText: {
        color: 'white',
    },

    unselectedCurrencyText: {
        color: theme.colors.primary,
    },


});