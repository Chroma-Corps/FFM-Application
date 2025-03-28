// ToggleSwitch.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { theme } from '../core/theme';

const Toggle = ({ isPrimary, onToggleChange }) => {
    return (
        <View style={styles.container}>
            <ToggleSwitch
                isOn={isPrimary}             // Pass current state
                onColor="#81C784"              // Color when the toggle is ON
                offColor="gray"              // Color when the toggle is OFF
                labelStyle={styles.label}    // Customize the label text style
                size="medium"                 // Size of the switch (small/medium/large)
                onToggle={onToggleChange}    // Trigger the function on toggle change
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    text: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 18,
        color: 'white',
    },

    label: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 16,
        color: 'white',
    },
});

export default Toggle;
