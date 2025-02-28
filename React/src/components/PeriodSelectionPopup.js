import React from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const PeriodSelectionPopup = ({ setShowPeriodPopup, setSelectedPeriod }) => {

    // Handle period selection
    const handlePeriodSelect = (period) => {
        setSelectedPeriod(period);
        console.log('Selected Period:', period);
        setShowPeriodPopup(false);
    };

    return (
        <Modal transparent={true} visible={true} animationType='fade'>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Period</Text>


                    <TouchableOpacity onPress={() => handlePeriodSelect('Daily')} style={styles.optionButton}>
                        <Text style={styles.optionText}>Daily</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePeriodSelect('Weekly')} style={styles.optionButton}>
                        <Text style={styles.optionText}>Weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePeriodSelect('Monthly')} style={styles.optionButton}>
                        <Text style={styles.optionText}>Monthly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePeriodSelect('Yearly')} style={styles.optionButton}>
                        <Text style={styles.optionText}>Yearly</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => setShowPeriodPopup(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        width: 300,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    optionButton: {
        width: '100%',
        padding: 12,
        marginVertical: 5,
        backgroundColor: theme.colors.secondary,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionText: {
        fontSize: 16,
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.text,
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },

    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default PeriodSelectionPopup;
