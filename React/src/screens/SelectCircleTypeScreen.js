import { React, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../components/Background'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme'

export default function SelectCircleTypeScreen({ navigation }) {
    const [selectedCircleType, setSelectedCircleType] = useState(null);

    const handlePress = (id) => {
        setSelectedCircleType(id);
    };

    const handleRegistrationContinue = async () => {
        if (selectedCircleType === 'Self') {
            navigation.navigate('SetupPersonalCircleScreen', { selectedCircleType });
        } else {
            navigation.navigate('SetupFamilyCircleScreen', { selectedCircleType });
        }
    };

    const Card = ({ id, source, text, isSelected }) => (
        <TouchableOpacity onPress={() => handlePress(id)}>
            <Image
                source={source}
                style={[
                    styles.image,
                    isSelected && styles.selected,
                    !isSelected && styles.unselected,
                ]}
            />
            <Text style={styles.cardText}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.startScreenContainer}>
            <Background justifyContent='flex-start'>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 40 }}>
                    <Header fontSize={40}>Get Started with Your Account</Header>
                    <Paragraph>
                        Choose the type of account that best suits your needs.
                    </Paragraph>
                </View>

                <View style={{ marginTop: 30 }}>
                    <Text style={styles.descriptionTitle}>Select Your Account Type</Text>
                    <View style={styles.container}>

                        <Card
                            id="Self"
                            source={require('../assets/personal_icon.png')}
                            text="Personal"
                            isSelected={selectedCircleType === 'Self'}
                        />

                        <Card
                            id="Group"
                            source={require('../assets/family_icon.png')}
                            text="Family"
                            isSelected={selectedCircleType === 'Group'}
                        />
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                    <View style={styles.descriptionContainer}>
                        {selectedCircleType === 'Self' && (
                            <View>
                                <Text style={[styles.descriptionTitle, { backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Personal Circle</Text>
                                <Text style={styles.descriptionText}>
                                    This circle is for managing your personal finances.
                                    Set budgeting goals, track expenses, and stay on top of your financial progress.
                                </Text>
                            </View>
                        )}
                        {selectedCircleType === 'Group' && (
                            <View>
                                <Text style={[styles.descriptionTitle, { backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Family Circle</Text>
                                <Text style={styles.descriptionText}>
                                    This circle is for managing shared household finances.
                                    Set joint budgeting goals, track family expenses, and stay on the same page with everyone’s spending.
                                </Text>
                            </View>
                        )}
                    </View>

                    {selectedCircleType && (
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
        backgroundColor: theme.colors.surface,
        width: '100%',
    },

    container: {
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        gap: 20,
    },

    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
        tintColor: 'white'
    },

    cardText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        color: theme.colors.description,
        textAlign: 'center',
        marginTop: 10,
    },

    selected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },

    unselected: {
        borderColor: 'black',
    },

    descriptionContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },

    descriptionTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.description,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },

    descriptionText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        textAlign: 'center',
        color: theme.colors.description,
    },
})