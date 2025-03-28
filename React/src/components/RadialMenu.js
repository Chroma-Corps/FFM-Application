import React from 'react';
import { FloatingAction } from 'react-native-floating-action';
import { theme } from '../core/theme';
import { MaterialIcons } from '@expo/vector-icons'

export default function RadialMenu({ navigation }) {
  const actions = [
    { 
      text: 'New Circle', 
      icon: <MaterialIcons name="groups" size={20} color={theme.colors.textSecondary} />,
      name: 'CreateCircle', position: 1,
      color: theme.colors.primary,
    },
    { 
        text: 'New Goal', 
        icon: <MaterialIcons name="track-changes" size={20} color={theme.colors.textSecondary} />,
        name: 'CreateGoal', position: 2,
        color: theme.colors.primary,
    },
    { 
        text: 'New Budget', 
        icon: <MaterialIcons name="account-balance-wallet" size={20} color={theme.colors.textSecondary} />,
        name: 'CreateBudget', position: 3,
        color: theme.colors.primary,
    },
    { 
        text: 'New Transaction', 
        icon: <MaterialIcons name="credit-card" size={20} color={theme.colors.textSecondary} />,
        name: 'AddTransaction', position: 4,
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