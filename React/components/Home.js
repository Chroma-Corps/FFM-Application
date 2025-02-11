// rfce
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Card, FAB} from 'react-native-paper';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';

function home() {

    const [data, setData] = useState([]);

    const fetchData = async () => {
      try {
        // Replace With API_URL_DEVICE When Testing Mobile
        const response = await fetch(`${API_URL_LOCAL}/allusers`, { method: 'GET' });
        if (response.ok) {
          const users = await response.json();
          console.log('Fetched Users:', users);
          setData(users);
        } else {
          console.error('Failed To Fetch Users:', response.statusText);
        }
      } catch (error) {
        console.error('Error Fetching Users:', error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const renderData = (item) => {
        return (
            <Card style={styles.cardStyle}>
                <Text style={{fontSize:18}}>{item.id}</Text>
                <Text>{item.email}</Text>
            </Card>
        )
    }
    
  return (
    <View style = {{flex: 1}}>
        <Text style = {styles.topText}>Family Financial Management</Text>
        <FlatList 
            data = {data} 
            renderItem={({item}) => {
                return renderData(item)
            }}
            keyExtractor={item =>`${item.id}`}
        />
        <FAB 
        style = {styles.fab}
        icon="plus"
        theme = {{colors:{accent:"green"}}}
        onPress={() => {
            console.log("Pressed!");
            }}
        />
        <Text style = {styles.bottomText}>Chroma Corps</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    topText: {
        padding: 30,
        color: 'white',
        textAlign: "center",
        fontSize: 20,
        backgroundColor: '#483d8b'
    },

    bottomText: {
        textAlign: "center",
        margin: 20
    },

    cardStyle: {
        margin: 15,
        padding: 25
    },

    fab: {
        position: "absolute",
        margin: 20,
        right: 0,
        bottom: 0
    }
})

export default home