import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import Dashboard from '../screens/Dashboard' 
import BudgetsScreen from '../screens/BudgetsScreen'
import TransactionsScreen from '../screens/TransactionsScreen'
import GoalsScreen from '../screens/GoalsScreen'
import { theme } from '../core/theme'

const Tab = createBottomTabNavigator()

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName

          if (route.name === 'Dashboard') iconName = 'dashboard'
          else if (route.name === 'Budgets') iconName = 'account-balance-wallet'
          else if (route.name === 'Goals') iconName = 'track-changes'
          else if (route.name === 'Transactions') iconName = 'credit-card'

          return <MaterialIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.surface,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
          borderTopWidth: 2,
          height: 70,
          justifyContent: 'center',
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: theme.fonts.bold.fontFamily,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  )
}