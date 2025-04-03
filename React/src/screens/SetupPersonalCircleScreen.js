import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import ButtonSmall from '../components/ButtonSmall';
import CurrencySelectionPopUp from '../components/CurrencySelectionPopUp';
import Currencies from '../constants/currencies.json';
import Colors from '../constants/colors.json';
import Background from '../components/Background';

const mainCurrencies = ['GBP', 'EUR', 'USD', 'TTD', 'JPY', 'CAD'];
const colorData = Object.values(Colors);

export default function SetupPersonalCircleScreen({ navigation }) {
    const [loading, setLoading] = useState(true);

    const [selectedBankTitle, setSelectedBankTitle] = useState(null);
    const [selectedBankAmount, setSelectedBankAmount] = useState(null);
    const [isPrimary, setIsPrimary] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');

    const [currencyData, setCurrencyData] = useState([]);
    const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);

    const handleBankTitleChange = (title) => {
        setSelectedBankTitle(title);
    }

    const handleBankAmountChange = (amount) => {
        setSelectedBankAmount(amount);
    }

    const handleSelectCurrencyOption = (currency) => {
        setSelectedCurrency(currency);
    };

    console.log('Is Primary:', isPrimary);

    const handleViewCurrenciesPopup = () => {
        setShowCurrencyPopup(true);
    }


    const fetchActiveCircle = async () => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return null;
        }

        try {
            const response = await fetch('https://ffm-application-main.onrender.com/active-circle', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log('Raw Response:', data);

            if (response.ok) {
                const activeCircleID = data.activeCircle.circleID;
                console.log('Active Circle ID:', activeCircleID);
                return activeCircleID;
            } else {
                console.error('Error fetching active circle:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching active circle:', error);
            return null;
        }
    };

    const fetchCircleUsers = async (circleID) => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return [];
        }

        try {
            const response = await fetch(`https://ffm-application-main.onrender.com/circle/${circleID}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                const userIds = data.users.map(user => user.id);
                return userIds;
            } else {
                console.error('Error fetching circle users:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching circle users:', error);
            return [];
        }
    };

    const handleAddBank = async () => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return;
        }

        if (!selectedBankTitle || !selectedBankAmount || !selectedCurrency) {
            Alert.alert('Error', 'Please Fill In All Fields');
            return;
        }

        try {

            const circleID = await fetchActiveCircle();
            if (!circleID) {
                Alert.alert('Error', 'No active circle found.');
                return;
            }

            const userIDs = await fetchCircleUsers(circleID);

            const response = await fetch('https://ffm-application-main.onrender.com/create-bank', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bankTitle: selectedBankTitle.trim(),
                    bankCurrency: selectedCurrency.code,
                    bankAmount: parseFloat(selectedBankAmount),
                    isPrimary: isPrimary,
                    userIDs: userIDs
                })
            });

            const responseData = await response.json();

            console.log('Response Data:', responseData);

            if (response.ok) {
                Alert.alert('Success', 'Bank Added Successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed To Add Bank');
                navigation.goBack();
            }

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };


    useEffect(() => {
        const formattedCurrencies = Object.entries(Currencies).map(([code, currency], index) => {
            return {
                id: index,
                code: currency.code,
                symbol: currency.symbol_native,
                name: currency.name,
                decimal_digits: currency.decimal_digits,
                name_plural: currency.name_plural,
            };
        });

        setCurrencyData(formattedCurrencies);
        setLoading(false);
    }, []);


    const mainCurrenciesList = currencyData.filter(currency =>
        mainCurrencies.includes(currency.code)
    );

    const renderCurrencyItem = (currency) => {
        return (
            <TouchableOpacity
                key={currency}
                style={[
                    styles.currencyBox,
                    selectedCurrency?.code === currency.code
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
                        { fontSize: 15, textAlign: 'center', marginBottom: 5 },
                    ]}
                >
                    {currency.symbol}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        selectedCurrency === currency
                            ? styles.selectedCurrencyText
                            : styles.unselectedCurrencyText,
                        { fontSize: 8, textAlign: 'center' },
                    ]}
                >
                    {currency.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.createBankScreen}>

            {showCurrencyPopup && (
                <CurrencySelectionPopUp
                    currencyData={currencyData}
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency}
                    setShowCurrenciesPopup={setShowCurrencyPopup}
                />
            )}

            <Background>

                <View style={styles.createBankDetailsContainer}>

                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 }}>
                        <Image
                            source={require('../assets/wallet_icon.png')}
                            style={styles.walletImage}
                        />

                        <Header style={{ fontSize: 40, textAlign: 'center', flexWrap: 'wrap', maxWidth: '100%' }}>
                            Create Your Wallet
                        </Header>

                        <Paragraph>
                            Your wallet helps you track your money. Simply name it and choose a currency
                        </Paragraph>
                    </View>

                    <View style={[
                        styles.headerContainer,
                        selectedTheme ? { borderColor: selectedTheme.hex } : { borderColor: theme.colors.primary }
                    ]}>
                        <TextInput
                            placeholderTextColor="#333333"
                            placeholder="Wallet Title"
                            value={selectedBankTitle}
                            onChangeText={handleBankTitleChange}
                            style={[styles.input, styles.defaultText, { alignSelf: 'center', fontSize: 30 }]}
                        />

                        <View style={styles.inputAmountContainer}>
                            <Text style={[styles.defaultText, { fontSize: 30 }]}>Starting at: </Text>
                            <TextInput
                                placeholderTextColor="#333333"
                                placeholder={`${selectedCurrency?.symbol || '$'}0.00`}
                                value={selectedBankAmount}
                                onChangeText={handleBankAmountChange}
                                style={[styles.input, styles.shortInput, styles.defaultText]}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.bankCurrencyOptionsContainer}>


                        <Text style={[styles.defaultText, { fontSize: 20, }]}>Select Currency ( {selectedCurrency.code} )</Text>

                        <View style={styles.currencyContainer}>
                            {mainCurrenciesList.map((currency) => (
                                <View key={currency.code}>
                                    {renderCurrencyItem(currency)}
                                </View>
                            ))}
                        </View>

                        <View>
                            <ButtonSmall
                                label="View All Currencies"
                                style={{ alignSelf: 'center', width: 180, marginTop: 10, paddingVertical: 5 }}
                                onPress={handleViewCurrenciesPopup}
                            />
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Paragraph style={{ fontFamily: theme.fonts.bold.fontFamily }}>
                                You can always edit this later
                            </Paragraph>
                        </View>

                        <View style={{ alignSelf: 'center', width: 280, marginTop: 10 }}>
                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate('StartScreen')}
                            >
                                Activate
                            </Button>
                        </View>

                    </View>
                </View>

            </Background>
        </View >
    );
}

const styles = StyleSheet.create({
    createBankScreen: {
        flex: 1,
    },

    createBankDetailsContainer: {
        flex: 1,
        maxHeight: '100%',
        maxWidth: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
    },

    walletImage: {
        width: 100,
        height: 100,
        margin: 0,
        padding: 0,
    },

    defaultText: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        color: '#333333',
    },

    headerContainer: {
        width: '100%',
        paddingBottom: 10,
        borderBottomWidth: 5,
    },

    inputAmountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 15,
    },

    input: {
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: '#333333',
        fontSize: 25,
        paddingVertical: 8,
        marginBottom: 20,
        color: '#333333',
        borderWidth: 0,
        textAlign: 'center',
    },

    shortInput: {
        width: 120,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#333333',
    },

    bankTypeOptionsContainer: {
        width: '98%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 30,
        marginTop: 20,
    },

    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10,
    },

    toggleContainer: {
        marginTop: 5,
        marginLeft: 10,
    },

    button: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: 'transparent',
        borderColor: '#333333',
    },

    selectedButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: theme.colors.primary,
        borderColor: 'none',
        borderColor: theme.colors.primary,
    },

    unselectedButtonText: {
        color: '#333333',
    },

    selectedButtonText: {
        color: '#333333',
    },

    bankCurrencyOptionsContainer: {
        width: '90%',
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
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },

    unselectedCurrencyBox: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
    },

    selectedCurrencyText: {
        color: '#333333',
    },

    unselectedCurrencyText: {
        color: theme.colors.primary,
    },

    bankThemeOptionsContainer: {
        width: '90%',
        marginTop: 10,
    },

    themeContainer: {
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
        borderColor: '#333333',
    },

});