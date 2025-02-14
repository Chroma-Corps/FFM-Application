import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import Dashboard from '../screens/Dashboard' 
import BudgetsScreen from '../screens/BudgetsScreen'
import TransactionsScreen from '../screens/TransactionsScreen'
import { theme } from '../core/theme'

const Tab = createBottomTabNavigator()

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName

          if (route.name === 'Dashboard') iconName = 'home'
          else if (route.name === 'Budgets') iconName = 'attach-money'
          else if (route.name === 'Transactions') iconName = 'swap-horiz'

          return <MaterialIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.surface,
        tabBarStyle: {
          backgroundColor: '#181818',
          borderTopColor: theme.colors.secondary,
          borderTopWidth: 2,
          height: 70,
          justifyContent: 'center',
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: theme.fonts.medium.fontFamily,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  )
}