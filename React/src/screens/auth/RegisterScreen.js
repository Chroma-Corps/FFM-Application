import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { nameValidator } from '../../helpers/nameValidator'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    setLoading(true);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      // 1. Register the user
      const registerResponse = await fetch('https://ffm-application-main.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      });

      const registerData = await registerResponse.json();

      if (registerData.status !== 'success') {
        alert(registerData.message || 'Registration failed.');
        return;
      }

      // 2. Log the user in
      const loginResponse = await fetch('https://ffm-application-main.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginData.status === 'success') {
        await AsyncStorage.setItem('access_token', loginData.access_token);
        await AsyncStorage.setItem('user_name', name.value);
        await AsyncStorage.setItem('user_email', email.value);

        navigation.navigate('SelectCircleTypeScreen');
      } else {
        alert('Login failed after registration.');
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Header>Happy To Have You!</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
        loading={loading}
      >
        Sign Up
      </Button>
      {/* <Text style={styles.orText}>- Or SignUp With -</Text>
      <Button mode="outlined" icon="google">Google</Button> */}
      <View style={[styles.row, { marginTop: 50 }]}>
        <Text style={styles.loginLabel}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },

  link: {
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },

  orText: {
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: theme.fonts.light.fontFamily,
    color: theme.colors.description
  },

  loginLabel: {
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: 15,
    color: theme.colors.description,
  },
})
