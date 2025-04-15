import React from 'react';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Paragraph from '../../components/Paragraph';
import Carousel from '../../components/Carousel';
import ArrowButton from '../../components/ArrowButton';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../core/theme';

export default function MainAuthScreen({ navigation }) {

    return (
        <View style={styles.startScreenContainer}>
            <Background>
                <Carousel />
                <View style={styles.contentBlock}>
                    <Header  fontSize={30}>Let's Get Started!</Header>
                    <Paragraph>
                        Ready to take charge of your money?
                        Sign up or log in to start budgeting smarter today.
                    </Paragraph>
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 20
    },

    button: {
        width: '100%',
        marginVertical: 8,
    }
});