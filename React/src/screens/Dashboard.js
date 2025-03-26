import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import InAppHeader from '../components/InAppHeader';
import InAppBackground from '../components/InAppBackground';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';
import RadialMenu from '../components/RadialMenu';

export default function Dashboard({ navigation }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-main.onrender.com/banks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBanks(data.banks);
      } else {
        console.error(data.message);
      }
      console.log('Fetch Banks Status:', data.status)
    } catch (error) {
      console.error("Error Fetching Banks:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBanks();
    }, [])
  );

  // const handleAddBank = () => {
  //   navigation.navigate('AddBank');
  // };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-main.onrender.com/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'StartScreen' }],
        });

        AsyncStorage.removeItem('access_token');
        console.log(data.message); // Logged Out Successfully
      } else {
        console.log(data.message); // An Error Occurred While Logging Out
      }
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };


  const renderBankItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.push('BankDetailsScreen', { bankID: item.bankID })} style={styles.bankCard}
      >
        <Text style={styles.bankCardTitle}>{item.bankTitle}</Text>
        <Text style={styles.bankCardAmount}>
          <Text style={styles.remainingBankCardAmount}>{item.remainingBankAmount} /</Text> {item.bankAmount}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <InAppBackground>
      <View style={styles.headerContainer}>
        <InAppHeader>Dashboard</InAppHeader>
      </View>

      <Text style={styles.sectionTitle}>Banks</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : banks.length === 0 ? (
        <Text style={styles.defaultText}>You Have No Banks Added Yet!</Text>
      ) : (
        <View style={styles.bankItemContainer}>
          <FlatList
            data={banks}
            renderItem={renderBankItem}
            keyExtractor={(item, index) => item?.bankID?.toString() ?? index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
          <Button mode="contained" style={styles.addButton}>
            <Text style={styles.buttonText}>+</Text>
          </Button>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleLogout}>Logout</Button>
      </View>
      <RadialMenu navigation={navigation} />
    </InAppBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  defaultText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    color: theme.colors.description,
    textAlign: 'center',
    marginTop: 10,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20
  },

  bankItem: {
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    margin: 5,
    padding: 15,
    borderRadius: 5,
  },

  bankCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: theme.fonts.bold.fontFamily,
    textAlign: 'center',
  },

  bankCardAmount: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.fonts.medium.fontFamily,
    marginBottom: 5,
    textAlign: 'center',
  },

  remainingBankCardAmount: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily,
    marginBottom: 5,
    textAlign: 'center',
  },

  bankItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },

  addButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },

  buttonText: {
    fontSize: 20,
    textAlign: "center",
    alignContent: "center",
    fontFamily: theme.fonts.bold.fontFamily,
  },

  buttonContainer: {
    // flex: 1,
    // justifyContent: 'flex-end',
  },

  button: {
    width: '100%',
    borderRadius: 8,
  },

  flatListContainer: {
    paddingVertical: 10,
  },

  bankCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 25,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
    marginLeft: 20,
  },
});
