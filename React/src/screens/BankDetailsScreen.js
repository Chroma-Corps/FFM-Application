import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import InAppHeader from '../components/InAppHeader'
import PlusFAB from '../components/PlusFAB';
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import ProgressBar from '../components/ProgressBar';
import CircleGraph from '../components/CircleGraph';
import BudgetsScreen from './BudgetsScreen';

export default function BankDetailsScreen({ navigation, route }) {
    const { bankID } = route.params;
    const [bankDetails, setBankDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBankDetails = async () => {

            try {
                const response = await fetch(`https://ffm-application-midterm.onrender.com/bank/${bankID}`);
                if (response.ok) {
                    const data = await response.json();
                    setBankDetails(data);
                } else {
                    console.error('Failed to fetch bank details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching bank details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBankDetails();
    }, [bankID]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!bankDetails) {
        return (
            <View style={styles.bankDetailsScreen}>
                <InAppBackground>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.defaultText}>No Bank Details Available</Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }


    return (

        <View style={styles.bankDetailsScreen}>
            <InAppBackground>

                <BackButton goBack={navigation.goBack} />

                <View style={styles.bankDetailsContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.defaultText, { fontSize: 40 }]}>{bankDetails.bankTitle}</Text>
                        <Text style={[styles.defaultText, { fontSize: 30 }]}>{bankDetails.bankAmount}</Text>

                    </View>

                    <View style={styles.bankStatisticsContainer}>
                        <Text style={[styles.defaultText, { fontSize: 15 }]}>Graph Goes Here</Text>
                        <Text style={[styles.defaultText, { fontSize: 15 }]}>Graph key Goes Here</Text>
                    </View>

                </View>

            </InAppBackground>
        </View>

    );
}

const styles = StyleSheet.create({
    bankDetailsScreen: {
        flex: 1,
    },

    bankDetailsContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    defaultText: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        color: 'white',
    },

    headerContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },

    bankStatisticsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
});
