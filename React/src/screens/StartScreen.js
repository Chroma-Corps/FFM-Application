import React from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import ArrowButton from '../components/ArrowButton'
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { theme } from '../core/theme'

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.startScreenContainer}>
      <Background justifyContent='flex-start'>
        {/* <SafeAreaView style={{ width: '100%' }}>
          <Carousel />
        </SafeAreaView> */}

        <View style={{ alignItems: 'center', width: '100%', marginTop: 40 }}>
          <Header fontSize={60}>Welcome</Header>
          <Paragraph>
            Ready to take control of your finances with confidence?
            Let's build a smart, sustainable budget that works for you—one step at a time
          </Paragraph>

          <Image
            source={require('../assets/start_screen_image.png')}
          />

          <Paragraph>
            Track. Save. Succeed. Your financial journey starts here!
          </Paragraph>
        </View>

        <View style={{ alignItems: 'center', width: '70%', marginTop: 80 }}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            Preview Demo
          </Button>
        </View>


        <ArrowButton direction="right" onPress={() => navigation.navigate('SetupCircleScreen')} />

      </Background >
    </View >
  )
}

const styles = StyleSheet.create({
  startScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
})