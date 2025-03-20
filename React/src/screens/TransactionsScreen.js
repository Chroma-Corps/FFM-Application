// rfce
import React, {useState, useCallback} from 'react';
import {View, 
        Text,
        TextInput, 
        StyleSheet, 
        FlatList, 
        Alert, 
        TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import InAppHeader from '../components/InAppHeader'
import {Card} from 'react-native-paper';
import InAppBackground from '../components/InAppBackground';
import { theme } from '../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthFilter from '../components/MonthFilter';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import RadialMenu from '../components/RadialMenu';

export default function TransactionsScreen({ navigation }) {

  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default the current month
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


  const fetchData = async () => {
    try {
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
        setData(data.transactions);
      } else {
        console.error(data.message);
      }
      console.log('Fetch Transactions Status:', data.status)
    } catch (error) {
      console.error('Error Fetching Transactions:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchData();
    }, [])
  );
  //Filter transactions based on 1) month selected, 2)Title, 3) Category 
  const filteredTransactions = data.filter((transaction) => {
    const transactionMonth = new Date(transaction.transactionDate).getMonth();
    const matchesSearch =
      transaction.transactionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transactionCategory.toLowerCase().includes(searchQuery.toLowerCase());
  
    return (selectedMonth === "all" || transactionMonth === parseInt(selectedMonth)) && matchesSearch;
  });

  //Group Transactions by date
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

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  //Delete a Transaction
  const deleteTransaction = (transactionID) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", 
          onPress: () => {
            setData(data.filter((item) => item.transactionID !== transactionID));
            Alert.alert("Succss", "Transaction deleted successfully.");

            },
        },
      ]
    );
  };

  //Edit Transaction 
  const editTransaction = (transactionID) => {
    // navigation.push("AddTransaction", { transactionID });
  };

  const renderData = ({ item }) => {
    const isExpense = item.transactionType === "Expense";
  
    return (
    <View>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            // onPress={() => deleteTransaction(item.transactionID)}
          >
            <Icon name="cancel" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity onPress={() => editTransaction(item.transactionID)}>
          <Card style={styles.cardStyle}>
            <View style={styles.cardRow}>
              <Text style={styles.titleText}>{item.transactionTitle}</Text>
              <View style={styles.amountContainer}>
                <Icon
                  name={isExpense ? "arrow-down" : "arrow-up"}
                  size={18}
                  color={isExpense ? theme.colors.expense : theme.colors.income}
                />
                {/* Ensure this is inside a <Text> component */}
                <Text style={[styles.amountText, { color: isExpense ? theme.colors.expense : theme.colors.income }]}>
                  {item.transactionAmount}
                </Text>
              </View>
            </View>
            <Text style={styles.cardText}>{item.transactionCategory.join(' • ')}</Text>
            <Text style={styles.timeText}>{item.transactionTime}</Text> 
          </Card>
        </TouchableOpacity>
      </Swipeable>
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
            renderData({ item: item.transaction })
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

        {/* Transactions Search Bar : Title/ Category */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search Transactions"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Horizontal Month Filter */}
        <MonthFilter selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />

        {/* Summary Bar : Total Expenses and Incomes for Selected truck */}
        <View style={styles.summaryContainer}>
          <Text style={styles.expenseText}>Expenses: -${totalExpenses}</Text>
          <Text style={styles.incomeText}>Income: +${totalIncome}</Text>
        </View>
          
        <View style={{ flex: 1 }}>{renderGroupedTransactions()}</View>

        <RadialMenu navigation={navigation} />
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

    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 20
    },

    cardText: {
      color: "#fff",
      fontFamily: theme.fonts.medium.fontFamily,
    },

    cardStyle: {
      margin: 10,
      padding: 20,
      backgroundColor: '#181818',
      borderColor: theme.colors.secondary,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
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

  deleteButton: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "80%", 
    marginVertical: 10, 
    borderRadius: 10,
    padding: 10,
    marginRight: 10, 
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
  searchBar: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    fontSize: 16,
    color: "#333",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 5,
  },
  expenseText: {
    color: theme.colors.expense,
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily
  },
  incomeText: {
    color: theme.colors.income,
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily
  },
  dateHeader: {
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.description,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 10,
    textAlign: "center"
  },
})