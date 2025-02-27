import React, { useState } from 'react';
import { Button, View, Modal, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { theme } from '../core/theme';

export default function DateRangeSelector({ periodSelectionPickerVisible, setPeriodSelectionPickerVisible, onSave, onCancel }) {
    const [selectedDates, setSelectedDates] = useState({
        startDate: null,
        endDate: null,
    });

    const handleDayPress = (day) => {
        const { startDate, endDate } = selectedDates;

        if (!startDate || (startDate && endDate)) {
            setSelectedDates({ startDate: day.dateString, endDate: null });
        } else {
            if (new Date(day.dateString) < new Date(startDate)) {
                setSelectedDates({ startDate: day.dateString, endDate: null });
            } else {
                setSelectedDates((prevState) => ({
                    ...prevState,
                    endDate: day.dateString,
                }));
            }
        }
    };

    const handleSave = () => {
        onSave(selectedDates.startDate, selectedDates.endDate);
        setPeriodSelectionPickerVisible(false);  // Close the modal after saving
    };

    return (
        <Modal transparent={true} visible={periodSelectionPickerVisible} animationType='fade'>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Select Period</Text>

                    <Calendar
                        markedDates={{
                            [selectedDates.startDate]: {
                                selected: true,
                                selectedColor: theme.colors.primary,
                                selectedTextColor: theme.colors.surface,
                            },
                            [selectedDates.endDate]: {
                                selected: true,
                                selectedColor: theme.colors.primary,
                                selectedTextColor: theme.colors.surface,
                            },
                        }}
                        onDayPress={handleDayPress}
                        markingType="simple"
                        theme={{
                            todayTextColor: theme.colors.primary,
                            dayTextColor: theme.colors.text,
                            textStyle: {
                                fontFamily: theme.fonts.regular.fontFamily,
                                fontSize: 16,
                            },
                        }}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Save"
                            onPress={handleSave}
                            color={theme.colors.primary}
                        />
                        <Button
                            title="Cancel"
                            onPress={() => setPeriodSelectionPickerVisible(false)} // Close modal on cancel
                            color={theme.colors.primary}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%', // dynamic width for responsiveness
        maxWidth: 350, // maximum width to avoid it getting too large on wide screens
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',  // Center align contents within the modal
    },
    title: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
