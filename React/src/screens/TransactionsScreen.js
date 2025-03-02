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
import PlusFAB from '../components/PlusFAB';
import InAppBackground from '../components/InAppBackground';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';
import { theme } from '../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthFilter from '../components/MonthFilter';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function TransactionsScreen({ navigation }) {

  const [data, setData] = useState([

    { id: 1, transactionTitle: "Groceries", transactionAmount: 50, transactionType: "expense", transactionDate: "2025-02-25", transactionTime: "14:30", transactionCategory: "Food" },
    { id: 2, transactionTitle: "Salary", transactionAmount: 1000, transactionType: "income", transactionDate: "2025-02-20", transactionTime: "09:00", transactionCategory: "Salary" },
    { id: 3, transactionTitle: "Transport", transactionAmount: 20, transactionType: "expense", transactionDate: "2025-03-01", transactionTime: "18:00", transactionCategory: "Transport" },
    { id: 4, transactionTitle: "Entertainment", transactionAmount: 20, transactionType: "expense", transactionDate: "2024-12-25", transactionTime: "20:00", transactionCategory: "Leisure" },

  ]);


  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default the current month
  const [searchQuery, setSearchQuery] = useState("");

  const totalExpenses = data
  .filter((t) => new Date(t.transactionDate).getMonth() === selectedMonth && t.transactionType === "expense")
  .reduce((sum, t) => sum + parseFloat(t.transactionAmount), 0);

  const totalIncome = data
  .filter((t) => new Date(t.transactionDate).getMonth() === selectedMonth && t.transactionType === "income")
  .reduce((sum, t) => sum + parseFloat(t.transactionAmount), 0);


  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userID = await AsyncStorage.getItem("user_id");
      
      if (!token) {
        console.error('No Token Found');
        return;
      }
  
      const response = await fetch(`${API_URL_DEVICE}/transactions/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        const transactions = await response.json();
        console.log('Fetched Transactions:', transactions);
        setData(transactions);
      } else {
        console.error('Failed To Fetch Transactions:', response.statusText);
      }
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
            setData(data.filter((item) => item.id !== transactionID));
            Alert.alert("Succss", "Transaction deleted successfully.");

            },
        },
      ]
    );
  };

  //Edit Transaction 
  const editTransaction = (transactionID) => {
    navigation.push("AddTransaction", { transactionID });
  };

  const renderData = ({ item }) => {
    const isExpense = item.transactionType === "expense";
  
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTransaction(item.id)}
          >
            <Icon name="trash-can-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity onPress={() => editTransaction(item.id)}>
          <Card style={styles.cardStyle}>
            <View style={styles.cardRow}>
              <Text style={styles.titleText}>{item.transactionTitle}</Text>
              <View style={styles.amountContainer}>
                <Icon
                  name={isExpense ? "arrow-down" : "arrow-up"}
                  size={18}
                  color={isExpense ? "red" : "green"}
                />
                <Text style={[styles.amountText, { color: isExpense ? "red" : "green" }]}>
                  ${item.transactionAmount}
                </Text>
              </View>
            </View>
            <Text style={styles.dateText}>{item.transactionCategory}</Text>
            <Text style={styles.timeText}>{item.transactionTime}</Text> 
          </Card>
        </TouchableOpacity>
      </Swipeable>
    );
  };


  const renderGroupedTransactions = () => {
    return Object.keys(groupedTransactions).map((date) => (
      <View key={date}>
        <Text style={styles.dateHeader}>{date}</Text>
        {groupedTransactions[date].map((transaction) => renderData({ item: transaction }))}
      </View>
    ));
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.transactionsScreen}>
            <InAppBackground>
              <InAppHeader>Transactions</InAppHeader>

              {/* Transactions Search Bar : Title/ Category */}
              <TextInput
                style={styles.searchBar}
                placeholder="Search transactions..."
                placeholderTextColor="#888"
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
                
              {renderGroupedTransactions()}

              <PlusFAB onPress={() => navigation.push('AddTransaction')} />
            </InAppBackground>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
    dateText: {
      fontSize: 15,
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.description,
      lineHeight: 21,
      textAlign: 'center',
      paddingTop: 10
  },

  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70, // Adjust width
    height: "80%", // Keep it aligned vertically
    marginVertical: 10, // Adds space between items
    borderRadius: 10,
    padding: 10, // Adjust padding
    marginRight: 10, // Moves the icon slightly left from the edge
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5, 
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 5,
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
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  expenseText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "500", // Less bold
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    color: "#666", // Subtle gray
    borderRadius: 5,
    marginTop: 10,
  },
})