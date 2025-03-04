import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { theme } from '../core/theme'

export default function EditButton() {
    return (
        <TouchableOpacity style={styles.container}>
            <Image
                style={[styles.image, styles.imageColor]}
                source={require('../assets/edit_button.png')}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 15 + getStatusBarHeight(),
        right: 15, // Changed from left to right
    },
    image: {
        width: 26,
        height: 26,
    },
    imageColor: {
        tintColor: theme.colors.surface,
    },
})
