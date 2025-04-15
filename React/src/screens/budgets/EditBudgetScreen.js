import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import InAppHeader from '../../components/InAppHeader';
import Button from '../../components/Button';
import InAppBackground from '../../components/InAppBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import DateSelector from '../../components/DateSelector';
import FilterTag from '../../components/FilterTag';
import ButtonSmall from '../../components/ButtonSmall';
import PeriodSelectionPopup from '../../components/PeriodSelectionPopup';
import categoryIcons from '../../constants/categoryIcons';

const formatDateForDisplay = (dateString) => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return 'Select Date';
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
};

const formatDate = (date) => {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return '--';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = date.split("-");
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

const parseAndFormatDateString = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error("Could not parse date string:", dateString);
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const calculateEndDate = (startDate, duration, selectedPeriod) => {
    const periodsInDays = {
        Daily: 1,
        Weekly: 7,
        Monthly: 30,
        Yearly: 365
    };

    if (!startDate || !duration || !selectedPeriod) {
        console.error("Missing required parameters for calculateEndDate.");
        return null;
    }

    const start = new Date(startDate);

    if (isNaN(start.getTime())) {
        console.error("Invalid start date for calculateEndDate.");
        return null;
    }

    const periodKey = selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1).toLowerCase();
    const periodInDays = periodsInDays[periodKey];
    if (typeof periodInDays === 'undefined') {
        console.error("Invalid selected period for calculateEndDate:", selectedPeriod);
        return null;
    }

    const numDuration = parseInt(duration, 10);
    if (isNaN(numDuration) || numDuration <= 0) {
        console.error("Invalid duration for calculateEndDate:", duration);
        return null;
    }

    const daysToAdd = numDuration * periodInDays;

    start.setDate(start.getDate() + daysToAdd - 1); // Subtract 1 because period includes start date

    const formattedEndDate = start.toISOString().split('T')[0];
    return formattedEndDate;
};

const calculateDurationAndPeriodFromDates = (startStr, endStr) => {
    if (!startStr || !endStr) return null;

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
        return null;
    }

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1; // Inclusive days

    if (diffInDays <= 0) return null;

    if (diffInDays >= 365 && diffInDays % 365 === 0) {
        const years = diffInDays / 365;
        if (years > 0) {
            return { duration: years, period: 'Yearly' };
        }
    }

    if (diffInDays >= 30 && diffInDays % 30 === 0) {
        const months = diffInDays / 30;
        if (months > 0) {
            return { duration: months, period: 'Monthly' };
        }
    }

    if (diffInDays >= 7 && diffInDays % 7 === 0) {
        const weeks = diffInDays / 7;
        if (weeks > 0) {
            return { duration: weeks, period: 'Weekly' };
        }
    }

    return { duration: diffInDays, period: 'Daily' };
};



export default function EditBudgetScreen({ navigation, route }) {

    const { budgetID } = route.params;

    const [budgetTitle, setBudgetTitle] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetType, setBudgetType] = useState('');
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedBankID, setSelectedBankID] = useState(null);
    const [budgetScope, setBudgetScope] = useState('Inclusive');

    const [duration, setDuration] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [showPeriodPopup, setShowPeriodPopup] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [categories, setCategories] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!budgetID) {
            Alert.alert("Error", "No Budget ID provided.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            setIsLoading(false);
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                Alert.alert("Authentication Error", "Please log in again.");
                setIsLoading(false);
                setError("Authentication required.");
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            try {
                const [budgetResponse, banksResponse, categoriesResponse] = await Promise.all([
                    fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}`, { headers }),
                    fetch('https://ffm-application-main.onrender.com/banks', { headers }),
                    fetch('https://ffm-application-main.onrender.com/ffm/categories', { headers })
                ]);

                const budgetData = await budgetResponse.json();
                if (!budgetResponse.ok || budgetData.status !== 'success' || !budgetData.budget) {
                    throw new Error(budgetData.message || 'Failed to fetch budget details');
                }
                const fetchedBudget = budgetData.budget;

                const banksData = await banksResponse.json();
                if (!banksResponse.ok) {
                    console.warn("Failed to fetch banks:", banksData.message || "Unknown banks error");
                    setBanks([]);
                } else {
                    setBanks(banksData.banks || []);
                }

                const categoriesData = await categoriesResponse.json();
                if (!categoriesResponse.ok || !categoriesData.categories) {
                    console.warn("Failed to fetch categories:", categoriesData.message || "Unknown categories error");
                    setCategories([]);
                } else {
                    const categoryArray = Object.entries(categoriesData.categories).map(([key, value], index) => {
                        const categoryName = typeof value === 'string' ? value.toLowerCase() : 'unknown';
                        return {
                            id: index + 1,
                            name: value,
                            image: categoryIcons[categoryName] || categoryIcons.unknown
                        };
                    });
                    setCategories(categoryArray);
                }

                const rawAmount = fetchedBudget.budgetAmount ? String(fetchedBudget.budgetAmount) : '';
                const cleanedAmount = rawAmount.replace(/[^0-9.]/g, '');

                const rawFetchedStartDate = fetchedBudget.startDate || '';
                const rawFetchedEndDate = fetchedBudget.endDate || '';

                const fetchedStartDate = parseAndFormatDateString(rawFetchedStartDate);
                const fetchedEndDate = parseAndFormatDateString(rawFetchedEndDate);

                setBudgetTitle(fetchedBudget.budgetTitle || '');
                setBudgetAmount(cleanedAmount);
                setBudgetType(fetchedBudget.budgetType ? fetchedBudget.budgetType.charAt(0).toUpperCase() + fetchedBudget.budgetType.slice(1).toLowerCase() : '');
                setBudgetCategories(fetchedBudget.budgetCategory || []);
                setStartDate(fetchedStartDate);
                setEndDate(fetchedEndDate);
                setSelectedBankID(fetchedBudget.bankID || null);
                setBudgetScope(fetchedBudget.transactionScope ? fetchedBudget.transactionScope.charAt(0).toUpperCase() + fetchedBudget.transactionScope.slice(1).toLowerCase() : 'Inclusive');

                if (fetchedStartDate && fetchedEndDate) {
                    const derivedPeriod = calculateDurationAndPeriodFromDates(fetchedStartDate, fetchedEndDate);
                    if (derivedPeriod) {
                        setDuration(String(derivedPeriod.duration));
                        setSelectedPeriod(derivedPeriod.period);
                    } else {
                        setDuration('');
                        setSelectedPeriod(null);
                    }
                } else {
                    setDuration('');
                    setSelectedPeriod(null);
                }

            } catch (fetchError) {
                console.error("Error fetching initial data:", fetchError);
                setError(fetchError.message || "An error occurred while loading data.");
                Alert.alert("Error Loading Data", fetchError.message || "Could not load necessary data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [budgetID]);

    useEffect(() => {
        if (startDate && duration && selectedPeriod) {
            const numDuration = parseInt(duration, 10);
            if (!isNaN(numDuration) && numDuration > 0) {
                const newEndDate = calculateEndDate(startDate, numDuration, selectedPeriod);
                if (newEndDate && newEndDate !== endDate) {
                    setEndDate(newEndDate);
                }
            }
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

        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (end < start) return 'Invalid Date Range';

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);
    
        return `${formattedStart} - ${formattedEnd}`;
    };

    const handleCategorySelect = (item) => {
        const categoryName = item.name;
        setBudgetCategories(prevCategories =>
            prevCategories.includes(categoryName)
                ? prevCategories.filter(cat => cat !== categoryName)
                : [...prevCategories, categoryName]
        );
    };

    const handleAmountChange = (value) => {
        const cleanedValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanedValue.split('.');
        if (parts.length > 2) return;
        if (parts[1] && parts[1].length > 2) return;
        setBudgetAmount(cleanedValue);
    };

    const handlePeriodFocus = () => setShowPeriodPopup(true);
    const handleShowDatePicker = () => setShowDatePicker(true);
    const handleDateSave = (date) => { setStartDate(date); setShowDatePicker(false); };
    const handleDateCancel = () => setShowDatePicker(false);

    const renderBankCard = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.bankCard,
                selectedBankID === item.bankID && styles.selectedCard
            ]}
            onPress={() => {
                if (budgetScope === 'Inclusive') setSelectedBankID(item.bankID);
            }}
            disabled={budgetScope !== 'Inclusive'}
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
                style={[styles.categoryItemContainer, isSelected && styles.selectedCategory]}
                onPress={() => {
                    if (budgetScope === 'Inclusive') handleCategorySelect(item);
                }}
                disabled={budgetScope !== 'Inclusive'}
            >
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const updateBudget = async () => {
        if (!budgetID) {
            Alert.alert('Error', 'Cannot update without a Budget ID.');
            return;
        }
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            Alert.alert('Authentication Error', 'Please log in again.');
            return;
        }

        if (!budgetTitle.trim() || !budgetAmount || !budgetType || !startDate || !endDate || !budgetScope) {
            Alert.alert('Validation Error', 'Please fill in all required fields (Title, Amount, Type, Dates, Scope).');
            return;
        }
        const numericAmount = parseFloat(budgetAmount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid positive budget amount.');
            return;
        }

        if (budgetScope === 'Inclusive' && !selectedBankID) {
            Alert.alert('Validation Error', 'Please select a bank account for an inclusive budget.');
            return;
        }
        if (budgetScope === 'Inclusive' && budgetCategories.length === 0) {
            Alert.alert('Validation Error', 'Please select at least one category for an inclusive budget.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                    bankID: budgetScope === 'Inclusive' ? selectedBankID : null,
                    budgetTitle: budgetTitle.trim(),
                    budgetAmount: numericAmount,
                    budgetType: budgetType.toUpperCase(),
                    budgetCategory: budgetScope === 'Inclusive' ? budgetCategories : [],
                    transactionScope: budgetScope.toUpperCase(),
                    startDate: startDate,
                    endDate: endDate,
                })
            });

            const responseData = await response.json();

            if (response.ok && responseData.status === 'success') {
                Alert.alert('Success', responseData.message || 'Budget Updated Successfully');
                navigation.goBack();

            } else {
                Alert.alert('Error', `Failed To Update Budget: ${responseData.message || response.statusText || 'Unknown error'}`);
                console.error('Update failed:', response.status, responseData);
            }
        } catch (error) {
            console.error("Error updating budget:", error);
            Alert.alert('Error', 'Something Went Wrong during the update.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                <View style={styles.centeredMessageContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Loading Budget...</Text>
                </View>
            </InAppBackground>
        );
    }

    if (error) {
        return (
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                <View style={styles.centeredMessageContainer}>
                    <Text style={styles.errorText}>Error Loading Data</Text>
                    <Text style={styles.errorDetailsText}>{error}</Text>
                </View>
            </InAppBackground>
        );
    }

    return (
        <View style={styles.editBudgetScreen}>
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
                        initialDate={startDate || undefined}
                    />
                )}

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}>
                    <View style={styles.screenContainer}>
                        <View style={styles.headerContainer}>
                            <View style={styles.cardTitle}>
                                <InAppHeader>Edit Budget</InAppHeader>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.cardTopHalfContainer}>
                                <TextInput
                                    placeholderTextColor="rgba(255, 255, 255, 0.25)"
                                    placeholder="Enter Title"
                                    value={budgetTitle}
                                    onChangeText={setBudgetTitle}
                                    style={[styles.input, styles.defaultText]}
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
                                        placeholder={duration || '0'}
                                        value={duration}
                                        onChangeText={(text) => setDuration(text.replace(/[^0-9]/g, ''))}
                                        style={[styles.input, styles.shortInput, styles.defaultText]}
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.slashText}>/</Text>
                                    <TouchableOpacity onPress={handlePeriodFocus}>
                                        <Text style={[styles.selectedPeriod, selectedPeriod ? { color: '#fff' } : {}]}>
                                            {displayPeriodSelected(selectedPeriod)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.defaultText}>Starting:</Text>
                                <ButtonSmall
                                    label={formatDateForDisplay(startDate)}
                                    onPress={handleShowDatePicker}
                                    mode="contained"
                                    style={styles.dateButton}
                                />

                                <Text style={[styles.defaultText, { marginTop: 35 }]}>Budget Period</Text>
                                <Text style={[styles.defaultText, { fontSize: 16, color: theme.colors.primary }]}>
                                    {displayBudgetPeriod()}
                                </Text>
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

                        <View style={[styles.cardBottomHalfContainer, budgetScope !== 'Inclusive' && styles.disabledSection]}>
                            <View style={styles.budgetPropertiesContainer}>
                                <Text style={styles.defaultText}>Select Bank:</Text>
                                {banks.length === 0 && !isLoading ? (
                                    <Text style={styles.infoText}>No Bank Accounts Found</Text>
                                ) : (
                                    <FlatList
                                        data={banks}
                                        renderItem={renderBankCard}
                                        keyExtractor={(item) => item.bankID.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollContainer}
                                    />
                                )}


                                <Text style={[styles.defaultText, { marginTop: 8 }]}>Select Budget Category:</Text>
                                {categories.length === 0 && !isLoading ? (
                                    <Text style={styles.infoText}>No Categories Found</Text>
                                ) : (
                                    <FlatList
                                        data={categories}
                                        renderItem={renderCategoryItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollContainer}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={updateBudget}
                        style={styles.buttonStyle}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Budget'}
                    </Button>
                </View>
            </InAppBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    editBudgetScreen: {
        flex: 1,
    },
    screenContainer: {
        flex: 1,
    },
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: 'white',
        fontFamily: theme.fonts.regular.fontFamily,
    },
    errorText: {
        fontSize: 18,
        color: theme.colors.error,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
        marginBottom: 5,
    },
    errorDetailsText: {
        fontSize: 14,
        color: 'white',
        fontFamily: theme.fonts.regular.fontFamily,
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        padding: 15,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    buttonStyle: {},
    defaultText: {
        fontSize: 20,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        lineHeight: 24,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        fontFamily: theme.fonts.regular.fontFamily,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginVertical: 10,
    },
    selectedPeriod: {
        fontSize: 20,
        minWidth: 80,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff',
        backgroundColor: 'transparent',
        paddingVertical: 8,
        borderWidth: 0,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
    },
    cardTopHalfContainer: {
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(255, 255, 255, 0.7)',
        fontSize: 22,
        paddingVertical: 10,
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
        width: '80%',
        alignSelf: 'center',
    },
    budgetAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    slashText: {
        fontSize: 25,
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 10,
        lineHeight: 40,
    },
    shortInput: {
        width: 90,
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(255, 255, 255, 0.7)',
        fontSize: 20,
        paddingVertical: 8,
        margin: 0,
        color: '#fff',
    },
    dateButton: {
        marginTop: 5,
        marginBottom: 10,
    },
    cardBottomHalfContainer: {
        marginTop: 10,
    },
    disabledSection: {
        opacity: 0.5,
    },
    budgetPropertiesContainer: {
        marginTop: 10,
        padding: 15,
        marginHorizontal: 10,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
    },
    scrollContainer: {
        paddingVertical: 10,
    },
    bankCard: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        minWidth: 140,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    },
    selectedCard: {
        borderColor: theme.colors.primary,
        borderWidth: 2.5,
        padding: 9.5,
    },
    bankCardTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
        marginBottom: 4,
    },
    bankCardAmount: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'center',
    },
    remainingBankCardAmount: {
        color: '#fff',
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'center',
    },
    filterTagsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-between'
    },
    categoryItemContainer: {
        marginHorizontal: 5,
        padding: 8,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        minWidth: 70,
    },
    selectedCategory: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(0, 150, 255, 0.1)',
    },
    categoryImage: {
        width: 35,
        height: 35,
        marginBottom: 5,
    },
    categoryText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'center',
    },
});