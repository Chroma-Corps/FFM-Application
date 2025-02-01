// https://reactnative.dev/docs/getting-started
// https://callstack.github.io/react-native-paper/

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';

export default function App() {

  const name = "Powered by Chroma Corps"

  return (
    <View style={styles.container}>
      <Home name = {name}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center'
  },
});
