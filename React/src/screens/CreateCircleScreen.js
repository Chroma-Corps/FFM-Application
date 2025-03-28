import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import InAppHeader from '../components/InAppHeader';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateCircleScreen({ navigation }) {

    const [circleName, setCircleName] = useState('');
    const [circleType, setCircleType] = useState('');

    const createCircle = async () => {
        return
        // const token = await AsyncStorage.getItem('access_token');

        // if (!token) {
        //     console.error('No Token Found');
        //     return;
        // }

        // if (!goalTitle || !startDate || !endDate || !targetAmount || !goalType) {
        //     Alert.alert('Error', 'Please Fill In All Fields');
        //     return;
        // }

        // try {
        //     const response = await fetch(`https://ffm-application-main.onrender.com/create-goal`, {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             goalTitle: goalTitle.trim(),
        //             targetAmount: targetAmount,
        //             goalType: goalType.toUpperCase(),
        //             startDate: startDate,
        //             endDate: endDate,
        //         })
        //     });

        //     if (response.ok) {
        //         Alert.alert('Success', 'Goal Created Successfully');
        //         navigation.goBack();
        //     } else {
        //         Alert.alert('Error', 'Failed To Create Goal');
        //         console.error(response.statusText);
        //     }
        // } catch (error) {
        //     console.error(error);
        //     Alert.alert('Error', 'Something Went Wrong');
        // }
    };

return (
    <View style={styles.createCircleScreen}>
        <InAppBackground>
            <BackButton goBack={navigation.goBack} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                <View>
                    <View style={styles.headerContainer}>
                        <View style={styles.cardTitle}>
                            <InAppHeader>New Circle</InAppHeader>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={createCircle} style={styles.buttonStyle}>
                    Create Circle
                </Button>
            </View>
        </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    createCircleScreen: {
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
});