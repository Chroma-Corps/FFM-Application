import { React, useState } from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import ArrowButton from '../components/ArrowButton'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme'

export default function SetupStartScreen({ navigation }) {

    const [selectedCircleType, setSelectedCircleType] = useState(null);

    const handlePress = (id) => {
        setSelectedCircleType(id);
    };

    console.log("Selected:", selectedCircleType);

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

                <View style={styles.descriptionContainer}>
                    {selectedCircleType === 'Self' && (
                        <Text style={styles.descriptionText}>
                            A personal account is for individual use. You can manage your own finances and keep track of your expenses.
                        </Text>
                    )}
                    {selectedCircleType === 'Group' && (
                        <Text style={styles.descriptionText}>
                            A family account is for shared use among family members. You can manage your household finances and keep track of your expenses together.
                        </Text>
                    )}
                </View>

                <ArrowButton direction="left" onPress={() => navigation.navigate('StartScreen')} />
                <ArrowButton direction="right" onPress={() => navigation.navigate('SetupCircleScreen')} />

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
        marginTop: 80,
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
        borderColor: 'black',
    },

    cardText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
    },

    selected: {
        borderColor: theme.colors.primary,
    },

    unselected: {
        borderColor: 'black',
    },

    descriptionContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },

    descriptionText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        textAlign: 'center',
        color: '#666',
    },
})