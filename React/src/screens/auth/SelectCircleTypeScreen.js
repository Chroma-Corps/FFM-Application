import { React, useState } from 'react'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Paragraph from '../../components/Paragraph'
import Button from '../../components/Button'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../core/theme'
import { MaterialIcons } from '@expo/vector-icons'; 

export default function SelectCircleTypeScreen({ navigation }) {
    const [newUserSelectedCircleType, setNewUserSelectedCircleType] = useState(null);

    const handlePress = (id) => {
        setNewUserSelectedCircleType(id);
    };

    const handleRegistrationContinue = async () => {
        navigation.navigate('CreateCircle', { newUserSelectedCircleType });
    };

    const Card = ({ id, iconName, text, isSelected }) => (
        <TouchableOpacity onPress={() => handlePress(id)} style={{ alignItems: 'center' }}>
          <MaterialIcons
            name={iconName}
            size={150}
            color={isSelected ? theme.colors.primary : '#888'}
            style={[
              isSelected && { backgroundColor: '#E0F0FF', borderRadius: 12, padding: 8 },
            ]}
          />
          <Text style={{
                        fontFamily: theme.fonts.bold.fontFamily, 
                        color: isSelected ? '#007AFF' : '#333' }}>
            {text}
          </Text>
        </TouchableOpacity>
      );

    return (
        <View style={styles.startScreenContainer}>
            <Background>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 40 }}>
                    <Header fontSize={30}>Getting Started</Header>
                    <Paragraph>
                        Choose the type of account that best suits your needs.
                    </Paragraph>
                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={styles.container}>

                        <Card
                            id="Self"
                            iconName="person"
                            isSelected={newUserSelectedCircleType === 'Self'}
                        />
                    
                        <Card
                            id="Group"
                            iconName="group"
                            isSelected={newUserSelectedCircleType === 'Group'}
                        />
                    </View>
                </View>

                <View>
                    <View style={styles.descriptionContainer}>
                        {newUserSelectedCircleType === 'Self' && (
                            <View>
                                <Text style={[styles.descriptionTitle, { backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Self Circle</Text>
                                <Text style={styles.descriptionText}>
                                    This circle is for managing your personal finances. 
                                    Set budgeting goals, track your spending, and monitor your financial progress. 
                                    Gain insights into your spending habits and make informed decisions to achieve your financial goals.
                                </Text>
                            </View>
                        )}
                        {newUserSelectedCircleType === 'Group' && (
                            <View>
                                <Text style={[styles.descriptionTitle, { backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Group Circle</Text>
                                <Text style={styles.descriptionText}>
                                    This circle is for managing shared household finances.
                                    Set joint budgeting goals, track expenses, and stay on top of everyone's spending.
                                    Collaborate in real-time to ensure financial harmony and avoid misunderstandings.
                                </Text>
                            </View>
                        )}
                        {newUserSelectedCircleType === null && (
                            <View>
                                <Text style={[styles.descriptionTitle, { backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Circles</Text>
                                <Text style={styles.descriptionText}>
                                    Circles help you organize your finances by purpose!
                                    Choose 'Self' to manage personal budgets, or 'Group' to collaborate on shared expenses.
                                </Text>
                            </View>
                        )}
                    </View>

                    {newUserSelectedCircleType && (
                        <View style={{ alignSelf: 'center', width: '50%', marginTop: 40 }}>
                            <Button
                                mode="contained"
                                onPress={handleRegistrationContinue}
                            >
                                Continue
                            </Button>
                        </View>
                    )}
                </View>

            </Background >
        </View >
    )
}

const styles = StyleSheet.create({
    startScreenContainer: {
        flex: 1,
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 20,
        gap: 20,
    },

    descriptionContainer: {
        marginTop: 10,
    },

    descriptionTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.description,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },

    descriptionText: {
        fontFamily: theme.fonts.medium.fontFamily,
        fontSize: 15,
        textAlign: 'center',
        color: theme.colors.description,
    },
})