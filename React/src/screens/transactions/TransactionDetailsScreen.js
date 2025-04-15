import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native';
import { theme } from '../../core/theme'
import BackButton from '../../components/BackButton'
import InAppBackground from '../../components/InAppBackground';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransactionDetailsScreen({ navigation, route }) {
    const { transactionID } = route.params;
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://ffm-application-main.onrender.com/transaction/${transactionID}`);
            const data = await response.json();

            if (response.ok) {
                setTransactionDetails(data.transaction);
            } else {
                console.error("Fetch Transaction Details Error:", data.message);
            }
        } catch (error) {
            console.error('Error Fetching Transaction Details:', error);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchTransactionDetails();
        }, [transactionID])
    );

    const voidTransaction = async (transactionID) => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("access_token");
            
                if (!token) {
                    console.error('No Token Found');
                    return;
                }
            
                const response = await fetch(`https://ffm-application-main.onrender.com/${transactionID}/void`, {
                    method: 'PUT',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }
                });
            
                const data = await response.json();
            
                if (response.ok) {
                    alert(data.message)
                    navigation.goBack
                } else {
                    console.error(data.message);
                }
                console.log('Void Transaction Status:', data.status)
            } catch (error) {
                console.error('Error Fetching Transactions:', error);
            } finally {
                setLoading(false);
            }
        };

    if (loading) {
            return (
                <InAppBackground>
                    <BackButton goBack={navigation.goBack} />
                    <View style={styles.centeredMessageContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading Transaction Details...</Text>
                    </View>
                </InAppBackground>
            );
    }

    if (!transactionDetails) {
        return (
            <View style={styles.container}>
                <InAppBackground>
                    <BackButton goBack={navigation.goBack} />
                    <View style={styles.centered}>
                        <Text style={styles.descriptionText}>Transaction Details Could Not Be Loaded.</Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                <View style={{alignSelf: 'flex-end', marginRight: 10, alignContent:'center', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={null} style={{ alignSelf: 'flex-end', marginRight: 20, marginTop: 10 }}>
                        <MaterialIcons name={"visibility-off"} size={25} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.push('UpdateTransaction', { transactionID: transactionID })} style={{ alignSelf: 'flex-end', marginRight: 20, marginTop: 10 }}>
                        <MaterialIcons name={"edit"} size={25} color={"white"} />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={[styles.contentContainer, { borderColor: theme.colors.primary}]}>
                        <Text style={styles.titleText}>{transactionDetails.transactionTitle}</Text>
                        <Text style={styles.amountText}>{transactionDetails.transactionAmount}</Text>
                        <Text style={styles.createdByText}>Created By {transactionDetails.owner}</Text>
                    </View>
                    <Text
                        style={[
                            styles.categoryText,
                            {
                                backgroundColor:
                                transactionDetails.transactionType?.toLowerCase() === 'income'
                                ? theme.colors.income
                                : transactionDetails.transactionType?.toLowerCase() === 'expense'
                                    ? theme.colors.expense
                                    : theme.colors.primary
                            }
                        ]}
                    >
                        {transactionDetails.transactionType ?? 'Type N/A'} Transaction
                    </Text>
                    <Text style={styles.transactionCategoryText}>
                    {transactionDetails.transactionCategory && transactionDetails.transactionCategory.length > 0
                        ? transactionDetails.transactionCategory.join(' • ')
                        : 'No Category'}
                    </Text>


                    <Text style={styles.descriptionText}>{transactionDetails.transactionDescription}</Text>
                        <View style={styles.transactionsActivityContainer}>
                        {transactionDetails.attachments.length > 0 ? (
                            <View>
                                {/* Image Attachments */}
                                {transactionDetails.attachments.some(file => file.fileType?.startsWith('image/')) && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.attachmentPreviewContainer}
                                    >
                                        {transactionDetails.attachments.map((file, index) => {
                                            if (file.fileType?.startsWith('image/')) {
                                                return (
                                                    <View key={index} style={styles.attachmentItem}>
                                                        <Image
                                                            source={{ uri: file.fileUri }}
                                                            style={styles.attachmentImage}
                                                        />
                                                    </View>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </ScrollView>
                                )}

                                {/* Non-Image Attachments */}
                                {transactionDetails.attachments.some(file => !file.fileType?.startsWith('image/')) && (
                                    <View>
                                        {transactionDetails.attachments.map((file, index) => {
                                            if (!file.fileType?.startsWith('image/')) {
                                                return (
                                                    <View key={index} style={styles.attachmentItem}>
                                                        <Text style={styles.attachmentText}>
                                                            {file.fileName}
                                                        </Text>
                                                    </View>
                                                );
                                            }
                                            return null;
                                        })}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Text style={{color: theme.colors.textSecondary, fontFamily:theme.fonts.bold.fontFamily, alignSelf: 'center'}}>No Attachments</Text>
                        )}
                    </View>
                </ScrollView>
            </InAppBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    createdByText: {
        fontSize: 14,
        color: theme.colors.grayedText,
        fontFamily: theme.fonts.medium.fontFamily,
        lineHeight: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: 'white',
        fontFamily: theme.fonts.regular.fontFamily,
    },
    categoryText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 18,
        marginTop: 20,
    },

    transactionCategoryText:{
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        alignSelf: 'center',
        padding: 10,
        marginTop: 20,
    },
    contentContainer: {
        padding: 15,
        marginTop: 30,
        borderBottomWidth: 5,
        alignItems: 'center'
    },
    titleText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'left',
    },
    descriptionText: {
        fontSize: 17,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium.fontFamily,
        textAlign: 'center',
        margin: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold.fontFamily,
        marginBottom: 10,
        marginTop: 20,
        color: theme.colors.textSecondary,
    },
    amountText: {
        fontSize: 30,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'left',
        paddingTop: 8,
        marginBottom: 5,
    },
    transactionsActivityContainer: {
        alignSelf: 'left',
        marginTop: 20,
        paddingHorizontal: 2,
    },
    transactionsList: {
        marginTop: 5,
    },

    attachmentPreviewContainer: {
        marginTop: 6,
        flexDirection: 'row',
        gap: 5,
      },

      attachmentItem: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
      },

      attachmentImage: {
        width: 120,
        height: 120,
        borderRadius: 5,
      },

      
      nonImageList: {
        gap: 5,
        marginBottom: 20
      },

      attachmentRow:{
        flexDirection: 'row',
        alignItems: 'center'
      },

      attachmentText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium.fontFamily,
        textDecorationLine: 'underline',
      },
});