import React from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import Carousel from '../components/Carousel';
import ArrowButton from '../components/ArrowButton';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../core/theme';


export default function MainAuthScreen({ navigation }) {

    return (
        <View style={styles.startScreenContainer}>
            <Background>

                <View style={{ height: 70 }} />

                <Carousel />

                <View style={styles.contentBlock}>
                    <Header>Let's Get Started</Header>
                    <Paragraph>
                        Ready to take charge of your money?
                        Sign up or log in to start budgeting smarter today.
                    </Paragraph>


                    <View style={{ height: 20 }} />

                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('LoginScreen')}
                        style={styles.button}
                    >
                        Login
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('RegisterScreen')}
                        style={styles.button}
                    >
                        Sign Up
                    </Button>
                </View>

                <View style={{ flex: 1 }} />

                <ArrowButton direction="left" onPress={() => navigation.navigate('StartScreen')} />

            </Background>
        </View>
    );
}

const styles = StyleSheet.create({
    startScreenContainer: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    contentBlock: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    button: {
        width: '100%',
        marginVertical: 8,
    }
});