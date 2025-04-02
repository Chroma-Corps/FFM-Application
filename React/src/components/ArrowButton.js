import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ArrowButton({ onPress, direction = 'right' }) {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const positionStyle = direction === 'left'
        ? { left: 20, right: 'auto' }
        : { right: 20, left: 'auto' };

    if (isKeyboardVisible) {
        return null; // This will hide the button when the keyboard is active becasue I can't find anotherway to hide it (Rynnia.R)
    }

    return (
        <TouchableOpacity
            style={[styles.arrowButton, positionStyle]}
            onPress={onPress}
        >
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
