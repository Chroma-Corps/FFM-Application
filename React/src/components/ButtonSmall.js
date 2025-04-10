import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const ButtonSmall = ({ label, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[styles.tag, style]}
            onPress={onPress}
        >
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.colors.primaryDimmed,
        marginHorizontal: 5,
    },
    selected: {
        backgroundColor: theme.colors.primary,
        borderColor: 'black',
    },
    text: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: "center",
    },
    selectedText: {
        color: "white",
    },
});

export default ButtonSmall;
