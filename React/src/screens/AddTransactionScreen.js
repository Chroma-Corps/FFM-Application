import React, { useState, useEffect } from 'react';
import { View, 
         Text, 
         StyleSheet, 
         TextInput, 
         TouchableOpacity,
         Pressable,
         Platform } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import { Card } from 'react-native-paper';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../components/Button';
import TransactionType from '../constants/TransactionTypes';
import TransactionCategories from '../constants/TransactionCategories';
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';




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


    //Date/Time Spinner
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }, selectedDate) =>{
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);

            if (Platform.OS === "android") {
                toggleDatepicker();
                setTransactionDate(currentDate.toDateString());
            }
        } else {
            toggleDatepicker();
        }
    };

    const confirmIOSDate = () => {
        setTransactionDate(date.toDateString());
        toggleDatepicker();
    }

    const toggleTimepicker = () => {
        setShowTimePicker(!showTimePicker);
    };
    
    const onTimeChange = ({ type }, selectedTime) => {
        if (type === "set") {
            const currentTime = selectedTime;
            setTime(currentTime);
    
            if (Platform.OS === "android") {
                toggleTimepicker();
                setTransactionTime(currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
            }
        } else {
            toggleTimepicker();
        }
    };
    
    const confirmIOSTime = () => {
        setTransactionTime(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        toggleTimepicker();
    };



    //Currency Formatting 
    const formatCurrency = (value) => {
        let cleanedValue = value.replace(/[^0-9.]/g, "");
      
        const parts = cleanedValue.split(".");
        if (parts.length > 2) {
          cleanedValue = parts[0] + "." + parts.slice(1).join("");
        }

        let numericValue = parseFloat(cleanedValue);
        if (isNaN(numericValue)) return "";
      
        return `$${numericValue.toFixed(2)}`; // Always show two decimal places
      };


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


      

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const userID = await AsyncStorage.getItem('user_id');

                if (!token || !userID) {
                    console.error('No Token or UserID Found');
                    return;
                }

                const response = await fetch(`${API_URL_DEVICE}/budgets/${userID}`, {
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

    // Add Transaction
    const addTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const userID = await AsyncStorage.getItem('user_id');

            if (!token || !userID) {
            console.error('Missing required data');
            return;
            }

            const response = await fetch(`${API_URL_DEVICE}/add-transaction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                transactionTitle,
                transactionDesc,
                transactionType,
                transactionCategory,
                transactionAmount,
                transactionDate,
                transactionTime,
                budgetID: selectedBudget,
            }),
            });
            
            const data = await response.json();

            if (response.ok) {
                alert(data.message)
                navigation.goBack();
            } else {
            alert(data.error)
            }
        } catch (error) {
            alert(data.error)
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.screen}>
                <InAppBackground>
                    <InAppHeader>Add Transaction</InAppHeader>

                    <Card style={styles.card}>
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
                        <TextInput
                            placeholder="Transaction Title"
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

                        <Text style={styles.sectionTitle}> Select Category </Text>
                        <View style={styles.radioContainer}>
                        
                            {Object.values(TransactionCategories).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.radioButton,
                                        transactionCategory === type && styles.radioSelected,
                                    ]}
                                    onPress={() => setTransactionCategory(type)}
                                >
                                    <Text style={transactionCategory === type ? styles.radioTextSelected : styles.radioText}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>


                        <Text style={styles.sectionTitle}>Enter Amount</Text>
                        <TextInput
                            placeholder="$0.00"
                            value={transactionAmount}
                            onChangeText={setTransactionAmount} // No formatting while typing
                            onBlur={() => setTransactionAmount(formatCurrency(transactionAmount))} // Format when input loses focus
                            style={styles.input}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />


                        
                        
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
                                style={{ flexDirection: "row",
                                    justifyContent: "space-around" }}>
                                <TouchableOpacity style={[
                                    styles.button,
                                    styles.pickerButton,
                                    { backgroundColor: '#ffffff' },
                                ]}
                                onPress={toggleDatepicker}
                                >
                                    <Text>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[
                                    styles.button,
                                    styles.pickerButton,
                                    { backgroundColor: '#ffffff' },
                                ]}
                                onPress={confirmIOSDate}
                                >
                                    <Text>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {!showPicker && (
                            <Pressable
                                onPress={toggleDatepicker}
                            >
                                <TextInput
                                    placeholder="Date (YYYY-MM-DD)"
                                    value={transactionDate}
                                    onChangeText={setTransactionDate}
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
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <TouchableOpacity
                                    style={[styles.button, styles.pickerButton, { backgroundColor: '#181818' }]}
                                    onPress={toggleTimepicker}
                                >
                                    <Text>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.pickerButton, { backgroundColor: '#181818' }]}
                                    onPress={confirmIOSTime}
                                >
                                    <Text>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {!showTimePicker && (
                            <Pressable onPress={toggleTimepicker}>
                                <TextInput
                                    placeholder="Time (HH:MM AM/PM)"
                                    value={transactionTime}
                                    onChangeText={setTransactionTime}
                                    style={styles.input}
                                    editable={false}
                                    onPressIn={toggleTimepicker}
                                />
                            </Pressable>
                        )}



                        <View style={styles.container}>
                            <DropDownPicker
                                open={open}
                                value={selectedBudget}
                                items={[
                                { label: 'No Budget', value: null },
                                ...(Array.isArray(budgets) ? budgets : []).map((budget) => ({
                                    label: budget.budgetTitle,
                                    value: budget.budgetID,
                                })),
                                ]}
                                setOpen={setOpen}
                                setValue={setSelectedBudget}
                                containerStyle={styles.pickerContainer}
                                placeholder="Choose Budget"
                                placeholderStyle={styles.placeholderStyle}
                                textStyle={styles.textStyle}
                                listItemLabelStyle={styles.listItemLabelStyle}
                                dropDownContainerStyle={styles.dropDownContainerStyle}
                            />
                        </View>


                        <View>
                            <Text style={styles.sectionTitle}>Attach Document (Optional)</Text>
  
                            <TouchableOpacity onPress={pickDocument} style={styles.attachmentButton}>
                                <Text style={styles.attachmentButtonText}>Choose File</Text>
                            </TouchableOpacity>

                            {selectedFile && (
                             <View style={styles.filePreview}>
                                <Text style={styles.fileName}>{selectedFile.name}</Text>
                                <Text style={styles.fileAttached}>✅ Document Attached</Text>
                            </View>
                            )}
                        </View>



                    </Card>
                    <BackButton goBack={navigation.goBack} />
                    <Button onPress={addTransaction} style={styles.button}>
                        Add
                    </Button>
                </InAppBackground>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>  
    );
    }

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            justifyContent: 'space-between',
        },

        card: {
            flex: 1,
            margin: 10,
            padding: 25,
            backgroundColor: '#181818',
            borderColor: theme.colors.secondary,
            borderWidth: 2,
            borderRadius: 10,
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

        button: { marginBottom: 0, },

        radioContainer: { 
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
        },

        radioButton: {
            padding: 10,
            marginHorizontal: 5,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.surface,
            borderRadius: 5,
            backgroundColor: "#181818",
        },

        radioSelected: { backgroundColor: theme.colors.primary },
        radioText: { color: theme.colors.surface, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 },
        radioTextSelected: { color: "white" },

        container: {
            padding: 15,
          },
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
            margin: -10,
            backgroundColor: '#ffffff',
          },
          pickerButton: {
            paddingHorizontal: 20,
            paddingVertical: 10,
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
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 5,
            color: "#ffffff",
          },
          attachmentButton: {
            backgroundColor: theme.colors.primary,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginVertical: 10,
          },
          
          attachmentButtonText: {
            color: "white",
            fontWeight: "bold",
          },
          
          filePreview: {
            marginTop: 10,
            padding: 10,
            backgroundColor: "#e8f5e9", // Light green to indicate success
            borderRadius: 5,
            alignItems: "center",
          },
          
          fileName: {
            fontSize: 14,
            color: theme.colors.text,
            fontWeight: "bold",
          },
          
          fileAttached: {
            fontSize: 12,
            color: "green",
            marginTop: 5,
            fontWeight: "bold",
          },
    });