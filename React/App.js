import React from 'react'
import { PaperProvider, Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import { theme } from './src/core/theme';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import {
  StartScreen,
  PreviewDemoScreen,
  MainAuthScreen,
  LoginScreen,
  ResetPasswordScreen,
  RegisterScreen,
  SelectCircleTypeScreen,
  SetupPersonalCircleScreen,
  SetupFamilyCircleScreen,
  Dashboard,
  BankDetailsScreen,
  BudgetsScreen,
  BudgetDetailsScreen,
  CreateBudgetScreen,
  EditBudgetScreen,
  CreateBankScreen,
  AddTransactionScreen,
  TransactionsScreen,
  TransactionDetailsScreen,
  UpdateTransactionScreen,
  GoalsScreen,
  CreateGoalScreen,
  CreateCircleScreen,
  SettingsScreen,
  CircleDetailsScreen,
  AllCirclesScreen
} from './src/screens'

import BottomTabsNavigator from './src/navigation/BottomTabsNavigator'

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
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="PreviewDemoScreen" component={PreviewDemoScreen} />

            <Stack.Screen
              name="MainAuthScreen"
              component={MainAuthScreen}
              options={{
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

            <Stack.Screen name="SelectCircleTypeScreen" component={SelectCircleTypeScreen} />
            <Stack.Screen name="SetupPersonalCircleScreen" component={SetupPersonalCircleScreen} />
            <Stack.Screen name="SetupFamilyCircleScreen" component={SetupFamilyCircleScreen} />

            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />
            <Stack.Screen name="Budgets" component={BudgetsScreen} />
            <Stack.Screen name="Goals" component={GoalsScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />

            <Stack.Screen name="CreateBank" component={CreateBankScreen} />
            <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} />
            <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
            <Stack.Screen name="CreateCircle" component={CreateCircleScreen} />
            <Stack.Screen name="CircleDetailsScreen" component={CircleDetailsScreen} />
            <Stack.Screen name="EditBudgetScreen" component={EditBudgetScreen} />
            <Stack.Screen name="BudgetDetails" component={BudgetDetailsScreen} />
            <Stack.Screen name="UpdateTransaction" component={UpdateTransactionScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
            <Stack.Screen name="Home" component={BottomTabsNavigator} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AllCircles" component={AllCirclesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </Provider>
  )
}