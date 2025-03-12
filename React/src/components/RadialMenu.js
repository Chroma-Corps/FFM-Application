import React from 'react';
import { FloatingAction } from 'react-native-floating-action';
import { theme } from '../core/theme';
import { MaterialIcons } from '@expo/vector-icons'

export default function RadialMenu({ navigation }) {
  const actions = [
    { 
        text: 'New Goal', 
        icon: <MaterialIcons name="flag" size={20} color={theme.colors.textSecondary} />,
        name: 'Budgets', position: 1, // To Change To Create Goal
        color: theme.colors.primary,
    },
    { 
        text: 'New Budget', 
        icon: <MaterialIcons name="account-balance-wallet" size={20} color={theme.colors.textSecondary} />,
        name: 'CreateBudget', position: 2,
        color: theme.colors.primary,
    },
    { 
        text: 'New Transaction', 
        icon: <MaterialIcons name="credit-card" size={20} color={theme.colors.textSecondary} />,
        name: 'AddTransaction', position: 3,
        color: theme.colors.primary,
    },
  ];

  return (
    <FloatingAction
      actions={actions}
      onPressItem={(name) => navigation.push(name)}
      overlayColor="rgba(0, 0, 0, 0.6)"
      color={theme.colors.primary}
      actionButtonColor={theme.colors.secondary}
    />
  );
};