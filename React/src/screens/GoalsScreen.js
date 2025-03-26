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

export default function GoalsScreen({ navigation }) {
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

      const response = await fetch(`https://ffm-application-main.onrender.com/goals`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setData(data.goals);
      } else {
        console.error(data.message);
      }
      console.log('Fetch Goals Status:', data.status)
    } catch (error) {
      console.error('Error Fetching Goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = selectedFilter === 'All'
    ? data
    : data.filter((goal) => goal.goalType === selectedFilter);

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderData = (item) => {
    const goalColorTheme = item.color || '#9ACBD0';

    return (
      <TouchableOpacity
        // onPress={() => navigation.push('GoalDetails', { goalID: item.goalID })}
      >
        <Card style={[styles.card, { borderColor: goalColorTheme }]}>
          <View style={styles.cardContentContainer}>
            <View style={[styles.colorStrip, { backgroundColor: goalColorTheme }]} />

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderContainer}>
                <Text style={styles.cardTitle}>{item.goalTitle}</Text>
              </View>

              <View style={styles.cardDetailsContainer}>
                <Text style={styles.cardText}>
                  <Text style={styles.remainingGoalAmountText}>{item.currentAmount} </Text>
                  left of {item.targetAmount}
                </Text>

                <ProgressBar
                  startDate={item.startDate}
                  endDate={item.endDate}
                  goalColorTheme={goalColorTheme}
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
    <View style={styles.goalsScreen}>
      <InAppBackground>
        <View style={styles.headerContainer}>
          <InAppHeader>Goals</InAppHeader>
          <NotificationBell />
        </View>

        <Text style={styles.descriptionText}>
            This is your goal-setting hub—track your progress and stay on target!
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
          ) : filteredGoals.length === 0 ? (
          <Text style={styles.defaultText}>You Have No Goals Yet!</Text>
          ) : (
            <FlatList
              data={filteredGoals}
              renderItem={({ item }) => renderData(item)}
              keyExtractor={item => `${item.goalID}`}
            />
          )}
          <RadialMenu navigation={navigation} />
      </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    goalsScreen: {
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

  remainingGoalAmountText: {
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