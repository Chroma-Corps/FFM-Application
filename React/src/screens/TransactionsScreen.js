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

      const response = await fetch(`https://ffm-application-test.onrender.com/transactions/${userID}`, {
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
          <>
            <View>
              <Text style={styles.dateText}>{item.transactionDate}</Text>
            </View>
            <Card style={styles.cardStyle}>
              <View style={styles.cardRow}>
                <Text style={styles.titleText}>{item.transactionTitle}</Text>
                <Text style={styles.amountText}>- {item.transactionAmount}</Text>
              </View>
            </Card>
          </>
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

    cardText: {
      color: "#fff",
      fontFamily: theme.fonts.medium.fontFamily,
    },

    cardStyle: {
      margin: 10,
      padding: 25,
      backgroundColor: '#181818',
      borderColor: theme.colors.secondary,
      borderWidth: 2,
      borderRadius: 30,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    amountText: {
      fontSize: 15,
      color: '#E57373',
      fontFamily: theme.fonts.bold.fontFamily,
    },
    titleText: {
      fontSize: 18,
      color: theme.colors.surface,
      fontFamily: theme.fonts.bold.fontFamily,
    },
    dateText: {
      fontSize: 15,
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.description,
      lineHeight: 21,
      textAlign: 'center',
      paddingTop: 10
  },
})