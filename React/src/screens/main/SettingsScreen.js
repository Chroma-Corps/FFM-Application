import React from 'react';
import { ScrollView, View, StyleSheet} from 'react-native';
import InAppHeader from '../../components/InAppHeader';
import Button from '../../components/Button';
import InAppBackground from '../../components/InAppBackground';
import BackButton from '../../components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {

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
              routes: [{ name: 'MainAuthScreen' }],
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

return (
    <View style={styles.settingsScreen}>
        <InAppBackground>
            <BackButton goBack={navigation.goBack} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                <View>
                    <View style={styles.headerContainer}>
                        <View style={styles.cardTitle}>
                            <InAppHeader>Settings</InAppHeader>
                        </View>
                    </View>
                    <View style={styles.settingContent}>
                        <Button mode="contained" onPress={() => navigation.navigate('AllCircles')}>Circles</Button>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleLogout}>Logout</Button>
            </View>
        </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    settingsScreen: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    headerContainer: {
        flex: 1,
        flexDirection: 'coloumn',
    },

    cardTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
    },

    buttonContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        padding: 10,
    },
    settingContent: {
      justifyContent: 'center',
      width: '100%',
      padding: 10,
  },
});