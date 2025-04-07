import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import ButtonSmall from '../components/ButtonSmall';
import BackButton from '../components/BackButton';
import CurrencySelectionPopUp from '../components/CurrencySelectionPopUp';
import Currencies from '../constants/currencies.json';
import Background from '../components/Background';
import { MaterialIcons } from '@expo/vector-icons'

const mainCurrencies = ['GBP', 'EUR', 'USD', 'TTD', 'JPY', 'CAD'];

export default function SetupPersonalCircleScreen({ navigation, route }) {

    const { selectedCircleType } = route.params;

    const [loading, setLoading] = useState(false);

    const [selectedBankTitle, setSelectedBankTitle] = useState('');
    const [selectedBankAmount, setSelectedBankAmount] = useState('');
    const [isPrimary, setIsPrimary] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
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

    const handleViewCurrenciesPopup = () => {
        setShowCurrencyPopup(true);
    }

    const setActiveCircle = async (circleID) => {
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                console.error('No Token Found');
                return;
            }

            const response = await fetch('https://ffm-application-main.onrender.com/active-circle', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    circleID
                })
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Active Circle Set Successfully:', responseData);
                return true;
            } else {
                Alert.alert('Error', responseData.message || 'Failed To Set Active Circle');
                return false;
            }

        } catch (error) {
            console.error('Error setting active circle:', error);
            Alert.alert('Error', 'Something went wrong while setting the active circle.');
            return false;
        }
    };

    const handleCreateCircle = async () => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return null;
        }

        const circleName = await AsyncStorage.getItem('user_name');
        const circleColor = theme.colors.primary;
        const circleImage = '../assets/default_profile_image.png';

        if (!circleName || !circleColor || !circleImage || !selectedCircleType) {
            Alert.alert('Error', 'Missing required information for circle creation.');
            return null;
        }

        try {
            const response = await fetch('https://ffm-application-main.onrender.com/create-circle', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    circleName: circleName.trim(),
                    circleColor,
                    circleImage,
                    circleType: selectedCircleType,
                    userIDs: []
                })
            });

            const responseData = await response.json();

            console.log('Create Circle Response:', responseData);

            if (response.ok) {
                const createdCircleID = responseData.circleID;
                const setActiveSuccess = await setActiveCircle(createdCircleID);
                if (setActiveSuccess) {
                    console.log('Active Circle Set:', createdCircleID);
                    return true;
                } else {
                    return false;
                }
            } else {
                Alert.alert('Error', responseData.message || 'Failed To Create Circle');
                return false;
            }

        } catch (error) {
            console.error('Error creating circle:', error);
            Alert.alert('Error', 'Something went wrong during circle creation. Please try again later.');
            return false;
        }
    };

    const handleAddBank = async ({ bankTitle = 'My Wallet', bankAmount = '0', bankCurrency = null, skip = false }) => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return false;
        }

        const finalBankTitle = (bankTitle || '').trim() || 'My Wallet';
        const finalBankAmount = parseFloat(bankAmount || '0');
        const finalBankCurrencyCode = bankCurrency?.code || 'TTD';

        if (!skip && !finalBankTitle) {
            Alert.alert('Error', 'Please provide a wallet title.');
            return false;
        }

        if (!skip && !finalBankCurrencyCode) {
            Alert.alert('Error', 'Please select a currency.');
            return false;
        }

        try {
            const response = await fetch('https://ffm-application-main.onrender.com/create-bank', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bankTitle: finalBankTitle,
                    bankCurrency: finalBankCurrencyCode,
                    bankAmount: finalBankAmount,
                    isPrimary: isPrimary,
                    userIDs: []
                })
            });

            const responseData = await response.json();

            console.log('Create Bank Response:', responseData);

            if (response.ok) {
                Alert.alert('Success', 'Wallet Added Successfully');
                return true;
            } else {
                Alert.alert('Error', responseData.message || 'Failed To Add Wallet');
                return false;
            }

        } catch (error) {
            console.error('Error adding bank:', error);
            Alert.alert('Error', 'Something went wrong while adding the wallet. Please try again later.');
            return false;
        }
    };


    const handleRegistrationComplete = async () => {
        setLoading(true);
        let circleCreated = false;
        let bankAdded = false;

        try {
            circleCreated = await handleCreateCircle();

            if (circleCreated) {
                bankAdded = await handleAddBank({
                    bankTitle: selectedBankTitle,
                    bankAmount: selectedBankAmount,
                    bankCurrency: selectedCurrency,
                    skip: false
                });
            }

            if (circleCreated && bankAdded) {
                navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
            } else {
                Alert.alert('Setup Incomplete', 'Could not complete the setup process. Please check the details and try again.');
            }

        } catch (error) {
            console.error('Registration Completion Error:', error);
            Alert.alert('Error', 'Something went wrong during setup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistrationCompleteWithDefaultBank = async () => {
        setLoading(true);
        let circleCreated = false;
        let bankAdded = false;

        try {
            circleCreated = await handleCreateCircle();

            if (circleCreated) {
                bankAdded = await handleAddBank({ skip: true });
            }

            if (circleCreated && bankAdded) {
                navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
            } else {
                Alert.alert('Setup Incomplete', 'Could not complete the setup process. Please try again.');
            }

        } catch (error) {
            console.error('Registration Completion Error (No Bank):', error);
            Alert.alert('Error', 'Something went wrong during setup. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setLoading(true);
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

        const defaultCurrency = formattedCurrencies.find(c => c.code === 'TTD');
        if (defaultCurrency) {
            setSelectedCurrency(defaultCurrency);
        }

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
                    isSelected
                        ? styles.selectedCurrencyBox
                        : styles.unselectedCurrencyBox,
                ]}
                onPress={() => handleSelectCurrencyOption(currency)}
            >
                <Text
                    style={[
                        styles.currencyText,
                        isSelected
                            ? styles.selectedCurrencyText
                            : styles.unselectedCurrencyText,
                    ]}
                >
                    {currency.code}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        isSelected
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
                        isSelected
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

                    <BackButton goBack={navigation.goBack} />

                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 }}>

                        <View style={styles.walletContainer}>
                            <Image
                                source={require('../assets/wallet_icon.png')}
                                style={styles.walletImage}
                            />
                        </View>


                        <Button
                            mode="text"
                            onPress={handleRegistrationCompleteWithDefaultBank}
                            loading={loading}
                            style={styles.skipButton}
                            labelStyle={styles.skipText}
                            disabled={loading}
                        >
                            Skip
                        </Button>

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
                            placeholderTextColor="rgba(255, 255, 255, 0.38)"
                            placeholder="Wallet Title"
                            value={selectedBankTitle}
                            onChangeText={handleBankTitleChange}
                            style={[styles.input, styles.defaultText, { alignSelf: 'center', fontSize: 30 }]}
                        />

                        <View style={styles.inputAmountContainer}>
                            <Text style={[styles.defaultText, { fontSize: 30 }]}>Starting at: </Text>
                            <TextInput
                                placeholderTextColor="rgba(255, 255, 255, 0.38)"
                                placeholder={`${selectedCurrency?.symbol || '$'}0.00`}
                                value={selectedBankAmount}
                                onChangeText={handleBankAmountChange}
                                style={[styles.input, styles.shortInput, styles.defaultText]}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.bankCurrencyOptionsContainer}>


                        <Text style={[styles.defaultText, { fontSize: 20, }]}>Select Currency ({selectedCurrency?.code || '...'} )</Text>

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
                                onPress={handleRegistrationComplete}
                                loading={loading}
                                disabled={loading || !selectedCurrency}
                            >
                                Create Wallet
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
        paddingBottom: 20,
    },

    defaultText: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        color: theme.colors.description,
    },

    walletContainer: {
        backgroundColor: theme.colors.secondary,
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
    },

    walletImage: {
        width: 60,
        height: 60,
    },

    skipButton: {
        position: 'absolute',
        top: 25,
        right: 5,
        width: 'auto',
        backgroundColor: theme.colors.primary,
        elevation: 0,
    },

    skipText: {
        color: 'white',
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
    },

    headerContainer: {
        width: '100%',
        paddingBottom: 10,
        borderBottomWidth: 5,
    },

    inputAmountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'baseline',
        gap: 5,
    },

    input: {
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.description,
        fontSize: 25,
        paddingVertical: 8,
        marginBottom: 20,
        color: theme.colors.description,
        borderWidth: 0,
        textAlign: 'center',
    },

    shortInput: {
        minWidth: 120,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: theme.colors.description,
        paddingVertical: 4,
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
        borderColor: theme.colors.description,
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
        justifyContent: 'space-around',
        maxWidth: '100%',
        flexShrink: 1,
        overflow: 'hidden',
        flexWrap: 'wrap',
        marginTop: 5,
    },

    currencyBox: {
        width: 100,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
        borderWidth: 2,
        padding: 5,
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
        color: '#FFFFFF',
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