// CustomTextField.js
import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const CustomTextField = ({ placeholder, value, onChangeText, style }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleTextChange = (text) => {
        setInputValue(text);
        onChangeText(text); // Propagate the change upwards
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableWithoutFeedback onPress={handleFocus}>
                <View>
                    {inputValue ? (
                        <Text style={styles.text}>{inputValue}</Text> // Display typed text
                    ) : (
                        <Text style={styles.placeholderText}>{placeholder}</Text> // Placeholder text
                    )}
                    {isFocused && (
                        <View style={styles.cursorContainer}>
                            <Text style={styles.cursor}>|</Text> {/* Custom cursor */}
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>

            <View
                style={[
                    styles.underline,
                    isFocused ? styles.focusedUnderline : styles.defaultUnderline,
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        color: '#fff', // Text color
    },
    placeholderText: {
        fontSize: 16,
        color: 'grey', // Placeholder text color
    },
    cursorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cursor: {
        fontSize: 16,
        color: '#fff', // Cursor color
    },
    underline: {
        height: 2,
        marginTop: 4,
    },
    defaultUnderline: {
        backgroundColor: '#fff', // Default underline color
    },
    focusedUnderline: {
        backgroundColor: '#000', // Bold underline color when focused
    },
});

export default CustomTextField;
