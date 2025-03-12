import React, { useState } from 'react';
import { Button, View, Modal, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { theme } from '../core/theme';

export default function DateSelector({ showDatePicker, setStartDate, onSave, onCancel }) {
    const [selectedDate, setSelectedDate] = useState(null);

    // Handle date selection
    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    const handleSave = () => {
        if (selectedDate) {
            onSave(selectedDate);
        }
        onCancel();
    };

    return (
        <Modal transparent={true} visible={showDatePicker} animationType='fade'>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Select Date</Text>

                    <Calendar
                        markedDates={{
                            [selectedDate]: {
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
                            onPress={onCancel}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '80%',
        maxWidth: 350,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
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
        gap: 20,
    },
});
