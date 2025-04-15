import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import InAppHeader from '../../components/InAppHeader';
import Button from '../../components/Button';
import InAppBackground from '../../components/InAppBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import BottomDrawer from '../../components/BottomDrawer';
import { theme } from '../../core/theme';
import DateSelector from '../../components/DateSelector';
import FilterTag from '../../components/FilterTag';
import ButtonSmall from '../../components/ButtonSmall';
import PeriodSelectionPopup from '../../components/PeriodSelectionPopup';
import ColorTray from '../../components/ColorTray';
import categoryIcons from '../../constants/categoryIcons';

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
    const budgetTitleRef = useRef(null);

    const [budgetAmount, setBudgetAmount] = useState('');
    const budgetAmountRef = useRef(null);

    const [budgetType, setBudgetType] = useState('');
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [selectedBankID, setSelectedBankID] = useState(null);
    const [categories, setCategories] = useState('');
    const [duration, setDuration] = useState(''); // To help with calclation of end date
    const budgetDurationRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('#4A90E2');
    const handleColorSelect = (color) => {
        setSelectedColor(color);
      };

    //Pop-up Triggers
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [showPeriodPopup, setShowPeriodPopup] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [budgetScope, setBudgetScope] = useState('Inclusive');

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
                        image: categoryIcons[categoryName] || require('../../assets/default_img.jpg') // FallBack
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
        let formattedPeriod = '';
            switch (period) {
            case 'Daily':
                formattedPeriod = 'Day';
                break;
            case 'Weekly':
                formattedPeriod = 'Week';
                break;
            case 'Monthly':
                formattedPeriod = 'Month';
                break;
            case 'Yearly':
                formattedPeriod = 'Year';
                break;
            default:
                formattedPeriod = period;
        }

        if (duration > 1 && formattedPeriod.length > 0) {
            formattedPeriod += 's';
        }
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

    const handlePress = () => {
        if(!budgetTitle) {
            budgetTitleRef.current.focus();
            return;
        }

        if(!budgetAmount) {
            budgetAmountRef.current.focus();
            return;
        }

        if (!duration) {
            budgetDurationRef.current.focus();
            return;
        }

        if (!selectedPeriod) {
            handlePeriodFocus();
            return;
        }

        if (!startDate) {
            handleShowDatePicker();
            return;
        }

        createBudget();
    }

    const getButtonText = () => {
        if (budgetScope === "Exclusive") {
            if (!budgetTitle) return "Set Title";
            if (!budgetAmount) return "Set Amount";
            if (!duration) return "Set Duration";
            if (!selectedPeriod) return "Set Period";
            if (!startDate) return "Set Start Date";
            if (!budgetType) return "Set Type";
            if (!budgetScope) return "Set Scope";
          return "Create Budget";
        }

        if (!budgetTitle) return "Set Title";
        if (!budgetAmount) return "Set Amount";
        if (!duration) return "Set Duration";
        if (!selectedPeriod) return "Set Period";
        if (!startDate) return "Set Start Date";
        if (!budgetType) return "Set Type";
        if (!budgetScope) return "Set Scope";
        if (!selectedBankID) return "Select Bank";
        if (Array.isArray(budgetCategories) && budgetCategories.length === 0) {
            return "Select Categories";
        }

        return "Create Budget";
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

        let missingFields = [];

        if (!budgetTitle) missingFields.push('Budget Title');
        if (!budgetAmount) missingFields.push('Budget Amount');
        if (!startDate) missingFields.push('Budget Period');
        if (!budgetType) missingFields.push('Budget Type');
        if (!budgetScope) missingFields.push('Budget Scope');

        if (budgetScope === "Inclusive") {
            if (!selectedBankID) missingFields.push('Budget Bank');
            if (Array.isArray(budgetCategories) && budgetCategories.length === 0) {
                missingFields.push('Budget Categories');
            }
        }

        if (missingFields.length > 0) {
            const message = `Please Fill In The Following Fields:\n\n• ${missingFields.join('\n• ')}`;
            Alert.alert('Hold Up!', message, [{ text: 'OK' }]);
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
                    color: selectedColor,
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
                                    ref={budgetTitleRef}
                                    placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                    placeholder="Enter Title"
                                    value={budgetTitle}
                                    onChangeText={setBudgetTitle}
                                    style={[styles.input, styles.defaultText, isFocused ? styles.focused : null]}
                                />

                                <View style={styles.budgetAmountContainer}>
                                    <TextInput
                                        ref={budgetAmountRef}
                                        placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                        placeholder="$0.00"
                                        value={budgetAmount}
                                        onChangeText={handleAmountChange}
                                        style={[styles.input, styles.shortInput, styles.defaultText]}
                                        keyboardType="numeric"
                                    />

                                    <Text style={styles.slashText}>/</Text>

                                    <TextInput
                                        ref={budgetDurationRef}
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
                                <Text style={[styles.defaultText, { fontSize: 16, color: theme.colors.primary, marginBottom: 35 }]}>
                                    {displayBudgetPeriod()}
                                </Text>
                            </View>
    
                            {/* Filter Tags - Budget Type */}
                            <View style={styles.filterHeader}>
                                <BottomDrawer
                                    title="Budget Type"
                                    heading1="Savings Budget"
                                    text1="• Track your income and budget your savings"
                                    heading2="Expense Budget"
                                    text2="• Track your expenses and budget your spending"
                                />
                                <Text style={styles.defaultText}>Budget Type</Text>
                            </View>
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

                            <View style={styles.filterHeader}>
                                <BottomDrawer 
                                    title="Budget Scope"
                                    heading1="Inclusive Budget"
                                    text1="• All transactions within selected categories"
                                    heading2="Exclusive Budget"
                                    text2="• Only the transactions you add"
                                />
                                <Text style={styles.defaultText}>Budget Scope</Text>
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
                        )}
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <ColorTray 
                        selectedColor={selectedColor} 
                        onColorSelect={handleColorSelect}
                    />
                    <Button mode="contained" onPress={handlePress} style={styles.buttonStyle}>
                        {getButtonText()}
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
        marginBottom: 10,
        fontSize: 17,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
    },

    selectedPeriod: {
        fontSize: 17,
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
        paddingLeft: 20,
        paddingRight: 20,
        alignSelf: 'center',
        // backgroundColor: '#222',
        borderRadius: 5,
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
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-between'
    },

    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center'
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