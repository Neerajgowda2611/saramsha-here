import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen.tsx';
import RecordAudioScreen from '../screens/RecordAudioScreen.tsx';
import UploadAudioScreen from '../screens/UploadAudioScreen.tsx';
import PlayAudioScreen from '../screens/PlayAudioScreen.tsx'; 
import ResultsScreen from '../screens/ResultsScreen.tsx';
import HistoryScreen from '../screens/HistoryScreen';
import ViewScreen from '../screens/ViewScreen.tsx';
// import LoadingScreen from '../screens/LoadingScreen.tsx';


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
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="ViewScreen" component={ViewScreen} />
      {/* <Stack.Screen name="LoadingScreen" component={LoadingScreen} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
