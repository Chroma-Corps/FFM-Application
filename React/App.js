import React from 'react'
import { PaperProvider, Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import { theme } from './src/core/theme';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import BottomTabsNavigator from './src/navigation/BottomTabsNavigator'

import {
  LoginScreen,
  MainAuthScreen,
  PreviewDemoScreen,
  RegisterScreen,
  ResetPasswordScreen,
  SelectCircleTypeScreen,
  StartScreen,
  CreateBankScreen,
  BankDetailsScreen,
  BudgetDetailsScreen,
  BudgetsScreen,
  CreateBudgetScreen,
  EditBudgetScreen,
  AllCirclesScreen,
  CircleDetailsScreen,
  CreateCircleScreen,
  Dashboard,
  SettingsScreen,
  CreateGoalScreen,
  EditGoalScreen,
  GoalDetailsScreen,
  GoalsScreen,
  AddTransactionScreen,
  TransactionDetailsScreen,
  TransactionsScreen,
  UpdateTransactionScreen,
} from './src/screens'

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

            {/* Auth Screens */}
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="SelectCircleTypeScreen" component={SelectCircleTypeScreen} />

            {/* Home Screens */}
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Budgets" component={BudgetsScreen} />
            <Stack.Screen name="Goals" component={GoalsScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />

            {/* Creation Screens */}
            <Stack.Screen name="CreateCircle" component={CreateCircleScreen} />
            <Stack.Screen name="CreateBank" component={CreateBankScreen} />
            <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} />
            <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />

            {/* Details Screens */}
            <Stack.Screen name="CircleDetails" component={CircleDetailsScreen} />
            <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
            <Stack.Screen name="BudgetDetails" component={BudgetDetailsScreen} />
            <Stack.Screen name="GoalDetails" component={GoalDetailsScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />

            {/* Edit Screens */}
            <Stack.Screen name="EditCircle" component={EditBudgetScreen} />
            <Stack.Screen name="EditBank" component={EditBudgetScreen} />
            <Stack.Screen name="EditBudget" component={EditBudgetScreen} />
            <Stack.Screen name="EditGoal" component={EditGoalScreen}/>
            <Stack.Screen name="UpdateTransaction" component={UpdateTransactionScreen} />

            {/* Dashboard */}
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