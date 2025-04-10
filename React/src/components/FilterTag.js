import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const FilterTag = ({ label, shape = "rectangular", onPress, isSelected, style }) => {

    const getTagStyle = () => {
        if (label === "Savings" && isSelected) {
            return { backgroundColor: '#81C784', borderColor: '#81C784' };
        }
        if (label === "Expense" && isSelected) {
            return { backgroundColor: '#E57373', borderColor: '#E57373' };
        }
        return {};
    };

    return (
        <TouchableOpacity
            style={[
                styles.tag,
                isSelected && styles.selected,
                shape === 'round' && styles.round,
                getTagStyle(),
                style
            ]}
            onPress={onPress}
        >
            <Text style={[styles.text, isSelected && styles.selectedText]}>{label}</Text>
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

    round: {
        borderRadius: 20,
    },

    selected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
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

export default FilterTag;
