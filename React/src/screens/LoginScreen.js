import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: 'bob@mail.com', error: '' })
  const [password, setPassword] = useState({ value: 'bobpass', error: '' })
  const [loading, setLoading] = useState(false)

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`https://ffm-application-main.onrender.com/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        await AsyncStorage.setItem('access_token', data.access_token);
        console.log(data.message)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      } else {
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error Logging In:', error)
      alert('An Error Occurred, Please Try Again Later')
    } finally {
      setLoading(false)
    }
  }

  const onSocialGooglePressed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Header>Nice To See You Again!</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={onLoginPressed} loading={loading}>Login</Button>
      <Text style={styles.orText}>- Or Login With -</Text>
      <Button mode="outlined" icon="google">Google</Button>
      <View style={[styles.row, { marginTop: 50 }]}>
        <Text style={styles.signUpLabel}>Don't Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign Up!</Text>
        </TouchableOpacity>
      </View>

    </Background>
  )
}

const styles = StyleSheet.create({

  input: {
    fontFamily: theme.fonts.regular.fontFamily,
    color: theme.colors.text,
    backgroundColor: 'transparent',
    marginBottom: 12,
  },

  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  orText: {
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: theme.fonts.light.fontFamily,
    color: theme.colors.text
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    justifyContent: 'center',
  },

  signUpLabel: {
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: 15,
    color: theme.colors.text,
  },

  link: {
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
})
