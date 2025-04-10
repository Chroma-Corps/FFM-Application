import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import InAppBackground from '../components/InAppBackground';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CircleDetailsScreen({ route, navigation }) {
  const { circle } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

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
