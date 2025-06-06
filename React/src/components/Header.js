import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Header({ children, fontSize = 35, style, ...props }) {
  return (
    <Text style={[styles.header, { fontSize }, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  header: {
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.heading,
    width: "100%",
    textAlign: 'center',
    flexWrap: 'wrap',
  },
})
