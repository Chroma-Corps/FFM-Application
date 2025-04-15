// rfce
import React, {useState, useCallback} from 'react';
import {View, Image, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import InAppHeader from '../../components/InAppHeader'
import InAppBackground from '../../components/InAppBackground';
import { theme } from '../../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthFilter from '../../components/MonthFilter';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RadialMenu from '../../components/RadialMenu';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionsScreen({ navigation }) {

  const [data, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default The Current Month
  const [searchQuery, setSearchQuery] = useState("");
  const parseCurrency = (amount) => {
    if (!amount) return 0;
    return parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
  };

  const totalExpenses = data
    .filter((t) => (selectedMonth === "all" || new Date(t.transactionDate).getMonth() === selectedMonth) && t.transactionType === "Expense")
    .reduce((sum, t) => sum + parseCurrency(t.transactionAmount), 0);
  const totalIncome = data
    .filter((t) => (selectedMonth === "all" || new Date(t.transactionDate).getMonth() === selectedMonth) && t.transactionType === "Income")
    .reduce((sum, t) => sum + parseCurrency(t.transactionAmount), 0);
  const totalAmount = data
  .filter((t) => (selectedMonth === "all" || new Date(t.transactionDate).getMonth() === selectedMonth))
  .reduce((sum, t) => sum + parseCurrency(t.transactionAmount), 0);

  const formatTime12Hour = (timeString) => {
    if (!timeString) return '';

    const date = new Date(`1970-01-01T${timeString}`);
    if (isNaN(date)) return timeString; // Fallback

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getMonthName = (monthCode) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const index = parseInt(monthCode, 10);
    return monthNames[index];
  };
  

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch(`https://ffm-application-main.onrender.com/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
      } else {
        console.error(data.message);
      }
      console.log('Fetch Transactions Status:', data.status)
    } catch (error) {
      console.error('Error Fetching Transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchTransactions();
    }, [])
  );

  // Filter Transactions Based On 1) Month Selected, 2) Title, OR 3) Category
  const filteredTransactions = data.filter((transaction) => {
    const transactionMonth = new Date(transaction.transactionDate).getMonth();
    const matchesSearch =
      (typeof transaction.transactionTitle === 'string' &&
        transaction.transactionTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(transaction.transactionCategory) ?
        transaction.transactionCategory.some(category =>
          category.toLowerCase().includes(searchQuery.toLowerCase())
        ) :
        (typeof transaction.transactionCategory === 'string' && 
          transaction.transactionCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return (selectedMonth === "all" || transactionMonth === parseInt(selectedMonth)) && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.transactionDate) - new Date(a.transactionDate);
  });

  //Group Transactions By Date
  const groupTransactionsByDate = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const date = transaction.transactionDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
  };

  const groupedTransactions = groupTransactionsByDate(sortedTransactions);

  // Render Functions: All Transactions & Grouped Transactions (Month Based)
  const renderTransaction = ({ item }) => {
    const isExpense = item.transactionType === "Expense";

    return (
    <View>
        <TouchableOpacity style={styles.cardStyle} onPress={() => navigation.navigate('TransactionDetails', { transactionID: item.transactionID })}>
            <View style={styles.cardRow}>
              <Text style={styles.titleText}>{item.transactionTitle}</Text>
              <View style={styles.amountContainer}>
                <Icon
                  name={isExpense ? "arrow-down" : "arrow-up"}
                  size={18}
                  color={isExpense ? theme.colors.expense : theme.colors.income}
                />
                <Text style={[styles.amountText, { color: isExpense ? theme.colors.expense : theme.colors.income }]}>
                  {item.transactionAmount}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.cardText}>
                {Array.isArray(item.transactionCategory)
                  ? item.transactionCategory.join(' • ')
                  : item.transactionCategory}
              </Text>
              <Text style={styles.timeText}>{formatTime12Hour(item.transactionTime)}</Text>
            </View>
        </TouchableOpacity>
    </View>
    );
  };

  const renderGroupedTransactions = () => {
    const flatListData = Object.keys(groupedTransactions).flatMap((date) => [
      { type: "header", date },
      ...groupedTransactions[date].map((transaction) => ({ type: "item", transaction })),
    ]);

    return (
      <FlatList
        data={flatListData}
        keyExtractor={(item, index) => (item.type === "header" ? `header-${item.date}` : `transaction-${item.transaction.transactionID}`)}
        renderItem={({ item }) =>
          item.type === "header" ? (
            <Text style={styles.dateHeader}>{item.date}</Text>
          ) : (
            renderTransaction({ item: item.transaction })
          )
        }
      />
    );
  };

  return (
    <View style={styles.transactionsScreen}>
      <InAppBackground>
        <View style={styles.headerContainer}>
          <InAppHeader>Transactions</InAppHeader>
        </View>

        {/* Transactions Search Bar : Title or Category */}
        <View style={styles.searchBarContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color="white"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Transactions"
            placeholderTextColor={theme.colors.grayedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Horizontal Month Filter */}
        <MonthFilter selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />

        {/* Summary Bar : Total Expenses and Incomes for Selected Month */}
        <View style={styles.summaryContainer}>
          <Text style={styles.expenseText}>-${totalExpenses}</Text>
          <Text style={styles.totalText}>${totalAmount}</Text>
          <Text style={styles.incomeText}>+${totalIncome}</Text>
        </View>
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : filteredTransactions.length === 0 ? (
              <View>
                <Image
                  style={styles.image}
                  source={require('../../assets/empty.png')}
                />
                <Text style={styles.defaultText}>
                  You Have No Transactions
                  {String(selectedMonth).toLowerCase() !== 'all' && ` For ${getMonthName(parseInt(selectedMonth))}`}
                </Text>
              </View>
            ) : (
              renderGroupedTransactions()
            )}
        </View>
        <RadialMenu navigation={navigation} />
      </InAppBackground>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({

  transactionsScreen: {
      flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20
  },

  cardText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.medium.fontFamily,
  },

  cardStyle: {
    margin: 15,
    padding: 5,
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

  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5, 
  },

  timeText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.description,
    textAlign: "right",
    marginRight: 10,
  },

  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: "#2F2F2F",
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold.fontFamily
  },

  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 5,
  },

  expenseText: {
    color: theme.colors.expense,
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily
  },

  totalText: {
    color: theme.colors.textSecondary,
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily
  },

  incomeText: {
    color: theme.colors.income,
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily
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

  dateHeader: {
    fontSize: 12,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.description,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 10,
    textAlign: "left"
  },

})