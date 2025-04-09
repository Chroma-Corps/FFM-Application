import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import InAppHeader from '../components/InAppHeader';
import Button from '../components/Button';
import InAppBackground from '../components/InAppBackground';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function CreateCircleScreen({ navigation }) {
  const [circleName, setCircleName] = useState('');
  const [circleType, setCircleType] = useState('Self');
  const [circleColor, setCircleColor] = useState('#9ACBD0');
  const [circleImage, setCircleImage] = useState(null);

  const colors = ['#9ACBD0', '#F28D8D', '#FFD700', '#48A6A7', '#B980F0'];

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCircleImage(result.assets[0].uri);
    }
  };

  const createCircle = async () => {
    const token = await AsyncStorage.getItem('access_token');

    if (!token) return Alert.alert('Error', 'No access token found');

    if (!circleName || !circleType || !circleColor || !circleImage) {
      return Alert.alert('Missing Fields', 'Please complete all fields.');
    }

    try {
      const response = await fetch(`https://ffm-application-main.onrender.com/create-circle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          circleName: circleName.trim(),
          circleType,
          circleColor,
          circleImage,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        Alert.alert('Success', 'Circle created successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to create circle');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.createCircleScreen}>
      <InAppBackground>
        <BackButton goBack={navigation.goBack} />

        <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}>
          <View style={styles.headerContainer}>
            <InAppHeader>New Circle</InAppHeader>

            <TextInput
              placeholder="Circle Name"
              value={circleName}
              onChangeText={setCircleName}
              style={styles.input}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Select Circle Type:</Text>
            <View style={styles.typeSelector}>
              {['Self', 'Group'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setCircleType(type)}
                  style={[
                    styles.typeButton,
                    circleType === type && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={{
                      color: circleType === type ? 'white' : theme.colors.textSecondary,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Choose Color:</Text>
            <View style={styles.colorPalette}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorCircle, { backgroundColor: color }, circleColor === color && styles.selectedCircle]}
                  onPress={() => setCircleColor(color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Select Circle Image:</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
              {circleImage ? (
                <Image source={{ uri: circleImage }} style={styles.circleImage} />
              ) : (
                <Text style={styles.imageText}>Tap to select image</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={createCircle} style={styles.buttonStyle}>
            Create Circle
          </Button>
        </View>
      </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  createCircleScreen: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  input: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: 'white',
    fontFamily: theme.fonts.medium.fontFamily,
  },
  label: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold.fontFamily,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 15,
  },
  typeButton: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCircle: {
    borderColor: theme.colors.secondary,
  },
  imagePicker: {
    marginTop: 10,
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: '#bbb',
    fontSize: 12,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  buttonContainer: {
    padding: 10,
  },
});