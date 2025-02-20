import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

const NotificationBell = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.bellButton}>
                <Image source={require("../assets/bell.png")} style={styles.bellIcon} />
            </TouchableOpacity>

            {/* I dont know how we gonna connect real time notifications to this :D */}
            <Modal transparent={true} visible={modalVisible} animationType='fade'>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notifications</Text>
                        <Text style={styles.modalText}>You have no new notifications.</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 20,
        right: 20,
    },

    bellButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },

    bellIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },

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

    modalText: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
    },

    closeButton: {
        marginTop: 15,
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

export default NotificationBell;
