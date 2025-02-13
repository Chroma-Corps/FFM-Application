import React from 'react'
import { PaperProvider, Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { useFonts } from 'expo-font'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './src/screens'
import BudgetsScreen from './src/screens/BudgetsScreen'


const Stack = createStackNavigator()

export default function App() {

  const [fontsLoaded] = useFonts({
    "Quicksand-Light": require("./src/assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Medium": require("./src/assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("./src/assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("./src/assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Bold": require("./src/assets/fonts/Quicksand-Bold.ttf")
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Budgets" component={BudgetsScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}



// https://reactnative.dev/docs/getting-started
// https://callstack.github.io/react-native-paper/

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import Home from './components/Home';

// export default function App() {

//   const name = "Powered by Chroma Corps"

//   return (
//     <View style={styles.container}>
//       <Home name = {name}/>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e6e6fa',
//     justifyContent: 'center'
//   },
// });