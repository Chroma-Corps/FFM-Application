import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native';
import { theme } from '../../core/theme'
import BackButton from '../../components/BackButton'
import InAppBackground from '../../components/InAppBackground';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionDetailsScreen({ navigation, route }) {
    const { transactionID } = route.params;
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchTransactionDetails();
    }, [transactionID]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
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
                <TouchableOpacity onPress={() => navigation.push('UpdateTransaction', { transactionID: transactionID })} style={{ alignSelf: 'flex-end', marginRight: 20, marginTop: 10 }}>
                    <MaterialIcons name={"edit"} size={30} color={"white"} />
                </TouchableOpacity>
                <ScrollView>
                    <View style={[styles.contentContainer, { borderColor: theme.colors.primary}]}>
                        <Text style={styles.titleText}>{transactionDetails.transactionTitle}</Text>
                        <Text style={styles.amountText}>{transactionDetails.transactionAmount}</Text>
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
                    <Text style={[styles.transactionCategoryText]}>
                        {transactionDetails.transactionCategory.join(' • ')}
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