// rfce
import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { Image, Alert } from 'react-native';
import InAppBackground from '../../components/InAppBackground';
import InAppHeader from '../../components/InAppHeader';
import { theme } from '../../core/theme';
import { MaterialIcons } from '@expo/vector-icons';
import FilterTag from '../../components/FilterTag';
import ProgressBar from '../../components/ProgressBar';
import RadialMenu from '../../components/RadialMenu';
import DraggableFlatList from "react-native-draggable-flatlist";
import categoryIcons from '../../constants/categoryIcons';

export default function BudgetsScreen({ navigation }) {
  const filters = ['All', 'Savings', 'Expense'];
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredBudgets, setFilteredBudgets] = useState([]);

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
      setFilteredBudgets(data);
  };

  const handleDeleteBudget = (budgetID) => {
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
          onPress: () => deleteBudget(budgetID),
          style: "destructive"
        }
      ]
    );
  };

  const deleteBudget = async (budgetID) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message)
        setData(prevBudgets => prevBudgets.filter(budget => budget.budgetID !== budgetID));
      } else {
        console.error(data.message);
      }
      console.log('Delete Budget Status:', data.status)
    } catch (error) {
      console.error('Error Fetching Budgets:', error);
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
        // console.log(data.budgets);
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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
      filterBudgets();
  }, [searchQuery, selectedFilter, data]);

  // Filter Budgets Based On 1) Title, OR 2) Category
  const filterBudgets = () => {
    if (!data) return;
    let filtered = selectedFilter === 'All' ? data : data.filter((budget) => budget.budgetType === selectedFilter);
    const cleanedSearchQuery = searchQuery.trim();
  
    if (cleanedSearchQuery) {
      filtered = filtered.filter((budget) => {
        const budgetTitle = budget.budgetTitle || '';
        const budgetCategory = budget.budgetCategory || '';

        let categoryMatch = false;
        if (Array.isArray(budgetCategory)) {
          categoryMatch = budgetCategory.some(category =>
            category.toLowerCase().includes(cleanedSearchQuery.toLowerCase())
          );
        } else {
          categoryMatch = budgetCategory.toLowerCase().includes(cleanedSearchQuery.toLowerCase());
        }
        const matchesSearch =
          budgetTitle.toLowerCase().includes(cleanedSearchQuery.toLowerCase()) ||
          categoryMatch;
        return matchesSearch
      });
    }
    setFilteredBudgets([...filtered].reverse());
  };

  const renderReorderedBudgets = (({ item, drag }) => {
    const budgetColorTheme = item.color || '#9ACBD0';
    return (
      <Card style={[styles.card, { borderColor: budgetColorTheme }]}>
        <View style={styles.cardContentContainer}>
          <View style={[styles.colorStrip, { backgroundColor: budgetColorTheme }]} />
          <View style={styles.cardContentEditMode}>
            <View>
              <Text style={styles.cardTitle}>{item.budgetTitle}</Text>
              <Text style={styles.insightsTextEditMode}>
                {item.budgetType} - {item.transactionScope}
              </Text>
            </View>
            <View style={styles.editModeIcons}>
              <TouchableOpacity onPress={() => navigation.push('EditBudget', { budgetID: item.budgetID })}>
                <MaterialIcons name={"edit"} size={25} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteBudget(item.budgetID)}>
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
    const budgetColorTheme = item.color || '#9ACBD0';

    const renderCategories = (budgetCategories) => {
      const categoriesToDisplay = budgetCategories && budgetCategories.length > 0
        ? budgetCategories
        : [];

      const displayedCategories = categoriesToDisplay.slice(0, 3);
      const categoryLimit = categoriesToDisplay.length > 3;

      const categoryWithImages = displayedCategories.map((category, index) => {
        const categoryName = category.toLowerCase();
        return {
          image: categoryIcons[categoryName] || require('../../assets/default_img.jpg') // Fallback image
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
                    colorTheme={budgetColorTheme}
                    amount={item.budgetAmount} 
                    remainingAmount={item.remainingBudgetAmount}
                    itemType="Budget"
                    category={item.budgetType}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.insightsText}>{item.budgetType} - {item.transactionScope}</Text>
          </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.budgetsScreen}>
      <InAppBackground>
        <View style={styles.headerContainer}>
          {isSearchMode ? (
            // Search Bar Shown When In Search Mode
            <TextInput
              style={styles.searchInput}
              placeholder="Search Budgets"
              placeholderTextColor={theme.colors.grayedText}
              autoFocus
              returnKeyType='done'
              onSubmitEditing={handleKeyboardDone}
              onChangeText={handleSearchChange}
              value={searchQuery}
            />
          ) : (
            // Normal Header Shown When Not In Search Mode
            <InAppHeader>Budgets</InAppHeader>
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
          This is your budgeting hub—keep an eye on your spending and stay on track!
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
          <View style={styles.centeredMessageContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading Budgets...</Text>
          </View>
          ) : filteredBudgets.length === 0 ? (
            <View>
              <Image
                style={styles.image}
                source={require('../../assets/empty.png')}
              />
              <Text style={styles.defaultText}>
                {selectedFilter === 'Expense'
                  ? 'You Have No Expense Budgets.'
                  : selectedFilter === 'Savings'
                  ? 'You Have No Savings Budgets.'
                  : 'You have No Budgets Yet!'}
              </Text>
            </View>
          ) : isEditMode ? (
            <View style={{ flex: 1 }}>
              <DraggableFlatList
                data={filteredBudgets}
                keyExtractor={(item) => `${item.budgetID}`}
                onDragEnd={handleReorder}
                renderItem={renderReorderedBudgets}
              />
            </View>
          ) : (
            <FlatList
              data={filteredBudgets}
              renderItem={({ item }) => renderData(item)}
              keyExtractor={(item) => `${item.budgetID}`}
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
  },

  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
      marginTop: 15,
      fontSize: 16,
      color: 'white',
      fontFamily: theme.fonts.regular.fontFamily,
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
    alignItems: 'center',
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

  remainingBudgetAmountText: {
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.secondary,
  },

  insightsText: {
    textAlign: 'center',
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