import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'

export default function Background({ children, justifyContent = 'center', ...props }) {
  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={[styles.container, { justifyContent }]} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },

  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
})
