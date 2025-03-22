import React, { useState, useCallback } from 'react';
import { Image, View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import InAppHeader from '../components/InAppHeader';
import InAppBackground from '../components/InAppBackground';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';
import RadialMenu from '../components/RadialMenu';
import { MaterialIcons } from '@expo/vector-icons'

export default function Dashboard({ navigation }) {
  const [banks, setBanks] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [circleType, setCircleType] = useState('');
  const [circles, setCircles] = useState([]);
  const [newCurrentCircle, setNewCurrentCircle] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);

  const fetchActiveCircle = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
  
      if (!token) {
        console.error('No Token Found');
        return;
      }
  
      const response = await fetch('http://192.168.0.9:8080/active-circle', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setCurrentCircle(data.activeCircle);
        setNewCurrentCircle(data.activeCircle);
        console.log("Updated Current Circle:", data.activeCircle);
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
  
      const response = await fetch('http://192.168.0.9:8080/active-circle', {
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

      const response = await fetch('http://192.168.0.9:8080/banks', {
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

  const fetchCircles = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('http://192.168.0.9:8080/circles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCircles(data.circles);
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
      fetchBanks();
      fetchCircles();
    }, [reload])
  );

  // const handleAddBank = () => {
  //   navigation.navigate('AddBank');
  // };

  const handleViewSwap = async () => {
    setNewCurrentCircle(null);
    if (circleType === 'Self') {
      setCircleType('Group');
    } else {
      setCircleType('Self');
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error('No Token Found');
        return;
      }

      const response = await fetch('http://192.168.0.9:8080/logout', {
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

  const renderBankItem = ( {item} ) => {
    return (
      <TouchableOpacity
        style={styles.bankCard}
      >
        <Text style={styles.bankCardTitle}>{item.bankTitle}</Text>
        <Text style={styles.bankCardAmount}>
          <Text style={styles.remainingBankCardAmount}>{item.remainingBankAmount} /</Text> {item.bankAmount}
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

  return (
    <InAppBackground>
      {circleType === 'Group' && (
      <View style={styles.container}>
        <View>
        <TouchableOpacity
            style={[styles.circle, { backgroundColor: "#306060"}]}
            onPress={() => handleViewSwap()}
          >
          <MaterialIcons name={"group"} size={30} color={"white"} style={styles.icon}/>
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
                  style={[styles.circle, { backgroundColor: "#306060"}]}
                  onPress={() => handleViewSwap()}
                />
                <Text style={styles.circleText}>Self</Text>
              </View>
            </View>
      )}
    <View key={reload ? "reloadKey" : "normalKey"}>
      <View style={styles.lineContainer}></View> 
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

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
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
});
