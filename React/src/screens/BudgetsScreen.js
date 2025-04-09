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
import NotificationBell from '../components/NotificationButton';
import FilterTag from '../components/FilterTag';
import ProgressBar from '../components/ProgressBar';
import RadialMenu from '../components/RadialMenu';

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

      const response = await fetch(`https://ffm-application-main.onrender.com/budgets`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setData(data.budgets);
      } else {
        console.error(data.message);
      }
      console.log('Fetch Budgets Status:', data.status)
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
      const categoryImages = {
        bills: require('../assets/icons/bills.png'),
        entertainment: require('../assets/icons/entertainment.png'),
        groceries: require('../assets/icons/groceries.png'),
        income: require('../assets/icons/income.png'),
        shopping: require('../assets/icons/shopping.png'),
        transit: require('../assets/icons/transit.png')
      };

      const categoriesToDisplay = budgetCategories && budgetCategories.length > 0
        ? budgetCategories
        : [];

      const displayedCategories = categoriesToDisplay.slice(0, 3);
      const categoryLimit = categoriesToDisplay.length > 3;

      const categoryWithImages = displayedCategories.map((category, index) => {
        const categoryName = category.toLowerCase();
        return {
          image: categoryImages[categoryName] || require('../assets/default_img.jpg') // Fallback image
        };
      });

      return (
        <View style={styles.categoryList}>
          {categoryWithImages.map((category, index) => (
            <View key={category.name || index} style={styles.categoryItem}>
              <Image source={category.image} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
          {categoryLimit && <Text style={styles.cardText}>...</Text>}
        </View>
      );
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('BudgetDetails', { budgetID: item.budgetID })}
      >
        <Card style={[styles.card, { borderColor: budgetColorTheme }]}>
          <View style={styles.cardContentContainer}>
            <View style={[styles.colorStrip, { backgroundColor: budgetColorTheme }]} />

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderContainer}>
                <Text style={styles.cardTitle}>{item.budgetTitle}</Text>
                <View>
                  {item.budgetCategory ? (
                    renderCategories(item.budgetCategory)
                  ) : (
                    <Text>None</Text>
                  )}
                </View>
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
        <RadialMenu navigation={navigation} />
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
    padding: 20
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
    gap: 10,
  },

  categoryIcon: {
    width: 30,
    height: 30,
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