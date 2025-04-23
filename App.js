import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import { Test } from './src/Pages/JobApproval/Test';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Navigation />   
    </GestureHandlerRootView>
  );
};

export default App;
