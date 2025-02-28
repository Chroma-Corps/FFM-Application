import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import { useFocusEffect } from '@react-navigation/native';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';

export default function Dashboard({ navigation }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userID = await AsyncStorage.getItem("user_id");

      console.log('userID:', userID);
      console.log('Token:', token);

      if (!token || !userID) {
        console.error('No Token Found');
        return;
      }
      const response = await fetch(`https://ffm-application-test.onrender.com/banks/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const banks = await response.json();
        console.log('Fetched Banks:', banks);
        setBanks(banks);
      } else {
        console.error('Failed To Fetch Banks:', response.statusText);
      }
      } catch (error) {
        console.error("Error Fetching Banks:", error);
      } finally {
        setLoading(false);
      }
  };

  const handleAddBank = () => {
      navigation.navigate('AddBank');
  };

  useFocusEffect(
    useCallback(() => {
        fetchBanks();
    }, [])
  );

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'StartScreen' }],
    });
  };

  const renderData = (item) => {
    return (
      <>
        <Card style={styles.cardStyle}>
        <Card.Title title={item.bankTitle} subtitle={`${item.bankAmount}`} />
          <Card.Content>
            <Text>{item.bankCurrency}</Text>
          </Card.Content>
        </Card>
      </>
    );
  }

  return (
    <Background>
      <Header>Dashboard</Header>
      {banks.length === 0 ? (
        <Text style={styles.defaultText}>You Have No Banks Added Yet!</Text>
      ) : (
        <FlatList 
            data={banks} 
            renderItem={({ item }) => renderData(item)}
            keyExtractor={item => `${item.bankID}`}
        />
      )}
      <FAB
      style={styles.fab}
      icon="plus"
      onPress={handleAddBank}
    />
    <Button mode="outlined" onPress={handleLogout}>Logout</Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  dashboardScreen: {
    flex: 1,
  },

  defaultText: {
    fontSize: 15,
    fontFamily: theme.fonts.medium.fontFamily,
    color: theme.colors.description,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: theme.colors.description,
  },
});