import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Background from '../components/Background';
import Slider from '../components/Slider';
import { theme } from '../core/theme';

const ViewDemoPopUp = ({ selectedCircleType, setShowPreviewDemoPopup }) => {

    const [personalFeatures] = useState([
        {
            title: 'Analyze Spending & Income',
            color: '#6A4E23',
            description: 'Gain full control of your finances with insights into income, expenses, and spending trends effortlessly track where your money goes!',
            image: require('../assets/bank_details_screen.jpeg'),
        },
        {
            title: 'Set Personal Budgets',
            color: '#4682B4',
            description: 'Create custom budgets to manage bills, savings, and fun while tracking progress toward your goals with ease.',
            image: require('../assets/maya_budget.jpg'),
        },
        {
            title: 'Set Personal Goals',
            color: '#8B4513',
            description: 'Set and track your short-term financial goals, no matter how small, and stay motivated as you achieve each milestone.',
            image: require('../assets/maya_goal.jpg'),
        },
    ]);


    const [familyFeatures] = useState([
        {
            title: 'Set Collaborative Budgets',
            color: '#6A4E23',
            description: 'Easily create and manage budgets with your family, track shared expenses, and stay on top of financial goals together.',
            image: require('../assets/bob_budgets.jpg'),
        },
        {
            title: 'Track Circle Activity',
            color: '#4682B4',
            description: 'Monitor family spending and saving activities in real-time to keep everyone aligned with your financial plans.',
            image: require('../assets/bob_circle.jpg'),
        },
        {
            title: 'Set Collaborative Goals',
            color: '#4682B4',
            description: "Set and track shared savings or spending goals with your family, making it easier to achieve financial milestones together.",
            image: require('../assets/bob_goal.jpg'),
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
                <View style={styles.modalContent}>
                    <View style={styles.imageCircleContainer}>
                        <Image source={imageSource} style={styles.imageCircle} />
                        <Text style={styles.imageText}>
                            {selectedCircleType === 'Self' ? "Maya's POV" : "Bob's POV"}
                        </Text>
                    </View>

                    <View style={styles.sliderContainer}>
                        <Slider
                            data={selectedCircleType === 'Self' ? personalFeatures : familyFeatures}
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
        backgroundColor: 'transparent',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
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

    closeButton: {
        marginTop: 20,
        backgroundColor: theme.colors.expense,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeText: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        fontSize: 18,
    },
});

export default ViewDemoPopUp;