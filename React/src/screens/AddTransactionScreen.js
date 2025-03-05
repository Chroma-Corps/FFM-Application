import React, { useState, useEffect, useCallback } from 'react';
import { View,
         ActivityIndicator,
         Text, 
         TextField,
         StyleSheet, 
         TextInput, 
         TouchableOpacity,
         Pressable,
         Platform,
         Image } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import InAppBackground from '../components/InAppBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../components/Button';
import TransactionType from '../constants/TransactionTypes';
// import TransactionCategories from '../constants/TransactionCategories';
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import BankAccountCard from '../components/BankAccountCard';
import { useFocusEffect } from '@react-navigation/native';

//Testing date/timer feature
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddTransactionScreen({ navigation }) {
    const [transactionTitle, setTransactionTitle] = useState('');
    const [transactionDesc, setTransactionDesc] = useState('');
    const [transactionType, setTransactionType] = useState('expense');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionTime, setTransactionTime] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [budgets, setBudgets] = useState(null);
    const [banks, setBanks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBankID, setSelectedBankID] = useState(null);
    // const selectBank = (id) => setSelectedBank(id);


    //Date/Time Spinner
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const categoryImages = {
        bills: require('../assets/icons/bills.png'),
        entertainment: require('../assets/icons/entertainment.png'),
        groceries: require('../assets/icons/groceries.png'),
        income: require('../assets/icons/income.png'),
        shopping: require('../assets/icons/shopping.png'),
        transit: require('../assets/icons/transit.png')
      };

      useEffect(() => {
              fetch('https://ffm-application-midterm.onrender.com/ffm/categories')
                  .then(response => response.json())
                  .then(data => {
                      const categoryArray = Object.entries(data).map(([key, value], index) => {
                          const categoryName = value.toLowerCase();
                          return {
                              id: index + 1,
                              name: value,
                              image: categoryImages[categoryName] || require('../assets/default_img.jpg')  // FallBack
                          };
                      });
                      setCategories(categoryArray);
                  })
                  .catch(error => console.error('Error Fetching categories:', error));
          }, []);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const handleCategorySelect = (category) => {
        setTransactionCategory(category);
        console.log('Selected category:', category);
    }

    const onChange = ({ type }, selectedDate) => {
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
    
            if (Platform.OS === "android") {
                toggleDatepicker();
                setTransactionDate(currentDate.toISOString().split("T")[0]); // Format YYYY-MM-DD
            }
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
    
            if (Platform.OS === "android") {
                toggleTimepicker();
                setTransactionTime(
                    String(currentTime.getHours()).padStart(2, '0') + ":" + 
                    String(currentTime.getMinutes()).padStart(2, '0')
                );
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

    //Currency Formatting 
    // const formatCurrency = (value) => {
    //     let cleanedValue = value.replace(/[^0-9.]/g, "");
      
    //     const parts = cleanedValue.split(".");
    //     if (parts.length > 2) {
    //       cleanedValue = parts[0] + "." + parts.slice(1).join("");
    //     }

    //     let numericValue = parseFloat(cleanedValue);
    //     if (isNaN(numericValue)) return "";
      
    //     return `$${numericValue}`; // Always show two decimal places
    //   };

      //File Attachment
      const [selectedFile, setSelectedFile] = useState(null);

      const pickDocument = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: [
              "image/*",
              "application/pdf",
              "application/msword",
              "text/plain"
            ],
            copyToCacheDirectory: false,
          });
      
          if (result.type === "success") {
            Alert.alert(
              "Confirm Selection",
              `Do you want to upload "${result.name}"?`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => setSelectedFile(result) }
              ]
            );
          }
        } catch (error) {
          console.error("Error picking document:", error);
        }
      };

    const renderBankCard = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.bankCard,
                selectedBankID === item.bankID && styles.selectedCard
            ]}
            onPress={() => {
                setSelectedBankID(item.bankID);
                console.log('Selected Bank ID:', item.bankID);
            }}
        >
            <Text style={styles.bankCardTitle}>{item.bankTitle}</Text>
            <Text style={styles.bankCardRemaining}> {item.remainingBankAmount}</Text>
        </TouchableOpacity>
    );

    const renderCategories = ({ item }) => {
        const isSelected = transactionCategory === item.name;
        return (
            <TouchableOpacity
          style={[
            styles.radioButton,
            isSelected && styles.radioSelected,
          ]}
          onPress={() => handleCategorySelect(item.name)}
        >
        <View style={styles.inputRow}>
            <Image source={item.image} style={{ width: 20, height: 20 }} />
            <Text style={ transactionCategory === item.name ? styles.radioTextSelected : styles.radioText}>{item.name}</Text>
        </View>
        </TouchableOpacity>
        );
    };

      const renderBudgets = ({ item }) => (
                <TouchableOpacity
                style={[
                styles.radioButton,
                selectedBudget === item.budgetID && styles.radioSelected,  // Highlight selected budget
                ]}
                onPress={() => setSelectedBudget(item.budgetID)} // Update selected budget
            >
                <Text
                style={
                    selectedBudget === item.budgetID
                    ? styles.radioTextSelected
                    : styles.radioText
                }
                >
                {item.budgetTitle.charAt(0).toUpperCase() + item.budgetTitle.slice(1)}  {/* Format the budget title */}
                </Text>
            </TouchableOpacity>
      );

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');

                if (!token) {
                    console.error('No Token Found');
                    return;
                }

                const response = await fetch(`https://ffm-application-midterm.onrender.com/budgets`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setBudgets(data);
                } else {
                    console.error('Failed to fetch budgets:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        fetchBudgets();
    }, []);

    const fetchBanks = async () => { // Awaiting Banks JSON To Return BankID
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("access_token");
    
          if (!token) {
            console.error('No Token Found');
            return;
          }
    
          const response = await fetch('https://ffm-application-midterm.onrender.com/banks', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            setBanks(data);
          } else {
            console.error('Failed To Fetch Banks:', response.statusText);
          }
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

    // Add Transaction
    const addTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                console.error('Missing required data');
                return;
            }

            const response = await fetch(`https://ffm-application-midterm.onrender.com/add-transaction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
                body: JSON.stringify({
                    transactionTitle,
                    transactionDesc,
                    transactionType: transactionType.trim().toUpperCase(),
                    transactionCategory: transactionCategory.trim().toUpperCase(),
                    transactionAmount: transactionAmount.trim(),
                    transactionDate: transactionDate.trim(),
                    transactionTime: transactionTime.trim(),
                    budgetID: selectedBudget,
                }),
            });
            console.log(transactionDate);
            console.log(transactionTime);
            console.log(transactionCategory);
            const data = await response.json();

            if (response.ok) {
                alert(data.message)
                navigation.goBack();
            } else {
            alert(data.error)
            }
        } catch (error) {
            console.error(error.message);
            alert('An Error Occurred: ' + error.message);
        }
    };

    return (
    <View style={styles.screen}>
        <InAppBackground>
        <BackButton goBack={navigation.goBack} />
            <View style={styles.card}>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="$0.00"
                        value={transactionAmount}
                        onChangeText={setTransactionAmount} // No formatting while typing
                        onBlur={() => setTransactionAmount(transactionAmount)} // Format when input loses focus
                        style={styles.inputAmount}
                        keyboardType="numeric"
                        returnKeyType="done"
                        placeholderTextColor="white"
                    />
                    <View style={styles.radioContainer}>
                    {Object.values(TransactionType).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.radioButton,
                                transactionType === type && styles.radioSelected,
                            ]}
                            onPress={() => setTransactionType(type)}
                        >
                            <Text style={transactionType === type ? styles.radioTextSelected : styles.radioText}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                </View>
                <View>
                <TextInput
                        placeholder="Title"
                        value={transactionTitle}
                        onChangeText={setTransactionTitle}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Description"
                        value={transactionDesc}
                        onChangeText={setTransactionDesc}
                        style={styles.input}
                    />
                </View>
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
                    <Text>Loading Categories...</Text>
                )}
                </View>

                <View>
                <Text style={styles.sectionTitle}>Banks</Text>
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
                </View>
                {showPicker && (
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date}
                        onChange={onChange}
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
                            <Text style={{color: "white"}}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[
                            styles.button,
                            styles.pickerButton,
                            { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={confirmIOSDate}
                        >
                            <Text style={{color: "white"}}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!showPicker && (
                    <Pressable
                        onPress={toggleDatepicker}
                    >
                        <TextInput
                            placeholder="Date"
                            value={transactionDate}
                            onChangeText={onChange}
                            style={styles.input}
                            editable={false}
                            onPressIn={toggleDatepicker}
                        />
                    </Pressable>
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
                            <Text style={{color: "white"}}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.pickerButton, { backgroundColor: theme.colors.primary }]}
                            onPress={confirmIOSTime}
                        >
                            <Text style={{color: "white"}}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!showTimePicker && (
                    <Pressable onPress={toggleTimepicker}>
                        <TextInput
                            placeholder="Time"
                            value={transactionTime}
                            onChangeText={setTransactionTime}
                            style={styles.input}
                            editable={false}
                            onPressIn={toggleTimepicker}
                        />
                    </Pressable>
                )}

                <View style={styles.container}>
                <FlatList
                    data={budgets}
                    renderItem={renderBudgets}
                    keyExtractor={(item) => item?.budgetID}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.radioContainer}
                    />
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Attach Document (Optional)</Text>

                    <TouchableOpacity onPress={pickDocument} style={styles.attachmentButton}>
                        <Text style={styles.attachmentButtonText}>Choose File</Text>
                    </TouchableOpacity>

                    {selectedFile && (
                        <View style={styles.filePreview}>
                            <Icon name="file-document-outline" size={20} color="gray" />
                            <Text style={styles.fileName}>{selectedFile.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedFile(null)}>
                                <Icon name="close-circle" size={18} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </View>
            <Button mode="contained" onPress={addTransaction}>Add</Button>
        </InAppBackground>
    </View>
    );
}

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
        },

        card: {
            margin: 10,
            padding: 10,
        },

        input: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
            backgroundColor: '#f9f9f9',
            padding: 5,
            borderRadius: 8,
            fontSize: 14,
            color: '#333',
            marginBottom: 15,
            fontFamily: theme.fonts.medium.fontFamily,
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

        radioButton: {
            padding: 10,
            marginHorizontal: 5,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.surface,
            borderRadius: 10,
            backgroundColor: "#181818",
        },

        radioSelected: { backgroundColor: theme.colors.primary },
        radioText: { color: theme.colors.surface, fontFamily: theme.fonts.medium.fontFamily},
        radioTextSelected: { color: theme.colors.textSecondary, fontFamily: theme.fonts.bold.fontFamily },
          pickerContainer: {
            width: '100%',
          },
          placeholderStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
          },
          textStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
          },
          listItemLabelStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
          },
          dropDownContainerStyle: {
            backgroundColor: '#f9f9f9',
            borderColor: theme.colors.secondary,
            borderWidth: 2,
          },

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

          categoryContainer: {
            flexDirection: "row",
            marginVertical: 10,
          },
          
          categoryButton: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            marginHorizontal: 5,
            backgroundColor: "#f9f9f9",
          },
          
          categorySelected: {
            backgroundColor: theme.colors.primary,
          },
          
          categoryText: {
            fontSize: 14,
            color: theme.colors.text,
          },
          
          categoryTextSelected: {
            color: "white",
          },
          
          sectionTitle: {
            fontSize: 18,
            fontFamily: theme.fonts.bold.fontFamily,
            marginBottom: 5,
            color: "#ffffff",
          },
          attachmentButton: {
            backgroundColor: theme.colors.background,
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
            marginVertical: 10,
            borderWidth: 2,
            borderColor: theme.colors.secondary,
          },
          
          attachmentButtonText: {
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.bold.fontFamily,
          },
          
          filePreview: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#e8f5e9",
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          },
          
          fileName: {
            fontSize: 14,
            marginLeft: 8,
            color: theme.colors.text,
            flex: 1,
          },
          
          fileAttached: {
            fontSize: 12,
            color: "green",
            marginTop: 5,
            fontWeight: "bold",
          },
          bankContainer: {
            flexDirection: "row",
            marginVertical: 10,
          },
          inputAmount: {
            width: "50%",
            borderBottomWidth: 2,
            borderColor: theme.colors.primary,
            padding: 10,
            fontSize: 20,
            color: "white",
            fontFamily: theme.fonts.bold.fontFamily,
            textAlign: "left",
            margin: 15,
          },
          bankCard: {
            backgroundColor: '#333',
            padding: 10,
            borderRadius: 8,
            marginHorizontal: 10,
            marginVertical: 10,
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
            color: '#fff',
            fontSize: 16,
            fontFamily: theme.fonts.medium.fontFamily,
            marginBottom: 5,
            textAlign: 'center',
        },
    
        bankCardRemaining: {
            color: '#fff',
            fontSize: 14,
            fontFamily: theme.fonts.medium.fontFamily,
            textAlign: 'center',
        },
    });