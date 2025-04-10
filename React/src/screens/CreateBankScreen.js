import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import Toggle from '../components/Toggle';
import CurrencySelectionPopUp from '../components/CurrencySelectionPopUp';
import Currencies from '../constants/currencies.json';
import Colors from '../constants/colors.json';
import ColorTray from '../components/ColorTray';
import { ScrollView } from 'react-native-gesture-handler';

const mainCurrencies = ['GBP', 'EUR', 'USD', 'TTD', 'JPY', 'CAD'];
const colorData = Object.values(Colors);

export default function CreateBudgetsScreen({ navigation, route }) {
    const [loading, setLoading] = useState(true);
    const { newUserSelectedCircleType } = route.params || {};

    const bankTitleRef = useRef(null);
    const bankAmountRef = useRef(null);

    const [selectedBankTitle, setSelectedBankTitle] = useState('');
    const [selectedBankAmount, setSelectedBankAmount] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4A90E2');


    const [currencyData, setCurrencyData] = useState([]);
    const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleBankTitleChange = (title) => {
        setSelectedBankTitle(title);
    }

    const handleBankAmountChange = (amount) => {
        setSelectedBankAmount(amount);
    }

    const handleSelectCurrencyOption = (currency) => {
        setSelectedCurrency(currency);
        setShowCurrencyPopup(false);
    };

    const handleToggleChange = (value) => {
        setIsPrimary(value);
    };

    const handleViewCurrenciesPopup = () => {
        setShowCurrencyPopup(true);
    }

    const getButtonText = () => {
        if (!selectedBankTitle) return "Set Title";
        if (!selectedBankAmount) return "Set Amount";
        if (!selectedCurrency) return "Select Currency";
        return "Add Bank";
    };

    const handlePress = () => {
        if (!selectedBankTitle) {
            bankTitleRef.current?.focus();
            return;
        }
        if (!selectedBankAmount) {
            bankAmountRef.current?.focus();
            return;
        }
        if (!selectedCurrency) {
            Alert.alert('Missing Field', 'Please select a currency.');
            return;
        }
        createBank();
    };


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

            if (response.ok) {
                const activeCircleID = data.activeCircle.circleID;
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

    const createBank = async () => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return;
        }


        if (!selectedBankTitle || !selectedBankAmount || !selectedCurrency) {
            Alert.alert('Error', 'Please Ensure All Fields Are Filled.');
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
                    color: selectedColor,
                    userIDs: userIDs,
                })
            });

            const data = await response.json();
            if (response.ok && data.status === 'success') {
                if (newUserSelectedCircleType === null) {
                    // If newUserSelectedCircleType is NULL, Proceed as usual - Already Registered Users
                    Alert.alert('Success', 'Bank Added Successfully');
                    navigation.goBack();
                } else {
                    // If newUserSelectedCircleType is NOT null - New Users
                    Alert.alert('Success', 'Bank Added Successfully');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }
            } else {
                Alert.alert('Error', data.message || 'Failed To Add Bank');

            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
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
        const isSelected = selectedCurrency?.code === currency.code;
        return (
            <TouchableOpacity
                key={currency.code}
                style={[
                    styles.currencyBox,
                    isSelected ? styles.selectedCurrencyBox : styles.unselectedCurrencyBox,
                ]}
                onPress={() => handleSelectCurrencyOption(currency)}
            >
                <Text
                    style={[
                        styles.currencyText,
                        isSelected ? styles.selectedCurrencyText : styles.unselectedCurrencyText,
                    ]}
                >
                    {currency.code}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        isSelected ? styles.selectedCurrencyText : styles.unselectedCurrencyText,
                        { fontSize: 15, textAlign: 'center', marginBottom: 5 },
                    ]}
                >
                    {currency.symbol}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        isSelected ? styles.selectedCurrencyText : styles.unselectedCurrencyText,
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
            <InAppBackground>

                <BackButton goBack={navigation.goBack} />

                {showCurrencyPopup && (
                    <CurrencySelectionPopUp
                        currencyData={currencyData}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={handleSelectCurrencyOption}
                        setShowCurrenciesPopup={setShowCurrencyPopup}
                    />
                )}

                <View style={styles.createBankDetailsContainer}>


                    <View 
                        style={[
                        styles.headerContainer,
                        { borderColor: selectedColor || theme.colors.primary }
                    ]}>
                        <TextInput
                            ref={bankTitleRef}
                            placeholderTextColor="rgba(255, 255, 255, 0.25)"
                            placeholder="Wallet Title"
                            value={selectedBankTitle}
                            onChangeText={handleBankTitleChange}
                            style={[styles.input, styles.defaultText, { alignSelf: 'center', fontSize: 30 }]}
                        />

                        <View style={styles.inputAmountContainer}>
                            <Text style={[styles.defaultText, { fontSize: 30 }]}>Starting at: </Text>
                            <TextInput
                                ref={bankAmountRef}
                                placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                placeholder={`${selectedCurrency?.symbol || '$'}0.00`}
                                value={selectedBankAmount}
                                onChangeText={handleBankAmountChange}
                                style={[styles.input, styles.shortInput, styles.defaultText]}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.bankCurrencyOptionsContainer}>


                        <Text style={[styles.defaultText, { fontSize: 20, }]}>Select Currency {selectedCurrency ? `( ${selectedCurrency.code} )` : ''}</Text>

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
                    </View>

                    <View style={styles.bankTypeOptionsContainer}>
                        <View style={styles.optionContainer}>
                            <Text style={[styles.defaultText, { fontSize: 18 }]}>Primary Bank :
                            </Text>
                            <View style={styles.toggleContainer}>
                                <Toggle
                                    isPrimary={isPrimary}
                                    onToggleChange={handleToggleChange}
                                />
                            </View>
                        </View>
                    </View>


                    <View style={styles.bankThemeOptionsContainer}>
                        <View style={styles.buttonContainer}>
                            <ColorTray
                                selectedColor={selectedColor}
                                onColorSelect={handleColorSelect}
                            />
                        </View>

                        <Button mode="contained" onPress={handlePress} style={styles.buttonStyle}>
                            {getButtonText()}
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

    buttonContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        padding: 0,
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
        marginTop: 20,
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
        borderBottomColor: '#fff',
        fontSize: 25,
        paddingVertical: 8,
        marginBottom: 20,
        color: '#fff',
        borderWidth: 0,
        textAlign: 'center',
    },

    shortInput: {
        width: 120,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
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