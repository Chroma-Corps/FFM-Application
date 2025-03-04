import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`https://ffm-application-test.onrender.com/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      })

      const data = await response.json()

      if(response.ok) {
        console.log('Registration Successful:', data)
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      } else {
        console.error('Registration Failed:', data.message)
        alert(data.message)
      }
    } catch(error) {
      console.error('Error Registering', error)
      alert('An Error Occurred, Please Try Again Later')
    } finally {
      setLoading(false)
    }
  }

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
      <Text style={styles.orText}>- Or SignUp With -</Text>
          <Button mode="outlined" icon="google">Google</Button>
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
    color: theme.colors.text
  },

  loginLabel: {
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: 15,
    color: theme.colors.text,
  },
})
