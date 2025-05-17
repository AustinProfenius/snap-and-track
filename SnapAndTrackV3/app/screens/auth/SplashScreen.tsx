import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { COLORS } from '../../styles/colors';

const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Snap & Track</Text>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});

export default SplashScreen; 