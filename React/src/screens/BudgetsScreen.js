// rfce
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { Image } from 'react-native';
import InAppBackground from '../components/InAppBackground';
import InAppHeader from '../components/InAppHeader';
import { theme } from '../core/theme';
import PlusFAB from '../components/PlusFAB';
import NotificationBell from '../components/NotificationButton';
import FilterTag from '../components/FilterTag';
import ProgressBar from '../components/ProgressBar';

const defaultCategories = [ //To Replace With API Route Fetch - JaleneA
  { id: 1, name: 'Category#1', image: require('../assets/default_img.jpg') },
  { id: 2, name: 'Category#2', image: require('../assets/default_img.jpg') },
  { id: 3, name: 'Category#3', image: require('../assets/default_img.jpg') },
  { id: 4, name: 'Category#4', image: require('../assets/default_img.jpg') },
];

const filters = ['All', 'Savings', 'Expense'];

export default function BudgetsScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch(`https://ffm-application-midterm.onrender.com/budgets`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const budgets = await response.json();
        setData(budgets);
      } else {
        console.error('Failed To Fetch Budgets:', response.statusText);
      }
    } catch (error) {
      console.error('Error Fetching Budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBudgets = selectedFilter === 'All'
    ? data
    : data.filter((budget) => budget.budgetType === selectedFilter);

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderData = (item) => {
    const budgetColorTheme = item.color || '#9ACBD0';

    const renderCategories = (budgetCategories) => {
      const categoryImages = budgetCategories && budgetCategories.length > 0
        ? budgetCategories
        : defaultCategories;

      const displayedCategories = categoryImages.slice(0, 4);
      const categoryLimit = categoryImages.length > 4;

      return (
        <View style={styles.categoryList}>
          {displayedCategories.map((category, index) => (
            <Image key={category.id || index} source={category.image} style={styles.categoryIcon} />
          ))}
          {categoryLimit && <Text style={styles.cardText}>...</Text>}
        </View>
      );
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.push('BudgetDetails', { budgetID: item.budgetID })}
      >
        <Card style={[styles.card, { borderColor: budgetColorTheme }]}>
          <View style={styles.cardContentContainer}>
            <View style={[styles.colorStrip, { backgroundColor: budgetColorTheme }]} />

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderContainer}>
                <Text style={styles.cardTitle}>{item.budgetTitle}</Text>
                <View>{renderCategories(item.categories)}</View>
              </View>

              <View style={styles.cardDetailsContainer}>
                <Text style={styles.cardText}>
                  <Text style={styles.remainingBudgetAmountText}>{item.remainingBudgetAmount} </Text>
                  left of {item.budgetAmount}
                </Text>

                <ProgressBar
                  startDate={item.startDate}
                  endDate={item.endDate}
                  budgetColorTheme={budgetColorTheme}
                />

                <Text style={styles.insightsText}>
                  ~ Insights Go Here ~
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.budgetsScreen}>
      <InAppBackground>
        <View style={styles.headerContainer}>
          <InAppHeader>Budgets</InAppHeader>
          <NotificationBell />
        </View>

        <Text style={styles.descriptionText}>
          This is your budgeting hub—keep an eye on your spending and stay on track!
        </Text>

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

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : filteredBudgets.length === 0 ? (
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
  );
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
    paddingHorizontal: 10,
  },

  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#181818',
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },

  cardContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  cardContent: {
    flex: 1,
  },

  colorStrip: {
    width: 10,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  cardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  cardTitle: {
    color: theme.colors.description,
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily,
    marginBottom: 10,
  },

  categoryList: {
    flexDirection: 'row',
    gap: 5,
  },

  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover',
  },

  cardDetailsContainer: {
    gap: 10,
  },

  cardText: {
    color: "#fff",
    fontFamily: theme.fonts.medium.fontFamily,
  },

  remainingBudgetAmountText: {
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.secondary,
  },

  insightsText: {
    textAlign: 'left',
    flexWrap: 'wrap',
    color: "#fff",
    fontSize: 12,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});