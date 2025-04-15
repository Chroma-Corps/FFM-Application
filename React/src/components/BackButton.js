import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { theme } from '../core/theme'

export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container} hitSlop={100}>
      <Image
        style={[styles.image, styles.imageColor]}
        source={require('../assets/arrow_back.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12 + getStatusBarHeight(),
    left: 10,
    zIndex: 100,
  },
  image: {
    width: 40,
    height: 40,
  },
  imageColor: {
    tintColor: theme.colors.textSecondary,
  },
})
