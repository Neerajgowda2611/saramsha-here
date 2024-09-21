import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from '/home/silent/saramsha/frontend/src/navigation/StackNavigator.tsx'; 

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
