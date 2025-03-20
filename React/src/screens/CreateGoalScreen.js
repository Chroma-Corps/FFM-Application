import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import BackButton from '../components/BackButton';

export default function CreateGoalsScreen({ navigation }) {

    const createGoal = async () => {
        return
    }

return (
    <View style={styles.createGoalScreen}>
        <InAppBackground>
            <BackButton goBack={navigation.goBack} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                <View>
                    <View style={styles.headerContainer}>
                        <View style={styles.cardTitle}>
                            <InAppHeader>New Goal</InAppHeader>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={createGoal} style={styles.buttonStyle}>
                    Create
                </Button>
            </View>
        </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    createGoalScreen: {
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