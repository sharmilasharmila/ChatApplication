import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomActions from './components/CustomActions';

//import the screen
import chat from './components/chat';
import start from './components/start';

//import gesture handler
import 'react-native-gesture-handler';

//import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="start"
      >
      <Stack.Screen
        name="start"
        component={start}
      />
      <Stack.Screen
        name="chat"
        component={chat}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
