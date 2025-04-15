import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, disabled, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        disabled && { backgroundColor: theme.colors.primaryDimmed },
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
      disabled={disabled}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    width: '80%',
    marginVertical: 10,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: theme.colors.primary
  },
  text: {
    fontFamily: theme.fonts.bold.fontFamily,
    fontSize: 15,
    lineHeight: 26,
  },
})
