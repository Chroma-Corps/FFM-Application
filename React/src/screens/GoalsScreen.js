// rfce
import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { Image, Alert } from 'react-native';
import InAppBackground from '../components/InAppBackground';
import InAppHeader from '../components/InAppHeader';
import { theme } from '../core/theme';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationBell from '../components/NotificationButton';
import FilterTag from '../components/FilterTag';
import ProgressBar from '../components/ProgressBar';
import RadialMenu from '../components/RadialMenu';
import DraggableFlatList from "react-native-draggable-flatlist";

export default function GoalsScreen({ navigation }) {
  const filters = ['All', 'Savings', 'Expense'];
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredGoals, setFilteredGoals] = useState([]);

    const handleSearchPress = () => { 
      setIsSearchMode(!isSearchMode);
    };

    const handleEditPress = () => {
      setIsEditMode(!isEditMode);
    }

    const handleFilterPress = (filter) => { 
      setSelectedFilter(filter);
    };

    const handleSearchChange = (text) => {
      setSearchQuery(text);
    };

    const handleKeyboardDone = () => {
      // setIsSearchMode(false);
      Keyboard.dismiss();
    };

    const handleResetPress = () => {
      setSearchQuery("");
      setIsSearchMode(false);
      setIsEditMode(false);
      setSelectedFilter(selectedFilter);
    }

    const handleReorder = async ({ data }) => {
        setFilteredGoals(data);
    };

    const handleDeleteGoal = (goalID) => {
      Alert.alert(
        "Are You Sure?",
        "This Action Cannot Be Undone",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete", 
            onPress: () => deleteGoal(goalID),
            style: "destructive"
          }
        ]
      );
    };
  
    const deleteGoal = async (goalID) => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("access_token");
  
        if (!token) {
          console.error('No Token Found');
          return;
        }
  
        const response = await fetch(`https://ffm-application-main.onrender.com/goal/${goalID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert(data.message)
          setData(prevGoals => prevGoals.filter(goal => goal.goalID !== goalID));
        } else {
          console.error(data.message);
        }
        console.log('Delete Goal Status:', data.status)
      } catch (error) {
        console.error('Error Fetching Goals:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      setData([]);
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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
      filterGoals();
  }, [searchQuery, selectedFilter, data]);

  // Filter Goals Based On Title
  const filterGoals = () => {
    if (!data) return;
    let filtered = selectedFilter === 'All' ? data : data.filter((goal) => goal.goalType === selectedFilter);
    const cleanedSearchQuery = searchQuery.trim();
  
    if (cleanedSearchQuery) {
      filtered = filtered.filter((goal) => {
        const goalTitle = goal.goalTitle || '';
        const matchesSearch =
          goalTitle.toLowerCase().includes(cleanedSearchQuery.toLowerCase())
        return matchesSearch
      });
    }
    setFilteredGoals([...filtered].reverse());
  };

  const renderReorderedGoals = (({ item, drag }) => {
    const goalColorTheme = item.color || '#9ACBD0';
    return (
      <Card style={[styles.card, { borderColor: goalColorTheme }]}>
        <View style={styles.cardContentContainer}>
          <View style={[styles.colorStrip, { backgroundColor: goalColorTheme }]} />
          <View style={styles.cardContentEditMode}>
            <View>
              <Text style={styles.cardTitle}>{item.goalTitle}</Text>
              <Text style={styles.insightsTextEditMode}>
                {item.goalType}
              </Text>
            </View>
            <View style={styles.editModeIcons}>
              <TouchableOpacity onPress={null}>
                <MaterialIcons name={"edit"} size={25} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteGoal(item.goalID)}>
                <MaterialIcons name={"delete"} size={25} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity onLongPress={drag}>
                <MaterialIcons name={"reorder"} size={25} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    );
  });

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
                  colorTheme={goalColorTheme}
                  amount={item.targetAmount} 
                  remainingAmount={item.currentAmount}
                />

                <Text style={styles.insightsText}>
                  {item.goalType}
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
          {isSearchMode ? (
            // Search Bar Shown When In Search Mode
            <TextInput
              style={styles.searchInput}
              placeholder="Search Goals"
              placeholderTextColor={theme.colors.grayedText}
              autoFocus
              returnKeyType='done'
              onSubmitEditing={handleKeyboardDone}
              onChangeText={handleSearchChange}
              value={searchQuery}
            />
          ) : (
            // Normal Header Shown When Not In Search Mode
            <InAppHeader>Goals</InAppHeader>
          )}
          <View style={styles.iconsSection}>
            <TouchableOpacity onPress={handleSearchPress}>
              <MaterialIcons name={"search"} size={26} color={"white"}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditPress}>
              <MaterialIcons name={"edit"} size={26} color={"white"}/>
            </TouchableOpacity>
          </View>
          {/* <NotificationBell /> */}
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
              style={styles.descriptionText} 
            />
          ))}
          <TouchableOpacity onPress={handleResetPress} style={{ alignSelf: 'center', marginBottom: 10 }}>
            <MaterialIcons name={"refresh"} size={30} color={"white"}/>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : data.length === 0 ? (
            <View>
              <Image
                style={styles.image}
                source={require('../assets/empty.png')}
              />
              <Text style={styles.defaultText}>You Have No Goals Yet!</Text>
            </View>
          ) : isEditMode ? (
            <View style={{ flex: 1 }}>
              <DraggableFlatList
                data={filteredGoals}
                keyExtractor={(item) => `${item.goalID}`}
                onDragEnd={handleReorder}
                renderItem={renderReorderedGoals}
              />
            </View>
          ) : (
            <FlatList
              data={filteredGoals}
              renderItem={({ item }) => renderData(item)}
              keyExtractor={(item) => `${item.goalID}`}
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
  },

  image: {
    alignSelf: 'center',
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold.fontFamily,
    backgroundColor: "#2F2F2F",
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  iconsSection: {
    flexDirection: 'row',
    gap: 20,
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

  cardContentEditMode: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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

  insightsTextEditMode: {
    flexWrap: 'wrap',
    color: "#fff",
    fontSize: 12,
    fontFamily: theme.fonts.medium.fontFamily,
  },

  editModeIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  }
});