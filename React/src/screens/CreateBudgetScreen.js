import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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

const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [year, month, day] = date.split("-");
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

// Function to calculate the end date based on selected period
const calculateEndDate = (startDate, duration, selectedPeriod) => {
    const periodsInDays = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365
    };

    if (!startDate || !duration || !selectedPeriod) {
        console.error("Missing required parameters.");
        return null;
    }

    const start = new Date(startDate);

    if (isNaN(start.getTime())) {
        console.error("Invalid start date.");
        return null;
    }

    const periodInDays = periodsInDays[selectedPeriod.toLowerCase()];
    if (typeof periodInDays === 'undefined') {
        console.error("Invalid selected period.");
        return null;
    }

    if (isNaN(duration)) {
        console.error("Invalid duration");
        return null;
    }

    const daysToAdd = duration * periodInDays;

    start.setDate(start.getDate() + daysToAdd);

    const formattedEndDate = start.toISOString().split('T')[0];  // Format to YYYY-MM-DD
    return formattedEndDate;
};

export default function CreateBudgetsScreen({ navigation }) {
    // Fallback to default categories if categories is empty or undefined
    // const categoryData = Array.isArray(categories) && categories.length > 0 ? categories : defaultCategories;

    //Budget Details
    const [budgetTitle, setBudgetTitle] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetType, setBudgetType] = useState('');
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [selectedBankID, setSelectedBankID] = useState(null);
    const [categories, setCategories] = useState([]);
    const [duration, setDuration] = useState(''); // To help with calclation of end date

    //Pop-up Triggers
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [showPeriodPopup, setShowPeriodPopup] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [budgetScope, setBudgetScope] = useState('Inclusive');

    const categoryImages = {
        bills: require('../assets/icons/bills.png'),
        entertainment: require('../assets/icons/entertainment.png'),
        groceries: require('../assets/icons/groceries.png'),
        income: require('../assets/icons/income.png'),
        shopping: require('../assets/icons/shopping.png'),
        transit: require('../assets/icons/transit.png')
      };

    useEffect(() => {
        fetch('https://ffm-application-main.onrender.com/ffm/categories')
            .then(response => response.json())
            .then(data => {

                if (!data || !data.categories || typeof data.categories !== 'object') {
                    console.error("Invalid data format:", data);
                    return;
                }

                const categoryArray = Object.entries(data.categories).map(([key, value], index) => {
                    if (typeof value !== 'string') {
                        console.error(`Unexpected value for ${key}:`, value);
                        value = "Unknown"; // Fallback
                    }

                    const categoryName = value.toLowerCase();
                    return {
                        id: index + 1,
                        name: value,
                        image: categoryImages[categoryName] || require('../assets/default_img.jpg') // FallBack
                    };
                });
                setCategories(categoryArray);
            })
            .catch(error => console.error('Error Fetching categories:', error));
    }, []);

    useEffect(() => {
        if (startDate && duration && selectedPeriod) {
            const newEndDate = calculateEndDate(startDate, duration, selectedPeriod);
            setEndDate(newEndDate);
        }
    }, [startDate, duration, selectedPeriod]);

    const displayPeriodSelected = (period) => {
        let formattedPeriod = period;
        if (period === 'Daily') formattedPeriod = 'Day(s)';
        if (period === 'Weekly') formattedPeriod = 'Week(s)';
        if (period === 'Monthly') formattedPeriod = 'Month(s)';
        if (period === 'Yearly') formattedPeriod = 'Year(s)';
        return formattedPeriod;
    };

    const displayBudgetPeriod = () => {
        if (!startDate || !endDate) return '--';

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        return `${formattedStart} - ${formattedEnd}`;
    };

    const handleCategorySelect = (item) => {
        const isAlreadySelected = budgetCategories.includes(item.name);
    
        if (isAlreadySelected) {
            setBudgetCategories(prevCategories => 
                prevCategories.filter(category => category !== item.name)
            );
        } else {
            const capitalizedCategory = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            setBudgetCategories(prevCategories => [
                ...prevCategories, 
                capitalizedCategory
            ]);
        }
    };

    const handleAmountChange = (value) => {
        setBudgetAmount(value);
    };

    const handlePeriodFocus = () => {
        setShowPeriodPopup(true);
    };

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleDateSave = (date) => {
        setStartDate(date);
        setShowDatePicker(false);
    };

    const handleDateCancel = () => {
        setShowDatePicker(false);
    };

    const renderBankCard = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.bankCard,
                selectedBankID === item.bankID && styles.selectedCard
            ]}
            onPress={() => {
                setSelectedBankID(item.bankID);
            }}
        >
            <Text style={styles.bankCardTitle}>{item.bankTitle}</Text>
            <Text style={styles.bankCardAmount}>
                 <Text style={styles.remainingBankCardAmount}>{item.remainingBankAmount} /</Text> {item.bankAmount}
            </Text>
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item }) => {
        const isSelected = budgetCategories.includes(item.name);

        return (
            <TouchableOpacity
                style={[
                    { margin: 10, alignItems: 'center', padding: 5 },
                    isSelected && { borderWidth: 2, borderColor: theme.colors.primary, borderRadius: 10 }
                ]}
                onPress={() => handleCategorySelect(item)}
            >
                <Image source={item.image} style={{ width: 30, height: 30 }} />
                <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.bold.fontFamily }}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const createBudget = async () => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return;
        }

        if (!budgetTitle || !startDate || !endDate || !budgetScope) {
            Alert.alert('Error', 'Please Fill In All Fields');
            return;
        }

        try {
            const response = await fetch(`https://ffm-application-main.onrender.com/create-budget`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bankID: selectedBankID,
                    budgetTitle: budgetTitle.trim(),
                    budgetAmount: budgetAmount,
                    budgetType: budgetType.toUpperCase(),
                    budgetCategory: budgetCategories,
                    transactionScope: budgetScope.toUpperCase(),
                    startDate: startDate,
                    endDate: endDate,
                })
            });

            console.log(budgetCategories)

            if (response.ok) {
                Alert.alert('Success', 'Budget Created Successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed To Create Budget');
                console.error(response.statusText);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
        }
    };

    const fetchBanks = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("access_token");

          if (!token) {
            console.error('No Token Found');
            return;
          }
    
          const response = await fetch('https://ffm-application-main.onrender.com/banks', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (response.ok) {
            setBanks(data.banks);
          } else {
            console.error(data.message);
          }
          console.log('Fetch Budgets Status:', data.status)
        } catch (error) {
          console.error("Error Fetching Banks:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useFocusEffect(
        useCallback(() => {
          fetchBanks();
        }, [])
      );

      return (
        <View style={styles.createBudgetScreen}>
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
    
                {showPeriodPopup && (
                    <PeriodSelectionPopup
                        setShowPeriodPopup={setShowPeriodPopup}
                        setSelectedPeriod={setSelectedPeriod}
                    />
                )}
    
                {showDatePicker && (
                    <DateSelector
                        showDatePicker={showDatePicker}
                        onSave={handleDateSave}
                        onCancel={handleDateCancel}
                    />
                )}
    
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                    <View style={styles.screenContainer}>
                        <View style={styles.headerContainer}>
                            <View style={styles.cardTitle}>
                                <InAppHeader>New Budget</InAppHeader>
                            </View>
                        </View>
    
                        <View style={styles.card}>
                            <View style={styles.cardTopHalfContainer}>
                                <TextInput
                                    placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                    placeholder="Enter Title"
                                    value={budgetTitle}
                                    onChangeText={setBudgetTitle}
                                    style={[styles.input, styles.defaultText, isFocused ? styles.focused : null]}
                                />
    
                                <View style={styles.budgetAmountContainer}>
                                    <TextInput
                                        placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                        placeholder="$0.00"
                                        value={budgetAmount}
                                        onChangeText={handleAmountChange}
                                        style={[styles.input, styles.shortInput, styles.defaultText]}
                                        keyboardType="numeric"
                                    />
    
                                    <Text style={styles.slashText}>/</Text>
    
                                    <TextInput
                                        placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                        placeholder="0"
                                        value={duration}
                                        onChangeText={setDuration}
                                        style={[styles.input, styles.shortInput, styles.defaultText]}
                                        keyboardType="numeric"
                                    />
    
                                    <Text style={styles.slashText}>/</Text>
    
                                    <TouchableOpacity onPress={handlePeriodFocus}>
                                        <Text
                                            style={[
                                                selectedPeriod
                                                    ? { ...styles.selectedPeriod, color: '#fff' }
                                                    : styles.selectedPeriod,
                                            ]}
                                        >
                                            {displayPeriodSelected(selectedPeriod) || 'Period'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
    
                                <Text style={styles.defaultText}>Starting:</Text>
    
                                <ButtonSmall
                                    label={
                                        startDate
                                            ? `${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`
                                            : 'Select Date'
                                    }
                                    onPress={handleShowDatePicker}
                                    mode="contained"
                                    style={styles.dateButton}
                                />
    
                                <Text style={[styles.defaultText, { marginTop: 35 }]}>Budget Period</Text>
                                <Text style={[styles.defaultText, { fontSize: 16, color: theme.colors.primary }]}>
                                    {displayBudgetPeriod()}
                                </Text>
                            </View>
    
                            {/* Filter Tags - Budget Type */}
                            <View style={styles.filterTagsContainer}>
                                <FilterTag
                                    label="Savings"
                                    isSelected={budgetType === 'Savings'}
                                    onPress={() => setBudgetType('Savings')}
                                />
                                <FilterTag
                                    label="Expense"
                                    isSelected={budgetType === 'Expense'}
                                    onPress={() => setBudgetType('Expense')}
                                />
                            </View>
    
                            {/* Filter Tags - Budget Scope */}
                            <View style={styles.filterTagsContainer}>
                                <FilterTag
                                    label="Inclusive"
                                    isSelected={budgetScope === 'Inclusive'}
                                    onPress={() => setBudgetScope('Inclusive')}
                                />
                                <FilterTag
                                    label="Exclusive"
                                    isSelected={budgetScope === 'Exclusive'}
                                    onPress={() => setBudgetScope('Exclusive')}
                                />
                            </View>
                        </View>
    
                        {/* Scrollable Content Section */}
                        {budgetScope === 'Inclusive' && (
                            <View style={styles.cardBottomHalfContainer}>
                                <View style={styles.budgetPropertiesContainer}>
                                    <Text style={styles.defaultText}>Select Bank:</Text>
    
                                    {loading ? (
                                        <ActivityIndicator size="large" color={theme.colors.primary} />
                                    ) : banks.length === 0 ? (
                                        <Text style={styles.defaultText}>You Have No Banks</Text>
                                    ) : (
                                        <FlatList
                                            data={banks}
                                            renderItem={renderBankCard}
                                            keyExtractor={(item) => item?.bankID}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.scrollContainer}
                                        />
                                    )}
    
                                    <Text style={[styles.defaultText, { marginTop: 8 }]}>Select Budget Category:</Text>
    
                                    {categories.length > 0 ? (
                                        <FlatList
                                            data={categories}
                                            renderItem={renderCategoryItem}
                                            keyExtractor={(item) => item.id.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.scrollContainer}
                                        />
                                    ) : (
                                        <Text>Loading Categories...</Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={createBudget} style={styles.buttonStyle}>
                        Create Budget
                    </Button>
                </View>
            </InAppBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    createBudgetScreen: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    buttonContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        padding: 10,
    },

    defaultText: {
        fontSize: 20,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        lineHeight: 20,
        marginBottom: 10,
    },

    selectedPeriod: {
        fontSize: 20,
        width: 80,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'rgba(255, 255, 255, 0.25)',
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
        backgroundColor: 'transparent',
        paddingVertical: 8,
        marginBottom: 13,
        borderWidth: 0,
        textAlign: 'center',
    },

    headerContainer: {
        flex: 1,
        flexDirection: 'coloumn',
    },

    cardTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
    },

    card: {
        margin: 10,
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
    },

    cardTopHalfContainer: {
        maxWidth: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column',
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

    focused: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },

    budgetAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    slashText: {
        fontSize: 25,
        color: '#fff',
        marginHorizontal: 10,
    },

    shortInput: {
        width: 80,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
    },

    periodButton: {
        marginLeft: 10,
        paddingHorizontal: 10,
        height: 40,
        width: 100,
        justifyContent: 'center',
    },

    budgetPropertiesContainer: {
        width: '90%',
        marginTop: 20,
        padding: 20,
        alignSelf: 'center',
        backgroundColor: '#222',
        borderRadius: 5,
        gap: 10,
    },

    scrollContainer: {
        marginBottom: 5,
        marginBottom: 10,
    },

    bankCard: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 10,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },

    selectedCard: {
        borderColor: theme.colors.secondary,
        borderWidth: 3,
    },

    bankCardTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
    },

    bankCardAmount: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontFamily: theme.fonts.medium.fontFamily,
        marginBottom: 5,
        textAlign: 'center',
      },

    remainingBankCardAmount: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        fontFamily: theme.fonts.bold.fontFamily,
        marginBottom: 5,
        textAlign: 'center',
      },

    bankCardRemaining: {
        color: '#fff',
        fontSize: 14,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'center',
    },

    filterTagsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },

    categoryItem: {
        alignItems: 'center',
        marginRight: 15,
    },

    categoryImage: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },

    categoryText: {
        marginTop: 5,
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },

    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});