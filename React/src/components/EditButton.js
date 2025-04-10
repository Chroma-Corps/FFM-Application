import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useNavigation } from '@react-navigation/native'
import { theme } from '../core/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EditButton({ navigateTo, params = {} }) {
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate(navigateTo, params)}
            hitSlop={100}
        >

            <Icon
                name="pencil-outline"
                size={28}
                color={theme.colors.surface}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20 + getStatusBarHeight(),
        right: 15,
    },

})