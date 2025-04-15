import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import InAppBackground from '../../components/InAppBackground';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { showToast } from '../../components/ToastNotification';

export default function CircleDetailsScreen({ route, navigation }) {
  const { circle } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const handleCopyToClipboard = () => {
    copyToClipboard(circle.circleCode)
    console.log("Copied")
    showToast({
      type: 'success',
      title: 'Copied!',
      message: 'Code Copied To Clipboard',
    });
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`https://ffm-application-main.onrender.com/circle/${circle.circleID}/users`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (response.ok) {
          setMembers(data.users);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error fetching circle members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [circle.circleID]);

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={[styles.memberIcon, { backgroundColor: circle.circleColor }]} />
      <Text style={styles.memberName}>{item.name || 'Unnamed User'}</Text>
    </View>
  );

  return (
    <InAppBackground>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.container}>
        <Image source={{ uri: circle.circleImage }} style={styles.circleImage} />
        <Text style={styles.circleName}>{circle.circleName}</Text>
        <Text style={styles.circleType}>{circle.circleType}</Text>
         <Text style={styles.createdByText}>Created By {circle.owner}</Text>
        <Text style={styles.sectionTitle}>Invite Code</Text>
        <View style={styles.circleCodeContainer}>
          <TouchableOpacity 
            onPress={handleCopyToClipboard} 
            style={{flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 20,}}
          >
            <Text style={[styles.circleCode, { color: circle.circleColor }]}>
              {circle.circleCode}
            </Text>
            <MaterialIcons name="content-copy" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Members</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={members.length ? members : [{ name: 'You (creator)' }]}
            renderItem={renderMember}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </InAppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontFamily: theme.fonts.medium.fontFamily
  },
  circleCode: {
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold.fontFamily,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  createdByText: {
      fontSize: 14,
      color: theme.colors.grayedText,
      fontFamily: theme.fonts.medium.fontFamily,
      lineHeight: 20,
  },
  memberIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    color: theme.colors.surface,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});
