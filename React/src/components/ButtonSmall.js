import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const ButtonSmall = ({ label, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[styles.tag, style]}
            onPress={onPress} // Handle onPress
        >
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: theme.colors.primary,
        marginHorizontal: 5,
    },
    selected: {
        backgroundColor: theme.colors.primary,
        borderColor: 'black',
    },
    text: {
        color: "#000",
        fontFamily: theme.fonts.bold.fontFamily,
        fontWeight: "bold",
        textAlign: "center",
    },
    selectedText: {
        color: "white",
    },
});

export default ButtonSmall;
