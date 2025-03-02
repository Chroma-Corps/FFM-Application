import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const months = [
  { id: 0, name: "Jan" },
  { id: 1, name: "Feb" },
  { id: 2, name: "Mar" },
  { id: 3, name: "Apr" },
  { id: 4, name: "May" },
  { id: 5, name: "Jun" },
  { id: 6, name: "Jul" },
  { id: 7, name: "Aug" },
  { id: 8, name: "Sep" },
  { id: 9, name: "Oct" },
  { id: 10, name: "Nov" },
  { id: 11, name: "Dec" },
];

const MonthFilter = ({ selectedMonth, onSelectMonth }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={months}
        horizontal  // 🔹 Enables horizontal scrolling
        showsHorizontalScrollIndicator={false} // 🔹 Hides the scroll bar for a cleaner look
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.monthButton,
              selectedMonth === item.id && styles.selectedMonthButton,
            ]}
            onPress={() => onSelectMonth(item.id)}
          >
            <Text
              style={[
                styles.monthText,
                selectedMonth === item.id && styles.selectedMonthText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  list: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedMonthButton: {
    backgroundColor: "#007BFF",
  },
  monthText: {
    fontSize: 14,
    color: "#333",
  },
  selectedMonthText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MonthFilter;