import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ColorWheel from 'react-native-wheel-color-picker';
import { theme } from '../core/theme';

const getLuminance = (color) => {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance;
};

const getIconColor = (color) => {
  const luminance = getLuminance(color);
  return luminance > 0.7 ? '#000' : '#fff';
};

export default function ColorTray({ selectedColor, onColorSelect }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const colorData = [
    '#D85A5A', '#D88F4A', '#D8C24A', '#4AD88A', '#4A90E2', '#4A6CD8', '#9B4AD8',
  ];

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <View style={styles.container}>
      {/* Row for Default Colors and Palette Icon */}
      <View style={styles.colorRow}>
        {/* Display List of Default Colors */}
        <FlatList
          data={colorData}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onColorSelect(item)}
              style={[
                styles.colorCircle,
                { backgroundColor: item },
                item === selectedColor && { borderWidth: 2, borderColor: 'white' }
              ]}
            />
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.colorList}
        />

        {/* Palette Circle with Selected Color */}
        <TouchableOpacity
          onPress={handleOpenModal}
          style={[styles.paintIconContainer, {
            backgroundColor: selectedColor || '#4A90E2',
            borderWidth: 2,
            borderColor: 'white',
          }]}
        >
          <MaterialIcons name="palette" size={30} color={getIconColor(selectedColor || '#FFFFFF')} />
      </TouchableOpacity>
      </View>

      {/* Modal for Color Picker */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ColorWheel
              initialColor={selectedColor || '#48A6A7'} // Default Color - Primary from Theme
              onColorChange={onColorSelect}
              style={styles.colorPicker}
            />
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Set Color</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  colorDisplay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  paintIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.83)',
  },
  modalContent: {
    width: 350,
    height: 420, 
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  colorPicker: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold.fontFamily,
  },
});