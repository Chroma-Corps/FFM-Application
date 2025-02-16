import React from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Header>Dashboard</Header>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
}