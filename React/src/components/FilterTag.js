import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const FilterTag = ({ label, shape = "rectangular", onPress, isSelected }) => {
    return (
        <TouchableOpacity
            style={[styles.tag, isSelected && styles.selected, shape === 'round' && styles.round]}
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
        fontWeight: "bold",
        textAlign: "center",
    },
    selectedText: {
        color: "white",
    },
});

export default FilterTag;
