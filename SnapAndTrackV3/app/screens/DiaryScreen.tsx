import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Title, Divider, ProgressBar, List, Chip, IconButton } from 'react-native-paper';
import { COLORS } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type DiaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const DiaryScreen: React.FC = () => {
  const navigation = useNavigation<DiaryScreenNavigationProp>();
  
  // Date selection state
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate a week of dates centered on the selected date
  const getDates = () => {
    const dates: Date[] = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  
  // Mock data for daily nutrition
  const dailyCalories = {
    consumed: 1890,
    goal: 2100,
    remaining: 210,
    burned: 350
  };

  const macroDistribution = {
    calories: { consumed: 1890, goal: 2100, unit: 'kcal' },
    protein: { consumed: 95, goal: 130, unit: 'g' },
    carbs: { consumed: 180, goal: 210, unit: 'g' },
    fat: { consumed: 60, goal: 70, unit: 'g' }
  };

  // Mock data for meals
  const meals = [
    {
      id: '1',
      type: 'Breakfast',
      totalCalories: 320,
      foods: [
        { name: 'Eggs', calories: 70, protein: 8, carbs: 0, fat: 1 },
        { name: 'Toast', calories: 100, protein: 1, carbs: 10, fat: 2 },
        { name: 'Orange Juice', calories: 150, protein: 0, carbs: 10, fat: 3 }
      ]
    },
    {
      id: '2',
      type: 'Lunch',
      totalCalories: 650,
      foods: [
        { name: 'Grilled Chicken', calories: 250, protein: 35, carbs: 0, fat: 5 },
        { name: 'Brown Rice', calories: 200, protein: 5, carbs: 40, fat: 2 },
        { name: 'Green Beans', calories: 80, protein: 2, carbs: 10, fat: 0 },
        { name: 'Apple', calories: 120, protein: 0, carbs: 25, fat: 0 }
      ]
    },
    {
      id: '3',
      type: 'Dinner',
      totalCalories: 720,
      foods: [
        { name: 'Salmon', calories: 280, protein: 40, carbs: 0, fat: 12 },
        { name: 'Quinoa', calories: 170, protein: 8, carbs: 30, fat: 3 },
        { name: 'Roasted Vegetables', calories: 120, protein: 3, carbs: 15, fat: 5 },
        { name: 'Red Wine', calories: 150, protein: 0, carbs: 5, fat: 0 }
      ]
    },
    {
      id: '4',
      type: 'Snack',
      totalCalories: 200,
      foods: [
        { name: 'Greek Yogurt', calories: 140, protein: 15, carbs: 10, fat: 0 },
        { name: 'Blueberries', calories: 60, protein: 1, carbs: 10, fat: 0 }
      ]
    }
  ];

  const handleLogMeal = () => {
    // Navigate to manual food entry
    navigation.navigate('CreateCustomFood');
  };

  const handleSnapMeal = () => {
    // Navigate to camera for AI food recognition
    navigation.navigate('SnapMeal');
  };
  
  const handleAddFood = (mealId: string) => {
    // Navigate to food search or custom food creation
    navigation.navigate('CreateCustomFood');
  };

  const getProgressPercentage = (consumed: number, goal: number) => {
    const progress = consumed / goal;
    return Math.min(progress, 1); // Cap at a maximum of 100%
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <IconButton 
            icon="chevron-left" 
            size={24} 
            onPress={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 1);
              setSelectedDate(prevDate);
            }}
          />
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.datesContainer}
          >
            {getDates().map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateChip,
                  date.toDateString() === selectedDate.toDateString() && styles.selectedDateChip
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text 
                  style={[
                    styles.dateText,
                    date.toDateString() === selectedDate.toDateString() && styles.selectedDateText
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <IconButton 
            icon="chevron-right" 
            size={24} 
            onPress={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 1);
              setSelectedDate(nextDate);
            }}
          />
        </View>
        
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
        </View>

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
            
            {meals.map((meal, mealIndex) => (
              <List.Accordion
                key={meal.id}
                title={meal.type}
                description={`${meal.totalCalories} calories`}
                left={props => <List.Icon {...props} icon={
                  meal.type === 'Breakfast' ? 'food-apple' : 
                  meal.type === 'Lunch' ? 'food' : 
                  meal.type === 'Dinner' ? 'food-variant' : 'coffee'
                } />}
                style={styles.mealAccordion}
              >
                {meal.foods.map((food, foodIndex) => (
                  <View key={`${meal.id}-food-${foodIndex}`}>
                    <List.Item
                      title={food.name}
                      description={`${food.calories} cal | P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g`}
                      left={props => <List.Icon {...props} icon="circle-small" />}
                      style={styles.foodItem}
                    />
                    {foodIndex < meal.foods.length - 1 && <Divider style={styles.foodDivider} />}
                  </View>
                ))}
                
                <Button 
                  mode="outlined" 
                  icon="plus" 
                  onPress={() => handleAddFood(meal.id)}
                  style={styles.addFoodButton}
                >
                  Add Food to {meal.type}
                </Button>
              </List.Accordion>
            ))}
            
            <Button 
              mode="text" 
              icon="plus" 
              onPress={() => {}}
              style={styles.addMealButton}
            >
              Add Custom Meal
            </Button>
          </Card.Content>
        </Card>

        {/* Macronutrients Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Today's Macronutrients</Title>
            
            {/* Calories */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>Calories</Text>
                <Text style={styles.macroValues}>
                  {macroDistribution.calories.consumed}/{macroDistribution.calories.goal}{macroDistribution.calories.unit}
                </Text>
              </View>
              <ProgressBar 
                progress={getProgressPercentage(macroDistribution.calories.consumed, macroDistribution.calories.goal)} 
                color="#FF5722" 
                style={styles.macroProgress}
              />
            </View>
            
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  datesContainer: {
    paddingVertical: 4,
  },
  dateChip: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  selectedDateChip: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    color: COLORS.text,
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  mealAccordion: {
    backgroundColor: COLORS.card,
    marginBottom: 2,
  },
  foodItem: {
    backgroundColor: '#1A1A1A',
    paddingLeft: 12,
  },
  foodDivider: {
    backgroundColor: COLORS.border,
    marginLeft: 72,
  },
  addFoodButton: {
    margin: 8,
    marginLeft: 72,
    borderColor: COLORS.primary,
  },
  addMealButton: {
    marginTop: 16,
    alignSelf: 'center',
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
});

export default DiaryScreen; 