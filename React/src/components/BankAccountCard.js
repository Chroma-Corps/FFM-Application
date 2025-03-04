import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../core/theme";

const BankAccountCard = ({ account, isSelected, onSelect }) => {
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => onSelect(account.id)}
      >
        <View style={[styles.colorBar, { backgroundColor: account.color }]} />
        <View style={styles.cardContent}>
          <Text style={styles.accountTitle}>{account.title}</Text>
          <Text style={styles.balance}>
            {account.currency} {account.balance.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      width: 160,
      height: 90,
      borderRadius: 12,
      padding: 10,
      marginHorizontal: 5,
      backgroundColor: "#fff",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    selectedCard: {
      borderWidth: 2,
      borderColor: "#2d98da",
      shadowOpacity: 0.3,
    },
    colorBar: {
      width: 10,
      height: "100%",
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    cardContent: {
      flex: 1,
      paddingLeft: 10,
    },
    accountTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
    },
    balance: {
      fontSize: 16,
      color: "#555",
      marginTop: 5,
    },
  });

export default BankAccountCard;