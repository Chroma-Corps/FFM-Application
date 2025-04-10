import React, { useState } from 'react';
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import ViewDemoPopUp from '../components/ViewDemoPopUp';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme'

export default function PreviewDemoScreen({ navigation }) {
    const [selectedCircleType, setSelectedCircleType] = useState('Self');
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
            <Background style={{ flex: 1}}>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.container}>
                        <Card
                            id="Self"
                            source={require('../assets/maya_icon.png')}
                            text="Maya"
                            isSelected={selectedCircleType === 'Self'}
                        />

                        <Card
                            id="Group"
                            source={require('../assets/bob_icon.png')}
                            text="Bob"
                            isSelected={selectedCircleType === 'Group'}
                        />
                    </View>
                </View>

                <View style={{}}>
                    <View style={styles.descriptionContainer}>
                        {selectedCircleType === 'Self' && (
                            <View>
                                <Text style={styles.descriptionText}>
                                    Meet Maya Maywheather circle includes everything she needs to manage her personal finances.
                                    She can set budgeting goals, track her expenses, and stay on top of her financial progress—all in one place.
                                </Text>
                            </View>
                        )}
                        {selectedCircleType === 'Group' && (
                            <View>
                                <Text style={styles.descriptionText}>
                                    Meet Mr. Bob Bobberson Bob's circle includes all the tools his family needs to manage shared household finances.
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
                            style={{ marginTop: 10 }}
                        >
                            View Demo
                        </Button>
                    </View>
                )}
            </Background >

            <View style={styles.exitButtonContainer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('StartScreen')}
                    style={styles.exitButton}
                >
                    Exit
                </Button>
            </View>

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
    },

    demoImageContainer: {
        backgroundColor: theme.colors.secondary,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 90,
    },

    demoImage: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
    },


    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        gap: 20,
    },

    image: {
        width: 130,
        height: 130,
    },

    cardText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 17,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
    },

    selected: {
        backgroundColor: theme.colors.primaryDimmed,
        borderRadius: 20,
    },

    descriptionContainer: {
        paddingHorizontal: 20,
    },

    descriptionTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 20,
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: 10,
    },

    descriptionText: {
        fontFamily: theme.fonts.medium.fontFamily,
        fontSize: 17,
        textAlign: 'center',
        color: theme.colors.description,
        backgroundColor: theme.colors.primaryDimmed,
        borderRadius: 20,
        padding: 20,
    },

    exitButtonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
      },
      
      exitButton: {
        width: 100,
        backgroundColor: theme.colors.expense,
      },

})