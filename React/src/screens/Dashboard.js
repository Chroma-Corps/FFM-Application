import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import InAppHeader from '../components/InAppHeader';
import InAppBackground from '../components/InAppBackground';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';

export default function Dashboard({ navigation }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-test.onrender.com/banks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Banks:', data);
        setBanks(data);
      } else {
        console.error('Failed To Fetch Banks:', response.statusText);
      }
    } catch (error) {
      console.error("Error Fetching Banks:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBanks();
    }, [])
  );

  const handleAddBank = () => {
    navigation.navigate('AddBank');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'StartScreen' }],
    });
  };

  const renderBankItem = ({ item }) => {
    return (
      <View style={styles.bankItem}>
        <Text style={styles.bankTitle}>{item.bankTitle}</Text>
        <Text style={styles.bankAmount}>{item.bankAmount} {item.bankCurrency}</Text>
      </View>
    );
  };

  return (
    <InAppBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <InAppHeader>Dashboard</InAppHeader>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : banks.length === 0 ? (
          <Text style={styles.defaultText}>You Have No Banks Added Yet!</Text>
        ) : (
          <View style={styles.bankListContainer}>
            <FlatList
              data={banks}
              renderItem={renderBankItem}
              keyExtractor={(item) => item?.bankID ? item.bankID.toString() : `${item.bankTitle}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
            />
            <Button mode="contained" onPress={handleAddBank} style={styles.addButton}>+</Button>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleLogout} style={styles.button}>Logout</Button>
        </View>
          
      </ScrollView>
    </InAppBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  defaultText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    color: theme.colors.description,
    textAlign: 'center',
    marginTop: 10,
  },

  bankItem: {
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    marginRight: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },

  bankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  bankAmount: {
    fontSize: 14,
    color: theme.colors.description,
  },

  bankListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  addButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 10,
    padding: 0,
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  button: {
    width: '100%',
    borderRadius: 8,
  },

  flatListContainer: {
    paddingVertical: 10,
  }
});
