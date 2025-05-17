#!/bin/bash

# Define the placeholder template
TEMPLATE='import React from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { COLORS } from "../../styles/colors";

const COMPONENT_NAME: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SCREEN_TITLE</Text>
        <Text style={styles.subtitle}>This is a placeholder</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default COMPONENT_NAME;'

# List of screens to create
SCREENS=(
  "app/screens/auth/RegisterScreen.tsx:RegisterScreen:Register"
  "app/screens/auth/ForgotPasswordScreen.tsx:ForgotPasswordScreen:Forgot Password"
  "app/screens/auth/OnBoardingScreen.tsx:OnBoardingScreen:Onboarding"
  "app/screens/workouts/WorkoutListScreen.tsx:WorkoutListScreen:Workouts"
  "app/screens/workouts/WorkoutDetailScreen.tsx:WorkoutDetailScreen:Workout Details"
  "app/screens/workouts/NewWorkoutScreen.tsx:NewWorkoutScreen:New Workout"
  "app/screens/snapmeal/CameraScreen.tsx:CameraScreen:Camera"
  "app/screens/snapmeal/FoodReviewScreen.tsx:FoodReviewScreen:Food Review"
  "app/screens/food/CreateCustomFoodScreen.tsx:CreateCustomFoodScreen:Create Custom Food"
)

# Create each screen
for screen in "${SCREENS[@]}"; do
  IFS=':' read -r file component title <<< "$screen"
  content="${TEMPLATE//COMPONENT_NAME/$component}"
  content="${content//SCREEN_TITLE/$title}"
  echo "$content" > "$file"
  echo "Created $file"
done

echo "All placeholder screens created successfully!" 