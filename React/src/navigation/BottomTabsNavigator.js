import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import Dashboard from '../screens/Dashboard' 
import BudgetsScreen from '../screens/BudgetsScreen'
import TransactionsScreen from '../screens/TransactionsScreen'

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
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  )
}