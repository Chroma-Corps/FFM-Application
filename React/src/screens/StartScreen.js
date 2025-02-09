import React from 'react'
import Background from '../components/Background'
// import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import Carousel from '../components/Carousel'
import { StyleSheet, View, SafeAreaView, Text } from 'react-native'
import { theme } from '../core/theme'


export default function StartScreen({ navigation }) {
  return (

    <View style={styles.startScreenContainer}>

      <SafeAreaView style={{ width: '100%' }}>
        <Carousel />
      </SafeAreaView>

      <Background>

        <Header>Welcome</Header>

        <Paragraph>
          Ready to take control of your finances with confidence?
          Let's build a smart, sustainable budget that works for you—one step at a time
        </Paragraph>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Login
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          Sign Up
        </Button>
      </Background>
    </View >
  )
}

const styles = StyleSheet.create({
  startScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
})