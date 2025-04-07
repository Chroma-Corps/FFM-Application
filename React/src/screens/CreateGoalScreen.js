import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import FilterTag from '../components/FilterTag';
import ButtonSmall from '../components/ButtonSmall';
import DateSelector from '../components/DateSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateGoalsScreen({ navigation }) {

    const [goalTitle, setGoalTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [goalType, setGoalType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const formatDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
        const [year, month, day] = date.split("-");
        return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
    };

    const handleAmountChange = (value) => {
        setTargetAmount(value);
    };

    const handleShowStartDatePicker = () => {
        setShowStartDatePicker(true);
    };

    const handleShowEndDatePicker = () => {
        setShowEndDatePicker(true);
    };

    const handleStartDateSave = (date) => {
        setStartDate(date);
        setShowStartDatePicker(false);
    };

    const handleStartDateCancel = () => {
        setShowEndDatePicker(false);
    };

    const handleEndDateSave = (date) => {
        setEndDate(date);
        setShowStartDatePicker(false);
    };

    const handleEndDateCancel = () => {
        setShowEndDatePicker(false);
    };

    const displayGoalPeriod = () => {
        if (!startDate || !endDate) return '--';

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        return `${formattedStart} - ${formattedEnd}`;
    };

    const createGoal = async () => {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
            console.error('No Token Found');
            return;
        }

        if (!goalTitle || !startDate || !endDate || !targetAmount || !goalType) {
            Alert.alert('Error', 'Please Fill In All Fields');
            return;
        }

        try {
            const response = await fetch(`http://192.168.0.10:8080/create-goal`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    goalTitle: goalTitle.trim(),
                    targetAmount: targetAmount,
                    goalType: goalType.toUpperCase(),
                    startDate: startDate,
                    endDate: endDate,
                })
            });

            if (response.ok) {
                Alert.alert('Success', 'Goal Created Successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed To Create Goal');
                console.error(response.statusText);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
        }
    };

return (
    <View style={styles.createGoalScreen}>
        <InAppBackground>
            <BackButton goBack={navigation.goBack} />

            {showStartDatePicker && (
                <DateSelector
                    showDatePicker={showStartDatePicker}
                    onSave={handleStartDateSave}
                    onCancel={handleEndDateCancel}
                />
            )}

            {showEndDatePicker && (
                <DateSelector
                    showDatePicker={showEndDatePicker}
                    onSave={handleEndDateSave}
                    onCancel={handleEndDateCancel}
                />
            )}
            
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                <View>
                    <View style={styles.headerContainer}>
                        <View style={styles.cardTitle}>
                            <InAppHeader>New Goal</InAppHeader>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={styles.cardTopHalfContainer}>
                        <TextInput
                            placeholderTextColor="rgba(255, 255, 255, 0.25)"
                            placeholder="Enter Title"
                            value={goalTitle}
                            onChangeText={setGoalTitle}
                            style={[styles.input, styles.defaultText, isFocused ? styles.focused : null]}
                        />

                        <TextInput
                            placeholderTextColor="rgba(255, 255, 255, 0.25)"
                            placeholder="$0.00"
                            value={targetAmount}
                            onChangeText={handleAmountChange}
                            style={[styles.input, styles.shortInput, styles.defaultText]}
                            keyboardType="numeric"
                        />
                         <Text style={styles.defaultText}>Select Goal Type</Text>
                        {/* Filter Tags - Goal Type */}
                        <View style={styles.filterTagsContainer}>
                            <FilterTag
                                label="Savings"
                                isSelected={goalType === 'Savings'}
                                onPress={() => setGoalType('Savings')}
                            />
                            <FilterTag
                                label="Expense"
                                isSelected={goalType === 'Expense'}
                                onPress={() => setGoalType('Expense')}
                            />
                        </View>

                        <Text style={styles.defaultText}>Starting:</Text>

                        <ButtonSmall
                            label={
                                startDate
                                    ? `${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`
                                    : 'Select Date'
                            }
                            onPress={handleShowStartDatePicker}
                            mode="contained"
                        />

                        <Text style={styles.defaultText}>Until:</Text>
                            
                            <ButtonSmall
                                label={
                                    endDate
                                        ? `${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`
                                        : 'Select Date'
                                }
                                onPress={handleShowEndDatePicker}
                                mode="contained"
                            />
                        <Text style={[styles.defaultText, { marginTop: 35 }]}>Goal Period</Text>
                        <Text style={[styles.defaultText, { fontSize: 16, color: theme.colors.primary }]}>
                            {displayGoalPeriod()}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={createGoal} style={styles.buttonStyle}>
                    Create Goal
                </Button>
            </View>
        </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    createGoalScreen: {
        flex: 1,
        justifyContent: 'flex-start',
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

    buttonContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        padding: 10,
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

    defaultText: {
        fontSize: 20,
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        lineHeight: 20,
        margin: 10,
    },

    focused: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },

    filterTagsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
});