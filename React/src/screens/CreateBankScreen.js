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
import ButtonSmall from '../components/ButtonSmall';
import CurrencySelectionPopUp from '../components/CurrencySelectionPopUp';

// Importing currency data for now until API is set up. (Rynnia.R)
import Currencies from '../constants/currencies.json';

// Main currencies to display first (6)
const mainCurrencies = ['USD', 'EUR', 'TTD', 'CAD', 'AUD', 'JPY'];

// Defining colors for bank theme selection. This could be extracted to a separate file. (Rynnia.R)
const THEMES = [
    '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#8D33FF',
    '#FFAA33', '#33FFF5', '#9933FF', '#FF3366', '#33FF99', '#FF8833',
    '#0033FF', '#77FF33', '#FF0033', '#33AAFF', '#BB33FF', '#FF7733'
];

export default function CreateBudgetsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);

    //Bank Details
    const [selectedBankTitle, setSelectedBankTitle] = useState(null);
    const [selectedBankAmount, setSelectedBankAmount] = useState(null);
    const [selectedBudgetType, setSelectedBudgetType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);

    //Currency Data & Popup 
    const [currencyData, setCurrencyData] = useState([]);
    const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);

    const handleBankTitleChange = (title) => {
        setSelectedBankTitle(title);
    }

    const handleBankAmountChange = (amount) => {
        setSelectedBankAmount(amount);
    }

    const handleBudgetTypeOption = (type) => {
        setSelectedBudgetType(type);
    };

    const handleSelectCurrencyOption = (currency) => {
        setSelectedCurrency(currency);
    };

    const handleViewCurrenciesPopup = () => {
        setShowCurrencyPopup(true);
    }

    const handleAddBank = () => {
        if (selectedBankTitle && selectedBankAmount && selectedBudgetType && selectedCurrency) {
            Alert.alert("Error", "Please fill in all the fields.");
        }

        Alert.alert('Success', 'Bank added successfully!');
    }

    useEffect(() => {
        const formattedCurrencies = Object.entries(Currencies).map(([code, currency], index) => {
            return {
                id: index + 1,
                code: currency.code,
                symbol: currency.symbol,
                name: currency.name,
                decimal_digits: currency.decimal_digits,
                name_plural: currency.name_plural,
            };
        });

        setCurrencyData(formattedCurrencies);
        setLoading(false);
    }, []);


    // Filtering out the main currencies based on `mainCurrencies` constant
    const mainCurrenciesList = currencyData.filter(currency =>
        mainCurrencies.includes(currency.code)
    );

    const renderCurrencyItem = (currency) => {
        return (
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
                    {currency.code}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        selectedCurrency === currency
                            ? styles.selectedCurrencyText
                            : styles.unselectedCurrencyText,
                    ]}
                >
                    {currency.symbol}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.createBankScreen}>
            <InAppBackground>

                <BackButton goBack={navigation.goBack} />

                {showCurrencyPopup && (
                    <CurrencySelectionPopUp
                        currencyData={currencyData}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        setShowCurrenciesPopup={setShowCurrencyPopup}
                    />
                )}

                <View style={styles.createBankDetailsContainer}>

                    <View style={styles.headerContainer}>
                        <TextInput
                            placeholderTextColor="rgba(255, 255, 255, 0.25)"
                            placeholder="Bank Title"
                            value={selectedBankTitle}
                            onChangeText={handleBankTitleChange}
                            style={[styles.input, styles.defaultText, { alignSelf: 'center', fontSize: 30 }]}
                        />

                        <View style={styles.inputAmountContainer}>
                            <Text style={[styles.defaultText, { fontSize: 30 }]}>Starting at: </Text>
                            <TextInput
                                placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                placeholder="$0.00"
                                value={selectedBankAmount}
                                onChangeText={handleBankAmountChange}
                                style={[styles.input, styles.shortInput, styles.defaultText]}
                                keyboardType="numeric"
                            />
                        </View>
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

                        <Text style={[styles.defaultText, { fontSize: 20, }]}>Select Currency: </Text>

                        <View style={styles.currencyContainer}>
                            {mainCurrenciesList.map((currency) => (
                                <View key={currency.code}>
                                    {renderCurrencyItem(currency)}
                                </View>
                            ))}

                            {/* {['USD', 'EUR', 'GBP', 'TTD', 'CAD', 'JPY'].map((currency) => (
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
                            ))} */}
                        </View>

                        <View>
                            <ButtonSmall
                                label="View All Currencies"
                                style={{ alignSelf: 'center', width: 180, marginTop: 10, paddingVertical: 5 }}
                                onPress={handleViewCurrenciesPopup}
                            />
                        </View>
                    </View>


                    <View style={styles.bankThemeOptionsContainer}>

                        <Text style={[styles.defaultText, { fontSize: 20 }]}>Select Theme</Text>

                        <View style={styles.themeContainer}>
                            <FlatList
                                data={THEMES}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.circle,
                                            { backgroundColor: item },
                                            selectedTheme === item && styles.selectedCircle,
                                        ]}
                                        onPress={() => setSelectedTheme(item)}
                                    />
                                )}
                            />

                        </View>

                        <Button
                            style={{ marginTop: 20, width: 250 }}
                            onPress={handleAddBank}
                        >
                            <Text style={{ color: 'black' }}>Add Bank</Text>
                        </Button>

                    </View>
                </View>
            </InAppBackground >
        </View >
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
        maxHeight: '100%',
        overflow: 'hidden',
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
        paddingBottom: 10,
        borderBottomWidth: 5,
        borderColor: theme.colors.primary,
    },

    inputAmountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 15,
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

    shortInput: {
        width: 80,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
    },

    bankTypeOptionsContainer: {
        width: '98%',
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
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
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 10,
    },

    currencyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
        flexShrink: 1,
        overflow: 'hidden',
        flexWrap: 'wrap',
    },

    currencyBox: {
        width: 100,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 2,
    },

    currencyText: {
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
    },

    selectedCurrencyBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

    bankThemeOptionsContainer: {
        width: '90%',
        marginTop: 10,
    },

    themeContainer: {
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 10,
        borderWidth: 3,
        borderColor: 'transparent',
    },

    selectedCircle: {
        borderColor: 'white',
    },

});