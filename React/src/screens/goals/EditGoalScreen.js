import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import InAppHeader from '../../components/InAppHeader';
import Button from '../../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import InAppBackground from '../../components/InAppBackground';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import FilterTag from '../../components/FilterTag';
import ButtonSmall from '../../components/ButtonSmall';
import DateSelector from '../../components/DateSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorTray from '../../components/ColorTray'

export default function EditGoalScreen({ navigation, route }) {
    const { goalID } = route.params;
    const [goalTitle, setGoalTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [goalType, setGoalType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#');

    const handleColorSelect = (color) => {
        setSelectedColor(color);
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

    const isFormValid = () => {
        if (!goalTitle || !targetAmount || !goalType || !startDate || !endDate) return false;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) return false;
        return true;
    };

    const formatDate = (date) => {
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return '--';
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const [year, month, day] = date.split("-");
        return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
    };

    const displayGoalPeriod = () => {
        if (!startDate || !endDate) return '--';

        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (end < start) return 'Invalid Date Range';

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);
    
        return `${formattedStart} - ${formattedEnd}`;
    };

    const formatDateToISO = (dateString) => {
        // Expects: "Wed, 01 Jan 2025"
        const cleaned = dateString.replace(/^.*?,\s*/, '').trim(); // → "01 Jan 2025"
        const [day, monthStr, year] = cleaned.split(' ');
    
        const monthMap = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
            Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };
    
        const month = monthMap[monthStr];
        if (!day || !month || !year) return null;
    
        return `${year}-${month}-${day.padStart(2, '0')}`;
    };
    

    const fetchGoal = async () => {
        try {
            const response = await fetch(`https://ffm-application-main.onrender.com/goal/${goalID}`);
            const data = await response.json();
            
            if (response.ok) {
                // Goal Details
                setGoalTitle(data.goal.goalTitle);
                setTargetAmount(data.goal.targetAmount);
                setGoalType(data.goal.goalType);
                setStartDate(data.goal.startDate);
                setEndDate(data.goal.endDate);
                setSelectedColor(data.goal.color);
            } else {
                console.error(data.message);
            }
            console.log('Fetch Goal Status:', data.status);
        } catch (error) {
            console.error('Error Fetching Goal:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchGoal();
        }, [])
    );

    // Update Goal API Call
        const updateGoal = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const formattedStartDate = formatDateToISO(startDate);
                const formattedEndDate = formatDateToISO(endDate);
    
                if (!token) {
                    console.error('Missing Required Data');
                    return;
                }

                const response = await fetch(`https://ffm-application-main.onrender.com/goal/${goalID}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        goalTitle: goalTitle,
                        goalType: goalType.trim().toUpperCase(),
                        targetAmount: parseFloat(targetAmount.replace(/[^0-9.-]+/g, '')),
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        color: selectedColor
                    }),
                });
    
                const data = await response.json();
    
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

return (
    <View style={styles.editGoalScreen}>
        <InAppBackground>
            <BackButton goBack={navigation.goBack} />

            {showStartDatePicker && (
                <DateSelector
                    showDatePicker={showStartDatePicker}
                    onSave={handleStartDateSave}
                    onCancel={handleStartDateCancel}
                />
            )}

            {showEndDatePicker && (
                <DateSelector
                    showDatePicker={showEndDatePicker}
                    onSave={handleEndDateSave}
                    onCancel={handleEndDateCancel}
                />
            )}
            <KeyboardAvoidingView
                                style={{ flex: 1 }}
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                <View>
                    <View style={styles.headerContainer}>
                        <View style={styles.cardTitle}>
                            <InAppHeader>Edit Goal</InAppHeader>
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
                         <Text style={styles.defaultText}>Goal Type</Text>
                        {/* Filter Tags - Goal Type */}
                        <View style={styles.filterTagsContainer}>
                            {goalType === 'Savings' && (
                                <FilterTag
                                    label="Savings"
                                    isSelected={true}
                                    onPress={null}
                                />
                            )}

                            {goalType === 'Expense' && (
                                <FilterTag
                                    label="Expense"
                                    isSelected={true}
                                    onPress={null}
                                />
                            )}
                        </View>

                        <Text style={styles.defaultText}>Starting:</Text>

                        <ButtonSmall
                            label={startDate}
                            onPress={handleShowStartDatePicker}
                            mode="contained"
                        />

                        <Text style={styles.defaultText}>Until:</Text>
                            
                            <ButtonSmall
                                label={endDate}
                                onPress={handleShowEndDatePicker}
                                mode="contained"
                            />
                        <Text style={[styles.defaultText, { marginTop: 35 }]}>Goal Period</Text>
                        <Text style={[styles.defaultText, { fontSize: 16, color: theme.colors.primary }]}>
                            {displayGoalPeriod()}
                        </Text>
                    </View>
                </View>
                <ColorTray 
                    selectedColor={selectedColor} 
                    onColorSelect={handleColorSelect}
                />
            </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={updateGoal}
                    style={styles.buttonStyle}
                    disabled={!isFormValid()}
                >
                    Update Goal
                </Button>
            </View>
        </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    editGoalScreen: {
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