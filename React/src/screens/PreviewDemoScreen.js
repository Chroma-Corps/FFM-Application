import React, { useState } from 'react';
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import ViewDemoPopUp from '../components/ViewDemoPopUp';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme'

export default function PreviewDemoScreen({ navigation }) {
    const [selectedCircleType, setSelectedCircleType] = useState(null);
    const [showPreviewDemoPopup, setShowPreviewDemoPopup] = useState(false);

    const handlePress = (id) => {
        setSelectedCircleType(id);
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

                <View style={{ alignItems: 'center', width: '100%', marginTop: 40 }}>
                    <Image
                        source={require('../assets/money_icon.png')}
                        style={styles.demoImage}
                    />

                    <Header fontSize={40}>From Every Penny To Every Posibility</Header>
                </View>

                <View style={{ marginTop: 5 }}>
                    <Text style={styles.descriptionTitle}>Select Demo View</Text>
                    <View style={styles.container}>

                        <Card
                            id="Self"
                            source={require('../assets/maya_icon.png')}
                            text="Personal"
                            isSelected={selectedCircleType === 'Self'}
                        />

                        <Card
                            id="Group"
                            source={require('../assets/bob_icon.png')}
                            text="Family"
                            isSelected={selectedCircleType === 'Group'}
                        />
                    </View>
                </View>

                <View style={{}}>
                    <View style={styles.descriptionContainer}>
                        {selectedCircleType === 'Self' && (
                            <View>
                                <Text style={[styles.descriptionTitle, { color: 'white', backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Meet Maya</Text>
                                <Text style={styles.descriptionText}>
                                    Maya’s circle includes everything she needs to manage her personal finances.
                                    She can set budgeting goals, track her expenses, and stay on top of her financial progress—all in one place.
                                </Text>
                            </View>
                        )}
                        {selectedCircleType === 'Group' && (
                            <View>
                                <Text style={[styles.descriptionTitle, { color: 'white', backgroundColor: theme.colors.primary, paddingVertical: 5, borderRadius: 5 }]}>Meet Bob</Text>
                                <Text style={styles.descriptionText}>
                                    Bob’s circle includes all the tools his family needs to manage shared household finances.
                                    He can set joint budgeting goals, track family expenses, and ensure everyone stays on the same page with their spending.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {selectedCircleType && (
                    <View>
                        <Button
                            mode="contained"
                            onPress={() => setShowPreviewDemoPopup(true)}
                            style={{ marginVertical: 0, marginTop: 10, width: 200 }}
                        >
                            Start Preview
                        </Button>
                    </View>
                )}

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('StartScreen')}
                    style={{ width: 100, backgroundColor: '#E57373' }}
                >
                    Exit
                </Button>

            </Background >

            {showPreviewDemoPopup && (
                <ViewDemoPopUp
                    selectedCircleType={selectedCircleType}
                    setShowPreviewDemoPopup={setShowPreviewDemoPopup}
                />
            )}
        </View >
    )
}

const styles = StyleSheet.create({
    startScreenContainer: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },

    demoImage: {
        width: 90,
        height: 90,
        margin: 0,
        padding: 0,
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
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
        borderColor: 'black',
        backgroundColor: theme.colors.secondary,
    },

    unselected: {
        borderColor: 'black',
    },

    descriptionContainer: {
        paddingHorizontal: 20,
    },

    descriptionTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },

    descriptionText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        textAlign: 'center',
        color: '#666',
    },

})