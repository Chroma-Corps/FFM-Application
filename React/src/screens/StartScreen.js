import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { theme } from '../core/theme';
import ArrowButton from '../components/ArrowButton';
import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import StartSlider from '../components/StartSlider';

export default function StartScreen({ navigation }) {
  const [startImages] = useState([
    {
      image: require('../assets/pig_bank.png'),
    },
    {
      image: require('../assets/bank_or_pig.png'),
    },
    {
      image: require('../assets/search_pig.png'),
    },
  ]);

  return (
    <View style={styles.startScreenContainer}>
      <Background justifyContent='center'>
        <View style={{ alignItems: 'center'}}>
          <Header fontSize={50}>Welcome!</Header>
          <Header fontSize={20}>Track. Save. Succeed.</Header>
          <Paragraph style={{ marginTop: 10 }}>
             Your financial journey starts here!
          </Paragraph>
        </View>

          {/* Image */}
          {/* <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/PigBank.png')}
              style={{
                width: '100%',
                maxWidth:400, 
                height: undefined, 
                aspectRatio: 1,
                resizeMode: 'contain',
              }}
            />
          </View> */}

                <View style={styles.sliderContainer}>
                  <StartSlider
                      data={startImages}
                      width={350}
                      height={350}
                  />
                    </View>
        <View style={{ alignItems: 'center', width: '100%'}}>
          <Paragraph>
            Let's build a smart, sustainable budget that works for you—one step at a time.
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
