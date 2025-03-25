import React from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../core/theme';

const CurrencySelectionPopUp = ({ currencyData, selectedCurrency, setSelectedCurrency, setShowCurrenciesPopup }) => {

    const handleCurrencySelect = (currency) => {
        setSelectedCurrency(currency);
    };

    const renderCurrencyItem = (currency) => {
        return (
            <TouchableOpacity
                key={currency.code}
                style={[
                    styles.currencyBox,
                    selectedCurrency === currency
                        ? styles.selectedCurrencyBox
                        : styles.unselectedCurrencyBox,
                ]}
                onPress={() => handleCurrencySelect(currency)}
            >
                <Text
                    style={[
                        styles.currencyText,
                        selectedCurrency === currency
                            ? styles.selectedCurrencyText
                            : styles.unselectedCurrencyText,
                    ]}
                >
                    {currency.code}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        selectedCurrency === currency
                            ? styles.selectedCurrencyText
                            : styles.unselectedCurrencyText,
                        { fontSize: 15, textAlign: 'center', marginBottom: 5 },
                    ]}
                >
                    {currency.symbol}
                </Text>

                <Text
                    style={[
                        styles.currencyText,
                        selectedCurrency === currency
                            ? styles.selectedCurrencyText
                            : styles.unselectedCurrencyText,
                        { fontSize: 8, textAlign: 'center' },
                    ]}
                >
                    {currency.name}
                </Text>
            </TouchableOpacity>
        );
    };

    // Sorting the currencies alphabetically
    const sortedCurrencyData = [...currencyData].sort((a, b) => a.code.localeCompare(b.code));

    return (
        <Modal transparent={true} visible={true} animationType='fade'>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    <TouchableOpacity
                        onPress={() => setShowCurrenciesPopup(false)}
                        style={styles.closeIcon}
                    >
                        <Icon name="close" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <Text style={styles.modalTitle}>Select Currency</Text>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.currencyContainer}>
                            {sortedCurrencyData && sortedCurrencyData.length > 0 ? (
                                sortedCurrencyData.map((currency) => renderCurrencyItem(currency))
                            ) : (
                                <Text>No currencies available</Text>
                            )}
                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    defaultText: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 15,
        color: 'white',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        position: "relative",
    },

    closeIcon: {
        position: "absolute",
        right: 10,
        top: 10,
        padding: 10,
    },

    modalTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        marginBottom: 15,
    },

    currencyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
        flexWrap: 'wrap',
    },

    currencyBox: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 2,
        padding: 10,
    },

    currencyText: {
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
    },

    selectedCurrencyBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: theme.colors.primary,
    },

    unselectedCurrencyBox: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
    },

    selectedCurrencyText: {
        color: 'white',
    },

    unselectedCurrencyText: {
        color: theme.colors.primary,
    },
});

export default CurrencySelectionPopUp;
