// Imports
import { theme } from '../../core/theme';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton'
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, FlatList } from 'react-native';
import InAppHeader from '../../components/InAppHeader';
import { useFocusEffect } from '@react-navigation/native';
import TransactionType from '../../constants/TransactionTypes';
import InAppBackground from '../../components/InAppBackground';
import React, { useState, useEffect, useCallback } from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import categoryIcons from '../../constants/categoryIcons';
import { View, ActivityIndicator, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, Platform, Image} from 'react-native';

export default function AddTransactionScreen({ navigation }) {
    // Fetched Data
    const [banks, setBanks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [selectedBankID, setSelectedBankID] = useState(1);

    const [loading, setLoading] = useState(true);

    // Transaction Details
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionTime, setTransactionTime] = useState('');
    const [transactionDesc, setTransactionDesc] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [transactionTitle, setTransactionTitle] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [transactionAttachment, setTransactionAttachment] = useState([]);

    // Date-Time Spinner
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Helper Functions
    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const handleAddAttachment = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            multiple: true,
            copyToCacheDirectory: true,
          });

          if (result?.assets?.length) {
            const attachments = result.assets.map(file => ({
              name: file.name,
              size: file.size,
              uri: file.uri,
              mimeType: file.mimeType || 'application/octet-stream',
            }));
            setTransactionAttachment(prev => [...prev, ...attachments]);
          } else if (result.type === 'success') {
                // Fallback For Older Behavior
                const file = result;
                const attachment = {
                name: file.name,
                size: file.size,
                uri: file.uri,
                mimeType: file.mimeType || 'application/octet-stream',
            };
            setTransactionAttachment(prev => [...prev, attachment]);
          } else {
            console.log("No Document Selected Or Cancelled.");
          }
      
        } catch (error) {
          console.error("File Picker Error:", error);
        }
      };

    const handleRemoveAttachment = (indexToRemove) => {
        setTransactionAttachment(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCategorySelect = (item) => {
        const isAlreadySelected = transactionCategory.includes(item.name);

        if (isAlreadySelected) {
            setTransactionCategory(prevCategories =>
                prevCategories.filter(category => category !== item.name)
            );
        } else {
            const capitalizedCategory = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            setTransactionCategory(prevCategories => [
                ...prevCategories,
                capitalizedCategory
            ]);
        }
    };

    const onDateChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
    
            const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const month = currentDate.toLocaleDateString('en-US', { month: 'short' });
            const day = currentDate.getDate();
            const year = currentDate.getFullYear();

            const formattedDate = `${weekday}, ${month} ${day} ${year}`;
    
            if (Platform.OS === "android") {
                toggleDatepicker();
            }
    
            setTransactionDate(formattedDate);
        } else {
            toggleDatepicker();
        }
    };

    const confirmIOSDate = () => {
        setTransactionDate(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
        toggleDatepicker();
    };

    const toggleTimepicker = () => {
        setShowTimePicker(!showTimePicker);
    };

    const onTimeChange = ({ type }, selectedTime) => {
        if (type === "set") {
            const currentTime = selectedTime;
            setTime(currentTime);

            const formattedTime = currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            if (Platform.OS === "android") {
                toggleTimepicker();
                setTransactionTime(formattedTime);
            }
        } else {
            toggleTimepicker();
        }
    };

    const confirmIOSTime = () => {
        setTransactionTime(
            String(time.getHours()).padStart(2, '0') + ":" +
            String(time.getMinutes()).padStart(2, '0')
        );
        toggleTimepicker();
    };

    useEffect(() => {
        const today = new Date();
        const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
        const month = today.toLocaleDateString('en-US', { month: 'short' });
        const day = today.getDate();
        const year = today.getFullYear();
        const formattedDate = `${weekday}, ${month} ${day} ${year}`;

        const formattedTime = today.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        setTransactionDate(formattedDate);
        setTransactionTime(formattedTime);
      }, []);

    const isToday = () => {
        const today = new Date();
        const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
        const month = today.toLocaleDateString('en-US', { month: 'short' });
        const day = today.getDate();
        const year = today.getFullYear();
        const formattedToday = `${weekday}, ${month} ${day} ${year}`;
        return formattedToday === transactionDate;
    };

    const formatDateToISO = (dateString) => {
        const cleanedDateString = dateString.replace(/^.*?,\s*/, '').trim();
        const [month, day, year] = cleanedDateString.split(' ');

        const monthMap = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
            Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };

        const dayFormatted = day.padStart(2, '0');
        const formattedDate = `${year}-${monthMap[month]}-${dayFormatted}`;
        return formattedDate;
    };

    const formatTimeToISO = (timeString) => {
        timeString = timeString.replace(/\s+/g, ' ').trim();
        let [hour, minuteWithSuffix] = timeString.split(':');
        const [minute, suffix] = minuteWithSuffix.split(' ');

        if (suffix) {
            const isPM = suffix.toUpperCase() === 'PM';
            let hours = parseInt(hour, 10);

            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            hour = hours.toString().padStart(2, '0');
        }
        return `${hour}:${minute}`;
    };

    // API Calls: Categories, Budgets, Goals & Banks
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

    const fetchBudgets = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                console.error('No Token Found');
                return;
            }

            const response = await fetch(`https://ffm-application-main.onrender.com/budgets`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                const exclusiveBudgets = data.budgets.filter(budget => budget.transactionScope === 'Exclusive');
                setBudgets(exclusiveBudgets);
            } else {
                console.error('Failed To Fetch Budgets:', data.message);
            }
            console.log('Fetch Exclusive Budgets Status:', data.status)
        } catch (error) {
            console.error('Error Fetching Budgets:', error);
        }
    };

    const fetchGoals = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                console.error('No Token Found');
                return;
            }

            const response = await fetch(`https://ffm-application-main.onrender.com/goals`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setGoals(data.goals);
            } else {
                console.error('Failed To Fetch Goals:', data.message);
            }
            console.log('Fetch Goals Status:', data.status)
        } catch (error) {
            console.error('Error Fetching Goals:', error);
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
                console.error('Failed To Fetch Banks:', data.message);
            }
            console.log("Fetch Banks Status:", data.status);
        } catch (error) {
            console.error("Error Fetching Banks:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBanks();
            fetchGoals();
            fetchBudgets();
        }, [])
    );

    // Render Functions: Banks, Categories, Budgets & Goals
    const renderBanks = ({ item }) => (
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
                <Text style={styles.remainingBankCardAmount}>{item.remainingBankAmount}</Text>
            </Text>
        </TouchableOpacity>
    );

    const renderCategories = ({ item }) => {
        const isSelected = transactionCategory.includes(item.name);
        return (
            <TouchableOpacity
                style={[
                    { margin: 10, alignItems: 'center', padding: 5 },
                    isSelected && { backgroundColor: theme.colors.primaryDimmed, borderRadius: 10 }
                ]}
                onPress={() => handleCategorySelect(item)}
            >
                <Image source={item.image} style={{ width: 30, height: 30 }} />
                <Text style={transactionCategory === item.name ? styles.radioTextSelected : styles.radioText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderBudgets = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.radioButton,
                selectedBudget === item.budgetID && styles.radioSelected,
            ]}
            onPress={() => setSelectedBudget(item.budgetID)}
        >
            <Text
                style={
                    selectedBudget === item.budgetID
                        ? styles.radioTextSelected
                        : styles.radioText
                }
            >
                {item.budgetTitle.charAt(0).toUpperCase() + item.budgetTitle.slice(1)}
            </Text>
        </TouchableOpacity>
    );

    const renderGoals = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.radioButton,
                selectedGoal === item.goalID && styles.radioSelected,
            ]}
            onPress={() => setSelectedGoal(item.goalID)}
        >
            <Text
                style={
                    selectedGoal === item.goalID
                        ? styles.radioTextSelected
                        : styles.radioText
                }
            >
                {item.goalTitle.charAt(0).toUpperCase() + item.goalTitle.slice(1)}
            </Text>
        </TouchableOpacity>
    );

    const modifiedBudgets = [
        { budgetID: null, budgetTitle: 'No Budget' },
        ...budgets,
    ];
    
    const modifiedGoals = [
        { goalID: null, goalTitle: 'No Goal' },
        ...goals,
    ];

    // Add Transaction API Call
    const addTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const formattedTransactionDate = formatDateToISO(transactionDate);
            const formattedTransactionTime = formatTimeToISO(transactionTime);
            console.log("Original Transaction Time:", transactionTime)
            console.log("Formatted Transaction Time:", formattedTransactionTime)

            if (!token) {
                console.error('Missing required data');
                return;
            }

            const response = await fetch(`https://ffm-application-main.onrender.com/add-transaction`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionTitle: transactionTitle,
                    transactionDesc: transactionDesc,
                    transactionType: transactionType.trim().toUpperCase(),
                    transactionCategory: transactionCategory,
                    transactionAmount: parseFloat(transactionAmount),
                    transactionDate: formattedTransactionDate.trim(),
                    transactionTime: formattedTransactionTime.trim(),
                    budgetID: selectedBudget,
                    bankID: selectedBankID,
                    goalID: selectedGoal,
                    attachments: transactionAttachment
                }),
            });

            console.log('Attachment To Be Added', transactionAttachment);

            const data = await response.json();
            console.log('Transaction Data:', data);

            if (response.ok) {
                alert(data.message)
                navigation.goBack();
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error(error.message);
            alert('An Error Occurred: ' + error.message);
        }
    };

    // UI
    return (
        <View style={styles.screen}>
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                    <View style={styles.screenContainer}>
                        <View style={styles.headerContainer}>
                            <View style={styles.cardTitle}>
                                <InAppHeader>New Transaction</InAppHeader>
                            </View>
                        </View>
                        <View style={styles.radioContainer}>
                            {Object.values(TransactionType).map((type) => {
                                const isSelected = transactionType === type;
                                const dynamicStyle = isSelected
                                ? {
                                    backgroundColor: type === 'income' ? theme.colors.income : theme.colors.expense,
                                    }
                                : {};

                                return (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                    styles.transactionType,
                                    isSelected && styles.transactionTypeSelected,
                                    dynamicStyle,
                                    ]}
                                    onPress={() => setTransactionType(type)}
                                >
                                    <Text style={isSelected ? styles.transactionTypeTextSelected : styles.transactionTypeText}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                                );
                            })}
                            </View>

                        <View style={styles.card}>

                            {/* Amount */}
                            <View style={[styles.amountContainer,
                                transactionType === 'income'
                                ? { borderColor: theme.colors.income }
                                : transactionType === 'expense'
                                ? { borderColor: theme.colors.expense }
                                : { borderColor: theme.colors.primary },
                            ]}>
                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="0.00"
                                    value={transactionAmount}
                                    onChangeText={setTransactionAmount}
                                    onBlur={() => setTransactionAmount(transactionAmount)}
                                    style={styles.inputAmount}
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    placeholderTextColor="white"
                                />
                                </View>
                            </View>

                            {/* Date & Time */}
                            {showPicker && (
                                <DateTimePicker
                                    mode="date"
                                    display="default"
                                    value={date}
                                    is24Hour={true}
                                    onChange={onDateChange}
                                    style={styles.datePicker}
                                />
                            )}

                            {showPicker && Platform.OS === "ios" &&
                                (
                                    <View
                                        style={{ alignItems: "center", padding: 10, flexDirection: "row", justifyContent: "space-around" }}>
                                        <TouchableOpacity style={[
                                            styles.button,
                                            styles.pickerButton,
                                            { backgroundColor: theme.colors.primary },
                                        ]}
                                            onPress={toggleDatepicker}
                                        >
                                            <Text style={{ color: "white" }}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[
                                            styles.button,
                                            styles.pickerButton,
                                            { backgroundColor: theme.colors.primary },
                                        ]}
                                            onPress={confirmIOSDate}
                                        >
                                            <Text style={{ color: "white" }}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <View style={styles.dateTimeContainer}>
                                    {!showPicker && (
                                        <TouchableOpacity onPress={toggleDatepicker} style={styles.dateContainer}>
                                            <MaterialIcons name="calendar-today" size={24} color="white" style={styles.dateIcon} />
                                            <Text style={styles.dateText}>
                                                {isToday() ? "Today" : transactionDate}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {showTimePicker && (
                                        <DateTimePicker
                                            mode="time"
                                            display="spinner"
                                            value={time}
                                            onChange={onTimeChange}
                                            style={styles.datePicker}
                                        />
                                    )}

                                    {showTimePicker && Platform.OS === "ios" && (
                                        <View style={{ alignItems: "center", padding: 10, flexDirection: "row", justifyContent: "space-around" }}>
                                            <TouchableOpacity
                                                style={[styles.button, styles.pickerButton, { backgroundColor: theme.colors.primary }]}
                                                onPress={toggleTimepicker}
                                            >
                                            <Text style={{ color: "white" }}>Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.button, styles.pickerButton, { backgroundColor: theme.colors.primary }]}
                                                onPress={confirmIOSTime}
                                            >
                                            <Text style={{ color: "white" }}>Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {!showTimePicker && (
                                        <Pressable onPress={toggleTimepicker}>
                                            <TouchableOpacity onPress={toggleTimepicker} style={styles.timeContainer}>
                                                <MaterialIcons name="access-time" size={24} color="white" style={styles.dateIcon} />
                                                <Text style={styles.dateText}>
                                                    {transactionTime}
                                                </Text>
                                            </TouchableOpacity>
                                        </Pressable>
                                    )}
                                </View>

                            {/* Title & Notes */}
                            <View>
                                <TextInput
                                    placeholder="Title"
                                    value={transactionTitle}
                                    onChangeText={setTransactionTitle}
                                    style={styles.input}
                                    placeholderTextColor={theme.colors.grayedText}
                                />
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Notes"
                                        value={transactionDesc}
                                        onChangeText={setTransactionDesc}
                                        style={[styles.description, { color: theme.colors.textSecondary, flex: 1 }]}
                                        placeholderTextColor={theme.colors.grayedText}
                                        multiline
                                        numberOfLines={10}
                                        textAlignVertical="top"
                                    />
                                    <View style={{ alignItems:'flex-end' }}>
                                        <TouchableOpacity onPress={handleAddAttachment}>
                                        <MaterialIcons
                                            name="attach-file"
                                            size={25}
                                            color={theme.colors.textSecondary}
                                            style={styles.icon}
                                        />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Attachments */}
                            {transactionAttachment.length > 0 && (
                            <View>
                                <Text style={styles.sectionTitle}>Attachments</Text>

                                {/* Image Attachments In Horizontal Scroll */}
                                {transactionAttachment.some(file => file.mimeType?.startsWith('image/')) && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.attachmentPreviewContainer}
                                >
                                    {transactionAttachment.map((file, index) => {
                                    if (!file.mimeType?.startsWith('image/')) return null;
                                    return (
                                        <View key={index} style={styles.attachmentItem}>
                                        <Image
                                            source={{ uri: file.uri }}
                                            style={styles.attachmentImage}
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleRemoveAttachment(index)}
                                            style={styles.removeIcon}
                                        >
                                            <MaterialIcons name="close" size={16} color={theme.colors.expense} />
                                        </TouchableOpacity>
                                        </View>
                                    );
                                    })}
                                </ScrollView>
                                )}

                                {/* Non-Image Attachments Listed Vertically */}
                                {transactionAttachment.some(file => !file.mimeType?.startsWith('image/')) && (
                                <View style={styles.nonImageList}>
                                    {transactionAttachment.map((file, index) => {
                                    if (file.mimeType?.startsWith('image/')) return null;
                                    return (
                                        <View key={index} style={styles.attachmentRow}>
                                            <Text style={styles.attachmentText} numberOfLines={1} ellipsizeMode="tail">{file.name}</Text>
                                            <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                                                <MaterialIcons name="close" size={18} color={theme.colors.expense} />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                    })}
                                </View>
                                )}
                            </View>
                            )}


                            {/* Categories */}
                            <Text style={styles.sectionTitle}>Categories</Text>
                            <View style={styles.radioContainer}>
                                {categories.length > 0 ? (
                                    <FlatList
                                        data={categories}
                                        renderItem={renderCategories}
                                        keyExtractor={(item) => item.id.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollContainer}
                                    />
                                ) : (
                                    <Text style={styles.defaultText}>Loading Categories...</Text>
                                )}
                            </View>

                            {/* Wallets */}
                            <View>
                                <Text style={styles.sectionTitle}>Wallets</Text>
                                {loading ? (
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                ) : banks.length === 0 ? (
                                    <Text style={styles.defaultText}>You Have No Wallets</Text>
                                ) : (

                                <FlatList
                                    data={banks}
                                    renderItem={renderBanks}
                                    keyExtractor={(item) => item?.bankID}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.scrollContainer}
                                />
                                )}
                            </View>

                            {/* Budgets */}
                            <Text style={styles.sectionTitle}>Exclusive Budgets</Text>
                            <View>
                                <FlatList
                                    data={modifiedBudgets}
                                    renderItem={renderBudgets}
                                    keyExtractor={(item) => item?.budgetID}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.radioContainer}
                                />
                            </View>

                            {/* Goals */}
                            <Text style={styles.sectionTitle}>Goals</Text>
                            <View>
                                <FlatList
                                    data={modifiedGoals}
                                    renderItem={renderGoals}
                                    keyExtractor={(item) => item?.goalID}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.radioContainer}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={addTransaction}>Add Transaction</Button>
                </View>
            </InAppBackground>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    card: {
        margin: 10,
        padding: 10,
    },

    headerContainer: {
        flex: 1,
        flexDirection: 'coloumn',
        margin: 15
    },

    cardTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
    },

    input: {
        borderBottomWidth: 2,
        borderColor: theme.colors.primary,
        padding: 5,
        borderRadius: 8,
        fontSize: 25,
        marginBottom: 15,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium.fontFamily,
    },

    inputContainer: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 8,
        padding: 8,
        marginBottom: 20,
      },

      icon: {
        marginRight: 8,
      },

    description: {
        borderRadius: 8,
        fontSize: 18,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium.fontFamily,
        height: 150,
        textAlignVertical: 'top',
    },

    attachmentPreviewContainer: {
        marginTop: 6,
        flexDirection: 'row',
        gap: 5,
      },
      
      attachmentItem: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
      },
      
      attachmentImage: {
        width: 120,
        height: 120,
        borderRadius: 5,
      },

      nonImageList: {
        gap: 5,
        marginBottom: 20
      },

      attachmentRow:{
        flexDirection: 'row',
        alignItems: 'center'
      },

      attachmentText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium.fontFamily,
        textDecorationLine: 'underline',
      },
      
      removeIcon: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: theme.colors.textSecondary,
        borderRadius: 8,
        padding: 2,
        elevation: 2,
      },

    amountContainer: {
        borderRadius: 100,
        margin: 15,
        borderWidth: 2,
    },

    inputRow: {
        flexDirection: "row",
        alignSelf: "center",
        gap: 10,
    },

    button: { marginBottom: 0, },

    radioContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    transactionType: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 10,
        paddingBottom: 10,
        marginHorizontal: 5,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: theme.colors.primaryDimmed,
        borderRadius: 15,
    },

    transactionTypeText: { fontSize: 15, color: theme.colors.surface, fontFamily: theme.fonts.medium.fontFamily },
    transactionTypeTextSelected: { color: theme.colors.textSecondary, fontFamily: theme.fonts.bold.fontFamily },

    radioButton: {
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.primaryDimmed,
        borderRadius: 10,
        backgroundColor: "#181818",
    },

    radioSelected: { backgroundColor: theme.colors.primary },
    radioText: { color: theme.colors.surface, fontFamily: theme.fonts.medium.fontFamily },
    radioTextSelected: { color: theme.colors.textSecondary, fontFamily: theme.fonts.bold.fontFamily },

    datePicker: {
        height: 120,
        margin: 5,
        backgroundColor: '#ffffff',
    },

    pickerButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },

    dateText: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        fontSize: 20,
    },

    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: theme.colors.primaryDimmed,
        borderRadius: 10,
        padding: 7
    },

    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primaryDimmed,
        borderRadius: 10,
        padding: 7
    },

    dateTimeContainer: {
        justifyContent:'space-evenly',
        flexDirection: 'row',
        marginTop: 10
    },

    dateIcon: {
        marginRight: 10,
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        marginBottom: 5,
        color: "#ffffff",
    },

    defaultText: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary
    },

    inputAmount: {
        fontSize: 30,
        color: "white",
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: "center",
        margin: 15,
    },

    bankCard: {
        borderWidth: 2,
        borderColor: theme.colors.primaryDimmed,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 10,
        marginVertical: 10,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },

    selectedCard: {
        backgroundColor: theme.colors.primaryDimmed,
        borderWidth: 2,
        borderColor: theme.colors.primary
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
});