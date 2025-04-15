import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import InAppHeader from '../../components/InAppHeader';
import Button from '../../components/Button';
import InAppBackground from '../../components/InAppBackground';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ColorTray from '../../components/ColorTray'

export default function CreateCircleScreen({ navigation, route }) {
  const { newUserSelectedCircleType } = route.params || {};
  const [circleName, setCircleName] = useState('');
  const [circleType, setCircleType] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4A90E2');
  const [circleImage, setCircleImage] = useState(null);

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

  const handleCircleCodePopUp = async () => {
    navigation.goBack();
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // For New Users
   const setActiveCircle = async (circleID) => {
      try {
        const token = await AsyncStorage.getItem("access_token");
  
        if (!token) {
          console.error('No Token Found');
          return;
        }
  
        const response = await fetch('https://ffm-application-main.onrender.com/active-circle', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            circleID: circleID,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === 'success') {
          console.log(data.message)
        } else {
          console.error(data.message);
        }
        console.log('Set Active Circle Status:', data.status)
      } catch (error) {
        console.error("Error Setting Active Circle:", error);
      }
    };

  const createCircle = async () => {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) return Alert.alert('Error', 'No access token found');

    // Conditional Considering New Users
    const finalCircleType = newUserSelectedCircleType ? newUserSelectedCircleType : circleType;

    if (!circleName || !finalCircleType || !circleImage) {
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
          circleType: finalCircleType.toUpperCase(),
          circleColor: selectedColor,
          circleImage: circleImage,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        if (newUserSelectedCircleType == null) {
          // If newUserSelectedCircleType is NULL, Proceed as usual - Already Registered Users
          Alert.alert('Success', 'Circle Created Successfully');
          handleCircleCodePopUp();
        } else {
          // If newUserSelectedCircleType is NOT null - New Users
          Alert.alert('Success', 'Circle Created Successfully');
          setActiveCircle(data.circleID);
          navigation.navigate('CreateBank', { newUserSelectedCircleType });
        }
      } else {
        Alert.alert('Error', data.message || 'Failed To Create Circle');
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
            <View style={{alignSelf: 'center'}}>
              <InAppHeader >New Circle</InAppHeader>
            </View>

            <TextInput
              placeholder="Circle Name"
              value={circleName}
              onChangeText={setCircleName}
              style={styles.input}
              placeholderTextColor="#aaa"
            />

            {newUserSelectedCircleType == null && (
              <View style={styles.typeSelector}>
                <Text style={styles.label}>Select Circle Type:</Text>
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
            )}

            {/* <Text style={styles.label}>Choose Colour:</Text>
            <View style={styles.colorPalette}>
              {presetColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    circleColor === color && styles.selectedCircle,
                  ]}
                  onPress={() => setCircleColor(color)}
                />
              ))}
              <TouchableOpacity onPress={() => {
                setTempColor(circleColor);
                setShowColorPicker(true);
              }}>
                <View style={[styles.colorCircle, styles.plusCircle]}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              </TouchableOpacity>
            </View> */}

            <Text style={styles.label}>Select Circle Image:</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
              {circleImage ? (
                <Image source={{ uri: circleImage }} style={styles.circleImage} />
              ) : (
                <Text style={styles.imageText}>Tap To Select Image</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.label}>Current Colour:</Text>
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]}>
              <Text style={styles.hexPreview}>{selectedColor}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ColorTray 
            selectedColor={selectedColor} 
            onColorSelect={handleColorSelect}
          />
          <Button mode="contained" onPress={createCircle} style={styles.buttonStyle}>
            Create Circle
          </Button>
      </View>

        {/* Modal for Custom Color Picker */}
        {/* <Modal visible={showColorPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Pick a Custom Colour</Text>
              <ColorPicker
                color={tempColor}
                swatches={false}
                onColorChange={setTempColor}
                onColorChangeComplete={(c) => setTempColor(c)}
                thumbSize={30}
                sliderSize={20}
                noSnap
                row={false}
                style={{ width: 200, height: 200 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Hex code"
                placeholderTextColor="#aaa"
                value={tempColor}
                onChangeText={(text) => setTempColor(text)}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <Button
                  mode="outlined"
                  onPress={() => setShowColorPicker(false)}
                  style={{ width: '45%' }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    setCircleColor(tempColor);
                    setShowColorPicker(false);
                  }}
                  style={{ width: '45%' }}
                >
                  Select
                </Button>
              </View>
            </View>
          </View>
        </Modal> */}
      </InAppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  createCircleScreen: { flex: 1 },
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
    marginTop: 10,
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
  plusCircle: {
    backgroundColor: '#2a2a2a',
    borderColor: '#888',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
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
  colorPreview: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  hexPreview: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
});