// rfce
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Card, FAB} from 'react-native-paper';
import { API_URL_LOCAL, API_URL_DEVICE } from '@env';

function home() {

    const [data, setData] = useState([]);

    const checkServer = async (urls) => {
      for (const url of urls) {
        try {
          const response = await fetch(url, { method: 'GET' });
          if (response.ok) return url;
        } catch (error) {
          console.log(`Failed To Connect To ${url}`);
        }
      }
      return null;
    };

    useEffect(() => {
      const possibleUrls = [
        `${API_URL_LOCAL}/allusers`, // For Web
        `${API_URL_DEVICE}/allusers`, // For Mobile
      ];
  
      checkServer(possibleUrls).then((workingUrl) => {
        if (workingUrl) {
          console.log(`Using Server: ${workingUrl}`);
          fetch(workingUrl, { method: 'GET' })
            .then((resp) => resp.json())
            .then((users) => {
              console.log('Fetched Users:', users);
              setData(users);
            })
            .catch((error) => {
              console.error('Uh-Oh! Error Fetching Users:', error);
            });
        } else {
          console.error('No accessible server found.');
        }
      });
    }, []);

    // const fetchData = () => {
    //     fetch('http://127.0.0.1:8080/allusers', {
    //       method: 'GET',
    //     })
    //       .then((resp) => resp.json())
    //       .then((users) => {
    //         console.log('Fetched users:', users);
    //         setData(users);
    //       })
    //       .catch((error) => {
    //         console.error('Error fetching users:', error);
    //       });
    //   };

    const renderData = (item) => {
        return (
            <Card style={styles.cardStyle}>
                <Text style={{fontSize:18}}>{item.id}</Text>
                <Text>{item.username}</Text>
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
            // fetchData();
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