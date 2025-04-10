import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { theme } from '../core/theme';
import ArrowButton from '../components/ArrowButton';
import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.startScreenContainer}>
      <Background justifyContent='flex-start'>

        <View style={{ alignItems: 'center', width: '100%', marginTop: 40 }}>
          <Header fontSize={60}>Welcome</Header>
          <Paragraph>
            Ready to take control of your finances with confidence?
            Let's build a smart, sustainable budget that works for you—one step at a time.
          </Paragraph>
        </View>

        {/* Image */}
        <View style={{ alignItems: 'center', width: '100%', marginTop: 40 }}>
          <Image
            source={require('../assets/start_screen_image.png')}
          />
        </View>

        <View style={{ alignItems: 'center', width: '100%', marginTop: 20 }}>
          <Header fontSize={25}>Let's get you started on your budgeting journey!</Header>
          <Paragraph style={{ marginTop: 10 }}>
            Track. Save. Succeed. Your financial journey starts here!
          </Paragraph>
        </View>

        {/* Button */}
        <View style={{ alignItems: 'center', width: '70%', marginTop: 20 }}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('PreviewDemoScreen')}
          >
            Preview Demo
          </Button>
        </View>

        <ArrowButton direction="right" onPress={() => navigation.navigate('MainAuthScreen')} />

      </Background >
    </View >
  )
}

const styles = StyleSheet.create({
  startScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
});
