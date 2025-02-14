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

export default function TransactionsScreen({ navigation }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userID = await AsyncStorage.getItem("user_id");
      
      if (!token) {
        console.error('No Token Found');
        return;
      }
  
      const response = await fetch(`${API_URL_DEVICE}/transactions/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        const transactions = await response.json();
        console.log('Fetched Transactions:', transactions);
        setData(transactions);
      } else {
        console.error('Failed To Fetch Transactions:', response.statusText);
      }
    } catch (error) {
      console.error('Error Fetching Transactions:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchData();
    }, [])
  );

  const renderData = (item) => {
      return (
          <Card style={styles.cardStyle}>
              <Text style={{fontSize:18}}>{item.transactionTitle} - {item.transactionAmount}</Text>
              <Text>{item.transactionDesc}</Text>
              <Text>{item.transactionCategory}</Text>
          </Card>
      )
  }

  return (
    <View style={styles.transactionsScreen}>
      <InAppBackground>
        <InAppHeader>Transactions</InAppHeader>
        {data.length === 0 ? (
          <Text style={styles.defaultText}>You Have No Transactions Yet!</Text>
        ) : (
          <FlatList 
              data={data} 
              renderItem={({ item }) => renderData(item)}
              keyExtractor={item => `${item.transactionID}`}
          />
        )}
      <PlusFAB onPress={() => navigation.push('AddTransaction')}/>
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

    cardStyle: {
      margin: 15,
      padding: 25
    }
})