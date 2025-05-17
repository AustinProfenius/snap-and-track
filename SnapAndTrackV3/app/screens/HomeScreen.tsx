import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Title, FAB, ProgressBar, Divider, IconButton } from 'react-native-paper';
import { COLORS } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [waterConsumed, setWaterConsumed] = useState(4); // Default to 4 glasses
  const waterGoal = 8; // 8 glasses per day

  // Mock data
  const dailyCalories = {
    consumed: 1450,
    goal: 2000,
    remaining: 550,
    burned: 350
  };

  const macroDistribution = {
    protein: { consumed: 85, goal: 140, unit: 'g' },
    carbs: { consumed: 120, goal: 200, unit: 'g' },
    fat: { consumed: 45, goal: 65, unit: 'g' }
  };

  const todaysMeals = [
    { id: '1', name: 'Oatmeal with Berries', mealType: 'Breakfast', time: '8:30 AM', calories: 350, icon: 'food-apple' },
    { id: '2', name: 'Chicken Salad', mealType: 'Lunch', time: '12:45 PM', calories: 480, icon: 'food' },
    { id: '3', name: 'Protein Shake', mealType: 'Snack', time: '3:30 PM', calories: 220, icon: 'cup' }
  ];

  const recentWorkouts = [
    { id: '1', name: 'Morning HIIT', date: 'Today', duration: '30 min' },
    { id: '2', name: 'Upper Body', date: 'Yesterday', duration: '45 min' }
  ];

  const handleLogMeal = () => {
    // Navigate to manual food entry
    navigation.navigate('CreateCustomFood');
  };

  const handleSnapMeal = () => {
    // Navigate to camera for AI food recognition
    navigation.navigate('SnapMeal');
  };

  const handleStartWorkout = () => {
    navigation.navigate('Workouts');
  };

  const getProgressPercentage = (consumed, goal) => {
    const progress = consumed / goal;
    return Math.min(progress, 1); // Cap at 100%
  };

  const addWater = () => {
    if (waterConsumed < waterGoal) {
      setWaterConsumed(waterConsumed + 1);
    }
  };

  const removeWater = () => {
    if (waterConsumed > 0) {
      setWaterConsumed(waterConsumed - 1);
    }
  };

  const renderWaterGlasses = () => {
    const glasses = [];
    
    for (let i = 0; i < waterGoal; i++) {
      glasses.push(
        <TouchableOpacity 
          key={i} 
          onPress={() => setWaterConsumed(i + 1)}
          style={styles.waterGlassContainer}
        >
          <MaterialCommunityIcons 
            name="cup-water"
            size={28}
            color={i < waterConsumed ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    
    return glasses;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Quick Action Buttons */}
        <View style={styles.quickActionsContainer}>
          <Button 
            mode="contained" 
            icon="pencil" 
            onPress={handleLogMeal}
            style={styles.actionButton}
          >
            Log Meal
          </Button>
          <Button 
            mode="contained" 
            icon="camera" 
            onPress={handleSnapMeal}
            style={styles.actionButton}
          >
            Snap Meal
          </Button>
          <Button 
            mode="contained" 
            icon="dumbbell" 
            onPress={handleStartWorkout}
            style={styles.actionButton}
          >
            Workout
          </Button>
        </View>

        {/* Water Consumption Tracker */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.waterHeaderContainer}>
              <Title style={styles.cardTitle}>Water Intake</Title>
              <Text style={styles.waterText}>{waterConsumed} of {waterGoal} glasses</Text>
            </View>
            
            <View style={styles.waterProgressContainer}>
              <ProgressBar 
                progress={waterConsumed / waterGoal} 
                color="#64B5F6" 
                style={styles.waterProgressBar} 
              />
            </View>
            
            <View style={styles.waterGlassesRow}>
              {renderWaterGlasses()}
            </View>
            
            <View style={styles.waterButtonsContainer}>
              <IconButton
                icon="minus"
                size={24}
                onPress={removeWater}
                disabled={waterConsumed <= 0}
                style={[
                  styles.waterButton,
                  waterConsumed <= 0 && styles.waterButtonDisabled
                ]}
              />
              <IconButton
                icon="plus"
                size={24}
                onPress={addWater}
                disabled={waterConsumed >= waterGoal}
                style={[
                  styles.waterButton,
                  waterConsumed >= waterGoal && styles.waterButtonDisabled
                ]}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Daily Summary Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Daily Summary</Title>
            <View style={styles.calorieContainer}>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>{dailyCalories.consumed}</Text>
                <Text style={styles.calorieLabel}>Consumed</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>{dailyCalories.burned}</Text>
                <Text style={styles.calorieLabel}>Burned</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>{dailyCalories.remaining}</Text>
                <Text style={styles.calorieLabel}>Remaining</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar 
                progress={getProgressPercentage(dailyCalories.consumed, dailyCalories.goal)} 
                color={COLORS.primary} 
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {dailyCalories.consumed} / {dailyCalories.goal} kcal
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Meals Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Today's Meals</Title>
            {todaysMeals.map((meal, index) => (
              <React.Fragment key={meal.id}>
                <View style={styles.mealItem}>
                  <MaterialCommunityIcons name={meal.icon} size={24} color={COLORS.primary} />
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealMeta}>{meal.mealType} • {meal.time}</Text>
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
                {index < todaysMeals.length - 1 && <Divider style={styles.divider} />}
              </React.Fragment>
            ))}
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Diary')}
              style={styles.viewAllButton}
            >
              View All Meals
            </Button>
          </Card.Content>
        </Card>

        {/* Today's Macronutrients Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Today's Macronutrients</Title>
            
            {/* Protein */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValues}>
                  {macroDistribution.protein.consumed}/{macroDistribution.protein.goal}{macroDistribution.protein.unit}
                </Text>
              </View>
              <ProgressBar 
                progress={getProgressPercentage(macroDistribution.protein.consumed, macroDistribution.protein.goal)} 
                color="#FF8A65" 
                style={styles.macroProgress}
              />
            </View>
            
            {/* Carbs */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <Text style={styles.macroValues}>
                  {macroDistribution.carbs.consumed}/{macroDistribution.carbs.goal}{macroDistribution.carbs.unit}
                </Text>
              </View>
              <ProgressBar 
                progress={getProgressPercentage(macroDistribution.carbs.consumed, macroDistribution.carbs.goal)} 
                color="#4FC3F7" 
                style={styles.macroProgress}
              />
            </View>
            
            {/* Fat */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValues}>
                  {macroDistribution.fat.consumed}/{macroDistribution.fat.goal}{macroDistribution.fat.unit}
                </Text>
              </View>
              <ProgressBar 
                progress={getProgressPercentage(macroDistribution.fat.consumed, macroDistribution.fat.goal)} 
                color="#FFD54F" 
                style={styles.macroProgress}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Recent Workouts Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Workouts</Title>
            {recentWorkouts.map(workout => (
              <View key={workout.id} style={styles.workoutItem}>
                <MaterialCommunityIcons name="dumbbell" size={24} color={COLORS.primary} />
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutMeta}>{workout.date} • {workout.duration}</Text>
                </View>
              </View>
            ))}
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Workouts')}
              style={styles.viewAllButton}
            >
              View All Workouts
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Settings Button */}
      <FAB
        icon="cog"
        style={styles.fab}
        onPress={() => navigation.navigate('Settings')}
        color={COLORS.background}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.primary,
  },
  card: {
    margin: 16,
    marginTop: 8,
    backgroundColor: COLORS.card,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: COLORS.text,
  },
  calorieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calorieItem: {
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  calorieLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  mealMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    backgroundColor: COLORS.border,
  },
  macroProgressItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  macroValues: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  macroProgress: {
    height: 8,
    borderRadius: 4,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutInfo: {
    marginLeft: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  workoutMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  viewAllButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  // Water tracker styles
  waterHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterText: {
    color: COLORS.text,
    fontSize: 16,
  },
  waterProgressContainer: {
    marginBottom: 16,
  },
  waterProgressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(100, 181, 246, 0.2)',
  },
  waterGlassesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  waterGlassContainer: {
    padding: 6,
  },
  waterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  waterButton: {
    backgroundColor: COLORS.card,
    margin: 4,
  },
  waterButtonDisabled: {
    opacity: 0.5,
  },
});

export default HomeScreen; 