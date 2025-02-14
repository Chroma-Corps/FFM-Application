// rfce
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import InAppHeader from '../components/InAppHeader'
import {Card} from 'react-native-paper';
import PlusFAB from '../components/PlusFAB';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import { theme } from '../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BudgetsScreen({ navigation }) {

    const [data, setData] = useState([]);

    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const userID = await AsyncStorage.getItem("user_id");
        
        if (!token) {
          console.error('No Token Found');
          return;
        }
    
        const response = await fetch(`${API_URL_DEVICE}/budgets/${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
    
        if (response.ok) {
          const budgets = await response.json();
          console.log('Fetched Budgets:', budgets);
          setData(budgets);
        } else {
          console.error('Failed To Fetch Budgets:', response.statusText);
        }
      } catch (error) {
        console.error('Error Fetching Budgets:', error);
      }
    };

    useFocusEffect(
      useCallback(() => {
          fetchData();
      }, [])
  );

    const renderData = (item) => {
        return (
          <TouchableOpacity
            onPress={() => navigation.push('BudgetDetails', { budgetID: item.budgetID })}
          >
            <Card style={styles.cardStyle}>
              <Text style={styles.cardTitle}>{item.budgetTitle}</Text>
              <Text style={styles.cardText}>
                <Text style={{fontWeight: 'bold'}}>${item.remainingBudgetAmount} </Text>
                left of ${item.budgetAmount}
              </Text>
              <Text style={styles.cardText}>{item.startDate} to {item.endDate}</Text>
            </Card>
          </TouchableOpacity>
        );
    }

    return (
        <View style={styles.budgetsScreen}>
            <InAppBackground>
                <InAppHeader>Budgets</InAppHeader>
                {data.length === 0 ? (
                    <Text style={styles.defaultText}>You Have No Budgets Yet!</Text>
                ) : (
                    <FlatList 
                        data={data} 
                        renderItem={({ item }) => renderData(item)}
                        keyExtractor={item => `${item.budgetID}`}
                    />
                )}
                <PlusFAB onPress={() => navigation.push('CreateBudget')}/>
            </InAppBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    budgetsScreen: {
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

    cardTitle: {
      color: theme.colors.description,
      fontSize: 20,
      fontFamily: theme.fonts.bold.fontFamily,
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
    }
    
})