import React from 'react'
import { StyleSheet } from 'react-native'
import {FAB} from 'react-native-paper';
import { theme } from '../core/theme'

export default function PlusFAB({style, onPress}) {
    return (
        <FAB 
            style={[styles.fab, style, {backgroundColor: "#fff"}]} 
            icon="plus"
            onPress={onPress}
            color={theme.colors.secondary}
        />
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute', 
        right: 16,
        bottom: 16,
        margin: 16,
        borderWidth: 3,
        borderColor: theme.colors.primary
    },
})
