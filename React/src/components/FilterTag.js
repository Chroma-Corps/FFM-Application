import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const FilterTag = ({ label, shape = "rectangular", onPress, isSelected }) => {

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
                getTagStyle()
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
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "white",
        marginHorizontal: 5,
    },

    round: {
        borderRadius: 20,
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

export default FilterTag;
