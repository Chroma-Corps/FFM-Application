import React, { useState, useCallback } from 'react';
import { Image, View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Button from '../../components/Button';
import InAppHeader from '../../components/InAppHeader';
import InAppBackground from '../../components/InAppBackground';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../core/theme';
import RadialMenu from '../../components/RadialMenu';
import { MaterialIcons } from '@expo/vector-icons'
import StreakIcon from '../../assets/icons/streak.svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Dashboard({ navigation }) {
  const [banks, setBanks] = useState([]);
  const [userName, setUserName] = useState([]);
  const [streak, setStreak] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [circleType, setCircleType] = useState('');
  const [circles, setCircles] = useState([]);
  const [newCurrentCircle, setNewCurrentCircle] = useState([]);
  const [selfCircle, setSelfCircle] = useState([]);
  const [haveGroupCircle, setHaveGroup] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);
  const [prevCircle, setPrevCircle] = useState(null);
  const [defaultCirle, setDefaultCircle] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState(null);
  const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

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

  const fetchActiveCircle = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-main.onrender.com/active-circle', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setPrevCircle(currentCircle);
        setCurrentCircle(data.activeCircle);
        setNewCurrentCircle(data.activeCircle);
        // console.log("Updated Current Circle:", data.activeCircle);
        setCircleType(data.activeCircle.circleType)
      } else {
        console.error(data.message);
      }
      console.log('Fetch Active Circle Status:', data.status)
    } catch (error) {
      console.error("Error Fetching Active Circle:", error);
    }
  }

  const setActiveCircle = async (circleID) => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-main.onrender.com/active-circle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          circleID: circleID,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setReload(prevState => !prevState);
        fetchActiveCircle();
      } else {
        console.error(data.message);
      }
      console.log('Set Active Circle Status:', data.status)
    } catch (error) {
      console.error("Error Setting Active Circle:", error);
    }
  };

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

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-main.onrender.com/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserName(data.user.name);
      } else {
        console.error(data.message);
      }
      console.log('Fetch User Status:', data.status)
    } catch (error) {
      console.error("Error Fetching User:", error);
    }
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
          const latestTwo = data.transactions?.slice(0, 2) || [];
          setRecentTransactions(latestTwo);
          console.log("Latest Two Transactions:", latestTwo);
        }
        else {
          console.error(data.message);
        } 
        console.log('Fetch Transactions Status:', data.status)
      } catch (error) {
        console.error('Error Fetching Transactions:', error);
      } finally {
        setLoading(false);
      }
    };

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
          </TouchableOpacity>
      </View>
      );
    };

  const fetchCircles = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('https://ffm-application-main.onrender.com/circles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCircles(data.circles);
        
        const self = data.circles.find(circle => circle.circleType === 'Self');
        const group = data.circles.find(circle => circle.circleType === 'Group');
 
        if (self) {
            setSelfCircle(self);
        } else {
            setSelfCircle(null); 
        }
    
        if (group) {
            setHaveGroup(group);
        } else {
            setHaveGroup(null);
        }
      } else {
        console.error(data.message);
      }
      console.log('Fetch Circles Status:', data.status)
    } catch (error) {
      console.error("Error Fetching Circles:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchActiveCircle();
      fetchUser();
      fetchBanks();
      fetchCircles();
      fetchTransactions();
    }, [reload])
  );

  const handleAddBank = () => {
    navigation.navigate('CreateBank');
  };

  const handleSettings = () => {
    navigation.navigate('Settings')
  }

  const handleViewSwap = async () => {
    if (circleType === 'Group' && selfCircle && selfCircle.circleID) {
      setCircleType('Self');
      setActiveCircle(selfCircle.circleID);
    } else {
      if (!haveGroupCircle) {
        return;
      } else {
        setActiveCircle(haveGroupCircle.circleID);
        setCircleType('Group');
      }
    }
  };

  const renderBankItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.push('BankDetails', { bankID: item.bankID })} style={[styles.bankCard, { borderColor: item.color || theme.colors.primary }]}
      >
        <Text style={styles.bankCardTitle}>{item.bankTitle}</Text>
        <Text style={styles.bankCardAmount}>
          <Text style={styles.remainingBankCardAmount}>{item.remainingBankAmount}</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCircleItem = ({ item }) => {
    const isSelected = newCurrentCircle?.circleID === item.circleID;
    return (
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[
            styles.circle,
            { borderColor: isSelected ? item.circleColor : 'transparent' }
          ]}
          onPress={() => {
            setNewCurrentCircle(item);
            setActiveCircle(item.circleID);
          }}
        >
          {item.circleImage && (
            <Image source={{ uri: item.circleImage }} style={styles.circleImage} />
          )}
        </TouchableOpacity>
        <Text
          style={[
            styles.circleText,
            { color: isSelected ? item.circleColor : theme.colors.textSecondary }
          ]}
        >
          {item.circleName}
        </Text>
      </View>
    );
  };

  // const getFontSize = (count) => {
  //   const length = count.toString().length;
  //   return length > 3 ? 40 : 45;
  // }

  return (
    <InAppBackground>
      {circleType === 'Group' && (
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={[styles.circle, { backgroundColor: "#306060" }]}
              onPress={() => handleViewSwap()}
            >
              <MaterialIcons name={"group"} size={30} color={"white"} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.circleText}>Circles</Text>
          </View>
          <FlatList
            data={circles.filter(circle => circle.circleType === 'Group')}
            renderItem={renderCircleItem}
            keyExtractor={(item, index) => item?.circleID?.toString() ?? index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {circleType === 'Self' && (
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={[styles.circle, { backgroundColor: "#306060" }]}
              onPress={() => handleViewSwap()}
            >
              <MaterialIcons name={"person"} size={30} color={"white"} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.circleText}>Self</Text>
          </View>
          <Text style={styles.selfViewText}>Hi, {userName}</Text>
        </View>
      )}

      <View key={reload ? "reloadKey" : "normalKey"}>
        <View style={styles.lineContainer}></View>
        <View style={styles.headerContainer}>
          <InAppHeader>Dashboard</InAppHeader>
          <TouchableOpacity onPress={handleSettings}>
            <MaterialIcons name="settings" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.streakContainer}>
          <TouchableOpacity
            style={[styles.streakCircle, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.streakCountText}>
              {streak.streakCount > 0 ? streak.streakCount : 0}
            </Text>
          </TouchableOpacity>
          <View style={styles.streakInfo}>
            <View style={styles.streakHeader}>
              <Text style={styles.sectionTitle}>Streaks</Text>
              <StreakIcon />
            </View>
            <View style={styles.streakMiniCirclesContainer}>
              {days.map((day, index) => (
                <View key={index} style={{ alignItems: 'center' }}>
                  <View style={[styles.streakMiniCircles, { backgroundColor: theme.colors.primary }]}>
                    <MaterialIcons name="check" size={20} color="white" />
                  </View>
                  <Text style={styles.streakDayText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Wallets</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : banks.length === 0 ? (
          <View style={styles.bankItemContainer}>
            <Text style={[styles.defaultText, {paddingHorizontal: 17}]}>You Have No Wallets Added Yet!</Text>
            <Button onPress={handleAddBank} mode="contained" style={styles.addButton}>
              <Text style={styles.buttonText}>+</Text>
            </Button>
          </View>
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
            <Button onPress={handleAddBank} mode="contained" style={styles.addButton}>
              <Text style={styles.buttonText}>+</Text>
            </Button>
          </View>
        )}
       {circleType === 'Group' && (
          <View>
            <Text style={styles.sectionTitle}>Most Recent Activity</Text>
            {Array.isArray(recentTransactions) && recentTransactions.length > 0 ? (
              <FlatList
                data={recentTransactions}
                keyExtractor={(item) => `transaction-${item.transactionID}`}
                renderItem={({ item }) => renderTransaction({ item })}
              />
            ) : (
              <Text style={styles.noRecentActivityText}>No Recent Activity</Text>
            )}
            <TouchableOpacity
              style={styles.viewCircleContainer}
              onPress={() => navigation.navigate('CircleDetails', { circle: currentCircle })}>
              <Text style={styles.viewCircleText}>View Circle</Text>
            </TouchableOpacity>
          </View>
        )}
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

  noRecentActivityText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    color: theme.colors.description,
    textAlign: 'center',
    margin: 20,
  },

  lineContainer: {
    borderTopWidth: 2,
    borderTopColor: '#494949',
    borderRadius: 50,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
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
    borderWidth: 3,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
    marginLeft: 20,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-evenly'
  },

  streakInfo: {
    flexDirection: 'column',
    gap: 10,
  },

  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 10,
  },

  streakCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    color: theme.colors.primary,
    marginLeft: 20,
  },

  streakCountText: {
    fontSize: 45,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
    alignSelf: 'center'
  },

  streakMiniCirclesContainer: {
    flexDirection: 'row',
  },

  streakMiniCircles: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  streakDayText: {
    fontSize: 10,
    marginLeft: 10,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
  },

  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginHorizontal: 10,
    borderWidth: 4,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleText: {
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  circleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },

  viewCircleContainer: {
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: '30%',
    backgroundColor: "#306060",
  },

  viewCircleText: {
    fontSize: 15,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
  },

  selfViewText: {
    fontSize: 25,
    marginLeft: 10,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
  },
  cardStyle: {
    margin: 15,
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 2,
    borderColor: theme.colors.primaryDimmed,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    color: theme.colors.surface,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5, 
  },
  amountText: {
    fontSize: 15,
    color: '#E57373',
    fontFamily: theme.fonts.bold.fontFamily,
  },
  cardText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  timeText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.description,
    textAlign: "right",
    marginRight: 10,
  },

});
