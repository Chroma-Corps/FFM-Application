// rfce
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import InAppHeader from '../components/InAppHeader'
import {Card} from 'react-native-paper';
import PlusFAB from '../components/PlusFAB';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import { theme } from '../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransactionsScreen() {
  return (
    <View style={styles.transactionsScreen}>
      <InAppBackground>
        <InAppHeader>Transactions</InAppHeader>
      </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    transactionsScreen: {
        flex: 1,
    },

    defaultText: {
        fontSize: 15,
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.description,
        lineHeight: 21,
        textAlign: 'center',
        paddingTop: 100
    },
})