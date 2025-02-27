import React from 'react'
import { PaperProvider, Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import PlusFAB from './src/components/PlusFAB'
import { useFonts } from 'expo-font'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './src/screens'
import BudgetsScreen from './src/screens/BudgetsScreen'
import CreateBudgetsScreen from './src/screens/CreateBudgetScreen'
import AddTransactionScreen from './src/screens/AddTransactionScreen'
import BottomTabsNavigator from './src/navigation/BottomTabsNavigator'
import BudgetDetailsScreen from './src/screens/BudgetDetailsScreen'


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
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="CreateBudget" component={CreateBudgetsScreen} />
            <Stack.Screen name="BudgetDetails" component={BudgetDetailsScreen} />
            {/* <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Budgets" component={BudgetsScreen} />
            <Stack.Screen name="CreateBudget" component={CreateBudgetsScreen} />
            <Stack.Screen name="BudgetDetails" component={BudgetDetailsScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} /> */}

            <Stack.Screen name="Home" component={BottomTabsNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  )
}