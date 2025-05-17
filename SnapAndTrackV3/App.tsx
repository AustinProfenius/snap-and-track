/**
 * Snap & Track Nutrition and Workout Tracker App
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import AppNavigator from './app/navigation/AppNavigator';
import { COLORS } from './app/styles/colors';

// Create a custom theme based on MD3 Dark Theme
const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.card,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;
