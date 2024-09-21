import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '/home/silent/saramsha/frontend/src/screens/HomeScreen.tsx';
import RecordAudioScreen from '/home/silent/saramsha/frontend/src/screens/RecordAudioScreen.tsx';
import UploadAudioScreen from '/home/silent/saramsha/frontend/src/screens/UploadAudioScreen.tsx';
import PlayAudioScreen from '/home/silent/saramsha/frontend/src/screens/PlayAudioScreen.tsx'; 
import ResultsScreen from '../screens/ResultsScreen';
// import UploadPlayAudioScreen from '../screens/UploadPlayAudioScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RecordAudio" component={RecordAudioScreen} />
      <Stack.Screen name="UploadAudio" component={UploadAudioScreen} />
      <Stack.Screen name="PlayAudio" component={PlayAudioScreen} /> 
      <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
      {/* <Stack.Screen name="UploadPlayAudioScreen" component={UploadPlayAudioScreen} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
