import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
// import { SafeAreaView } from "react-native";
// import Carousel from "./components/Carousel";

export default function StartScreen({ navigation }) {
  return (
    <Background>

      {/* <SafeAreaView>
        <Carousel />
      </SafeAreaView> */}

      <Header>Welcome</Header>

      <Paragraph>
        Are you ready to be finaincialy stable :D
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
  )
}
