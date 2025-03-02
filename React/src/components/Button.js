import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      theme={{
        colors: {
          ...theme.colors,
          outline: theme.colors.primary,
        },
      }}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    borderRadius: 8
  },
  text: {
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
})
