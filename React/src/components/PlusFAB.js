import React from 'react'
import { StyleSheet } from 'react-native'
import {FAB} from 'react-native-paper';

export default function PlusFAB({style}) {
    return (
        <FAB 
        style = {[styles.fab, style]}
        icon="plus"
        onPress={() => {console.log("Pressed!");}}
        />
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute', 
        right: 16,
        bottom: 16,
        margin: 16,
    },
})
