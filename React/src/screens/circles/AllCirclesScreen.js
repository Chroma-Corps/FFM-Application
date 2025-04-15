import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import InAppBackground from '../../components/InAppBackground';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';

export default function AllCirclesScreen({ navigation }) {
    const [userCircles, setUserCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTextInputPopup, setShowTextInputPopup] = useState(false);
    const [circleCode, setCircleCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');

    const handleJoinCircleTextInput = () => {
        setShowTextInputPopup(true);
    }

    const handleCloseModal = () => {
        setShowTextInputPopup(false);
        setCircleCode('');
    }

    const fetchCircles = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) throw new Error('No token found');

            const response = await fetch(`https://ffm-application-main.onrender.com/circles`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                setUserCircles(data.circles);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('Error Fetching User Circles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCircle = async () => {
        setJoinLoading(true);
        setJoinMessage('');

        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) throw new Error('No token found');

            const response = await fetch('https://ffm-application-main.onrender.com/add-to-circle', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ circleCode }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setJoinMessage(data.message || 'Successfully Joined The Circle');
                alert('Successfully Joined Circle!')
                handleCloseModal();
                fetchCircles();
            } else {
                setJoinMessage(data.message || 'Failed To Join The Circle');
            }
            console.log('Joining Circle Status:', data.status)
        } catch (err) {
            console.error('Error Joining Circle:', err);
            setJoinMessage('Error Joining The Circle');
        } finally {
            setJoinLoading(false);
        }
    };

    useEffect(() => {
        fetchCircles();
    }, []);

    const renderCircles = ({ item }) => (
        <View style={styles.circleItem}>
        <Image
            source={{ uri: item.circleImage }}
            style={[styles.circleImage, { borderWidth: 4, borderColor: item.circleColor }]}
        />
        <View>
            <Text style={styles.circleName}>{item.circleName}</Text>
            <Text style={styles.circleType}>{item.circleType}</Text>
        </View>
        </View>
    );

    return (
        <InAppBackground>
        <BackButton goBack={navigation.goBack} />
        <View style={styles.container}>
            <Header fontSize={30} style={{ color: theme.colors.primary }}>
            Your Circles
            </Header>
            {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
            <FlatList
                data={userCircles}
                renderItem={renderCircles}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false} 
            />
            )}
        </View>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleJoinCircleTextInput}>
                    Join Circle
                </Button>
            </View>
            {/* Modal For Entering Circle Code */}
            <Modal
                visible={showTextInputPopup}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Circle Code</Text>
                        <TextInput
                            style={styles.textInput}
                            value={circleCode}
                            onChangeText={setCircleCode}
                            placeholder="Enter Circle Code"
                            placeholderTextColor={'white'}
                            keyboardType="default"
                        />
                        <View style={styles.modalButtons}>
                        <TouchableOpacity title="Cancel" onPress={handleCloseModal}  style={[styles.buttons, {backgroundColor: theme.colors.expense}]} >
                                <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                onPress={handleJoinCircle}
                                disabled={joinLoading}
                                style={styles.buttons}
                            > 
                            <Text style={styles.buttonText}>{joinLoading ? 'Joining...' : 'Join'}</Text>
                            </TouchableOpacity>
                        </View>
                        {joinMessage ? <Text>{joinMessage}</Text> : null}
                    </View>
                </View>
            </Modal>
        </InAppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    circleImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 15,
    },
    circleName: {
      fontSize: 26,
      fontFamily: theme.fonts.bold.fontFamily,
      color: theme.colors.textSecondary,
    },
    circleType: {
      fontSize: 16,
      color: theme.colors.description,
      marginBottom: 20,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    circleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 20,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
    buttonContainer: {
      marginTop: 20,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold.fontFamily,
      marginBottom: 10,
      color: theme.colors.primary
    },
    textInput: {
      width: '100%',
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 5,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.medium.fontFamily
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    buttons: {
        backgroundColor: theme.colors.primary,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary
    },
});