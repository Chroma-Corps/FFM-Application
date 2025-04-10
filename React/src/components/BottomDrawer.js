import React, { useState } from 'react';
import { View, Text, Button, Modal, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { theme } from '../core/theme';

const BottomDrawer = ({ title, heading1, heading2, text1, text2 }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  
  const openDrawer = () => {
    setModalVisible(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
        <TouchableOpacity  onPress={openDrawer}>
            <MaterialIcons name={"info-outline"} size={20} color={"white"} style={styles.icon}/>
        </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDrawer}
      >
        <TouchableOpacity style={styles.overlay} onPress={closeDrawer}>
          <Animated.View
            style={[styles.drawer, { transform: [{ translateY }] }]}
          >
            <TouchableOpacity onPress={closeDrawer}>
              <View style={styles.closeButton}>
                <Text style={styles.title}>{title}</Text>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={theme.colors.grayedText}
                  style={styles.headerIcon}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.optionContainer}>
              <View style={styles.headerContainer}>
                <MaterialIcons name={"savings"} size={20} color={theme.colors.grayedText} style={styles.headerIcon}/>
                <Text style={styles.heading}>{heading1}</Text>
              </View>
              <Text style={styles.text}>{text1}</Text>
            </View>
            <View style={styles.optionContainer}>
            <View style={styles.headerContainer}>
                <MaterialIcons name={"money-off"} size={20} color={theme.colors.grayedText} style={styles.headerIcon}/>
                <Text style={styles.heading}>{heading2}</Text>
              </View>
              <Text style={styles.text}>{text2}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },

  optionContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primaryDimmed,
    borderRadius: 15,
    padding: 20,
    marginVertical: 5,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },

  drawer: {
    height: 350,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 25,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold.fontFamily,
  },

  heading: {
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: 'left',
    fontFamily: theme.fonts.bold.fontFamily
  },

  text: {
    fontSize: 14,
    marginLeft: 10,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold.fontFamily
  },

  closeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginBottom: 10,
  },

  icon: {
    marginBottom: 10,
    marginRight: 5,
  },

  headerIcon: {
    marginRight: 5,
  },
});

export default BottomDrawer;
