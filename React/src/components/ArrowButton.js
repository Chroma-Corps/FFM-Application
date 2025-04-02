import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../core/theme';

export default function ArrowButton({ onPress, direction = 'right' }) {
    // Dynamic style for positioning
    const positionStyle = direction === 'left'
        ? { left: 20, right: 'auto' } // Positions the button on the left
        : { right: 20, left: 'auto' }; // Positions the button on the right

    return (
        <TouchableOpacity style={[styles.arrowButton, positionStyle]} onPress={onPress}>
            <Icon name={direction === 'left' ? "arrow-back" : "arrow-forward"} size={30} color="#333333" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    arrowButton: {
        position: 'absolute',
        bottom: 20,
        width: 65,
        height: 65,
        borderRadius: 8,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: '#333333',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
