// rfce
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import InAppHeader from '../components/InAppHeader'
import { Card } from 'react-native-paper';
import { Image } from 'react-native';
import PlusFAB from '../components/PlusFAB';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import { theme } from '../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationBell from '../components/NotificationButton';
import FilterTag from '../components/FilterTag';


// COMMENT: FAILED TO RETRIEVE USER BUDGETS SO I'M USING DUMMY DATA
const dummyBudgets = [
  {
    budgetID: 1,
    budgetTitle: 'Groceries',
    remainingBudgetAmount: 500,
    budgetAmount: 1000,
    startDate: '2022-01-01',
    endDate: '2022-01-31'
  },
  {
    budgetID: 2,
    budgetTitle: 'Rent',
    remainingBudgetAmount: 1500,
    budgetAmount: 2000,
    startDate: '2022-01-01',
    endDate: '2022-01-31'
  },
  {
    budgetID: 3,
    budgetTitle: 'Entertainment',
    remainingBudgetAmount: 200,
    budgetAmount: 500,
    startDate: '2022-01-01',
    endDate: '2022-01-31'
  },
  {
    budgetID: 4,
    budgetTitle: 'Groceries',
    remainingBudgetAmount: 800,
    budgetAmount: 1200,
    startDate: '2022-01-01',
    endDate: '2022-01-31'
  },
  {
    budgetID: 5,
    budgetTitle: 'Rent',
    remainingBudgetAmount: 300,
    budgetAmount: 600,
    startDate: '2022-01-01',
    endDate: '2022-01-31'
  },
  {
    budgetID: 6,
    budgetTitle: 'Entertainment',
    remainingBudgetAmount: 400,
    budgetAmount: 800,
    startDate: '2022-01-01',
    endDate: '2022-01-31'
  },
];

const filters = ['All', 'Personal', 'Family'];

export default function BudgetsScreen({ navigation }) {

  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredBudgets = selectedFilter === 'All'
    ? data
    : data.filter((budget) => budget.budgetTitle === selectedFilter);

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
  };

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

    const color = item.color || '#9ACBD0'; // Default color if not provided
    const budgetGoal = item.budgetType || 'Save'; // Default budget goal type if not provided
    const recomendedAmount = item.budgetRecomendation || '$0.00'; //Default saving/spending recomendation if not provided

    return (
      <TouchableOpacity
        onPress={() => navigation.push('BudgetDetails', { budgetID: item.budgetID })}
      >
        <Card style={styles.card}>
          <View style={styles.cardContent}>

            <View style={[styles.colorStrip, { backgroundColor: color }]} />

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.budgetTitle}</Text>

              <Text style={styles.cardText}>
                <Text style={{ fontWeight: 'bold' }}>${item.remainingBudgetAmount} </Text>
                left of ${item.budgetAmount}
              </Text>

              <Text style={styles.cardText}>{item.startDate} to {item.endDate}</Text>

              <View style={styles.imageAndInsightsContainer}>

                <View style={styles.imageWrapper}>

                  <Image source={require('../assets/default_icon.jpg')} style={styles.image} />
                  <Text style={styles.imageCaption}>Username</Text>
                </View>

                <View>
                  <Text style={styles.insightsText}>
                    {budgetGoal} up to {recomendedAmount} to stay on budget
                  </Text>
                </View>
              </View>

            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.budgetsScreen}>
      <InAppBackground>

        <View style={styles.headerContainer}>
          <InAppHeader>
            Budgets 🎯
          </InAppHeader>
          <NotificationBell />
        </View>

        <View>
          <Text style={styles.descriptionText}>
            This is your budgeting hub—keep an eye on your spending and stay on track!
          </Text>

          {/* Filter Section */}
          <View style={styles.filterContainer}>
            {filters.map((filter) => (
              <FilterTag
                key={filter}
                label={filter}
                isSelected={selectedFilter === filter}
                onPress={() => handleFilterPress(filter)}
              />
            ))}
          </View>
        </View>

        {filteredBudgets.length === 0 ? (
          <Text style={styles.defaultText}>You Have No Budgets Yet!</Text>
        ) : (
          <FlatList
            data={filteredBudgets}
            renderItem={({ item }) => renderData(item)}
            keyExtractor={item => `${item.budgetID}`}
          />
        )}

        <PlusFAB onPress={() => navigation.push('CreateBudget')} />

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

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  descriptionText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    textAlign: 'left',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#181818',
    borderColor: theme.colors.secondary,
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  colorStrip: {
    width: 10,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  textContainer: {
    flex: 1,
  },

  cardTitle: {
    color: theme.colors.description,
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily,
    marginBottom: 10,
  },

  cardText: {
    color: "#fff",
    fontFamily: theme.fonts.medium.fontFamily,
  },

  imageAndInsightsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  imageWrapper: {
    alignItems: 'center',
  },

  image: {
    borderRadius: 80,
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginTop: 10,
  },

  imageCaption: {
    fontSize: 8,
    color: '#888',
    marginTop: 2,
  },

  insightsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  insightsText: {
    textAlign: 'left',
    flexWrap: 'wrap',
    maxWidth: '70%',
    color: "#fff",
    fontFamily: theme.fonts.medium.fontFamily,
  },
})