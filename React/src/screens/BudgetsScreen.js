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
    
        const response = await fetch(`${API_URL_LOCAL}/budgets/${userID}`, {
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
            <Card style={styles.cardStyle}>
                <Text style={{fontSize:18}}>{item.budgetTitle}</Text>
                <Text>{item.startDate} to {item.endDate}</Text>
                <Text>{item.userID}</Text>
            </Card>
        )
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
                {/* <Button
                    mode="outlined"
                    onPress={() =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'StartScreen' }],
                      })
                    }
                  >
                    Logout
                </Button> */}
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

    cardStyle: {
      margin: 15,
      padding: 25
  }
})