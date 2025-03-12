import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Header(props) {

  return <Text style={styles.header} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: 45,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.heading,
    paddingVertical: 10,
    width: "100%",
    textAlign: "center"
  },
})
