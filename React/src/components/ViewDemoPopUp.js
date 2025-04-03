import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Background from '../components/Background';
import { theme } from '../core/theme';

const ViewDemoPopUp = ({ selectedCircleType, setShowPreviewDemoPopup }) => {

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

                <Text style={styles.popupTitle}>Preview Demo</Text>

                <View style={styles.modalContent}>
                    <View style={styles.imageCircleContainer}>
                        <Image source={imageSource} style={styles.imageCircle} />
                        <Text style={styles.imageText}>
                            {selectedCircleType === 'Self' ? "Maya's POV" : "Bob's POV"}
                        </Text>
                    </View>


                    <Text style={styles.text}>
                        Selected Circle Type: {selectedCircleType}
                    </Text>

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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

    popupTitle: {
        fontFamily: theme.fonts.bold.fontFamily,
        color: 'white',
        backgroundColor: theme.colors.secondary,
        width: '70%',
        borderRadius: 15,
        position: 'absolute',
        top: 40,
        fontSize: 32,
        textAlign: 'center',
        zIndex: 10,
    },

    imageCircleContainer: {
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#ddd',
    },

    imageText: {
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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
