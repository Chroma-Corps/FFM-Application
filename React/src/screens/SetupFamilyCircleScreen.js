import React from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import ArrowButton from '../components/ArrowButton'
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { theme } from '../core/theme'

export default function SetupFamilyCircleScreen({ navigation, route }) {

    const { selectedCircleType } = route.params

    return (
        <View style={styles.startScreenContainer}>
            <Background justifyContent='flex-start'>

                <View style={{ alignItems: 'center', width: '100%', marginTop: 40 }}>
                    <Header fontSize={60}>Setup Family Circle</Header>
                    <Paragraph>
                        This is for setting up create circle fro family
                    </Paragraph>
                </View>

                <View style={{ alignItems: 'center', width: '50%', marginTop: 80 }}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('StartScreen')}
                    >
                        Exit
                    </Button>
                </View>

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