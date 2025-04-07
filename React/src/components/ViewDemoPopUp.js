import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Background from '../components/Background';
import Slider from '../components/Slider';
import { theme } from '../core/theme';

const ViewDemoPopUp = ({ selectedCircleType, setShowPreviewDemoPopup }) => {

    const [entries] = useState([
        {
            title: 'Track Personal Expenses',
            color: '#6A4E23',
            description: 'Keep tabs on every dollar you spend with ease. Whether it’s groceries, bills, or your daily coffee run — effortlessly log your expenses and take charge of your spending.',
            image: require('../assets/default_img.jpg'),
        },
        {
            title: 'Set Your Budgets',
            color: '#4682B4',
            description: 'Build smart, flexible budgets tailored to your lifestyle. Plan for bills, savings, and fun without the guesswork — and stay on top of your goals month after month.',
            image: require('../assets/default_img.jpg'),
        },
        {
            title: 'Track Financial Progress',
            color: '#8B4513',
            description: 'Your personalized dashboard gives you a clear view of your financial health. Instantly see your balances, track how your budget is doing, and celebrate your financial wins, big or small.',
            image: require('../assets/default_img.jpg'),
        },
    ]);

    const imageSource = selectedCircleType === 'Self'
        ? require('../assets/maya_icon.png')
        : require('../assets/bob_icon.png');

    return (
        <Modal
            visible={true}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowPreviewDemoPopup(false)}
        >
            <Background justifyContent="center">

                <Text style={styles.popupTitle}>
                    {selectedCircleType === 'Self' ? "Personal View" : "Family View"}
                </Text>

                <View style={styles.modalContent}>
                    <View style={styles.imageCircleContainer}>
                        <Image source={imageSource} style={styles.imageCircle} />
                        <Text style={styles.imageText}>
                            {selectedCircleType === 'Self' ? "Maya's POV" : "Bob's POV"}
                        </Text>
                    </View>

                    <View style={styles.sliderContainer}>
                        <Slider
                            data={entries}
                            width={350}
                            height={500}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowPreviewDemoPopup(false)}
                    >
                        <Text style={styles.closeText}>Exit Demo</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        width: '100%',
        height: '90%',
        backgroundColor: 'transparent',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

    popupTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        backgroundColor: theme.colors.primary,
        width: '70%',
        borderRadius: 15,
        position: 'absolute',
        top: 35,
        fontSize: 32,
        textAlign: 'center',
        zIndex: 10,
    },

    imageCircleContainer: {
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: theme.colors.primary,
    },

    imageText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 15,
        color: theme.colors.description,
        textAlign: 'center',
    },

    sliderContainer: {
        alignSelf: 'center',
    },

    text: {
        fontSize: 18,
        marginTop: 10,
        color: '#666',
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: '#E57373',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeText: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        fontSize: 18,
    },
});

export default ViewDemoPopUp;
