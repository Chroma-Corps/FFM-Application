import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text, Card } from 'react-native-paper'
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
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }

    setLoading(true)

    try {
        const response = await fetch(`https://ffm-application-test.onrender.com/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        })

        const data = await response.json()
        console.log(data)

        if (response.ok) {
          await AsyncStorage.setItem('access_token', data.access_token);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        } else {
          console.error('Login Failed:', data.error)
          alert(data.error)
        }
    } catch(error) {
      console.error('Error Loggin In', error)
      alert('An Error Occurred, Please Try Again Later')
    } finally {
      setLoading(false)
    }

  const onSocialGooglePressed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }

  const onSocialFacebookPressed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Header>Welcome back.</Header>
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
              <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={onLoginPressed}
            style={{ backgroundColor: theme.colors.secondary }}
            labelStyle={{ color: theme.colors.text, fontFamily: theme.fonts.bold.fontFamily }}
          >
            Login
          </Button>

          <Text style={styles.orText}>- or login with -</Text>

          <Button
            mode="contained"
            style={styles.socialButton}
            labelStyle={[
              styles.buttonLabel,
              { fontFamily: theme.fonts.bold.fontFamily, color: theme.colors.text }
            ]}
            icon="google" //thnx to react-native-vector-icons hehe
          >
            Google
          </Button>

          <Button
            mode="contained"
            style={styles.socialButton}
            labelStyle={[
              styles.buttonLabel,
              { fontFamily: theme.fonts.bold.fontFamily, color: theme.colors.text }
            ]}
            icon="facebook" //thnx to react-native-vector-icons hehe
          >
            Facebook
          </Button>

          <View style={styles.dottedLine} />

        </Card.Content>
      </Card>

      <View style={[styles.row, { marginTop: 30 }]}>
        <Text style={[styles.forgot, { color: theme.colors.description }]}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

    </Background>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#f2f2f2', // Slightly darker card background
  },

  cardDescription: {
    textAlign: 'center',
    fontFamily: theme.fonts.medium.fontFamily,
    marginBottom: 10,
    fontWeight: 'bold',
    color: theme.colors.description,
  },

  header: {
    fontSize: 60,
    fontFamily: theme.fonts.bold.fontFamily, // Use custom font
    color: theme.colors.heading,
    paddingVertical: 10,
  },

  input: {
    fontFamily: theme.fonts.regular.fontFamily,
    color: theme.colors.text,
    backgroundColor: 'transparent',
    marginBottom: 12,
  },

  forgotPassword: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  orText: {
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: 'bold',
  },

  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#D0D0D0',
  },

  buttonLabel: {
    fontWeight: 'bold',
  },

  dottedLine: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.text,
    borderStyle: 'dotted',
    marginVertical: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    justifyContent: 'center',
  },

  forgot: {
    fontFamily: theme.fonts.medium.fontFamily,
    textDecorationLine: 'underline',
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.text,
  },

  link: {
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
