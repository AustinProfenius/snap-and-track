import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CreateCustomFoodScreen from '../screens/food/CreateCustomFoodScreen';
import DiaryScreen from '../screens/DiaryScreen';

// Workout Screens
import WorkoutListScreen from '../screens/workouts/WorkoutListScreen';
import WorkoutDetailScreen from '../screens/workouts/WorkoutDetailScreen';
import NewWorkoutScreen from '../screens/workouts/NewWorkoutScreen';
import StartWorkoutScreen from '../screens/workouts/StartWorkoutScreen';
import EditWorkoutScreen from '../screens/workouts/EditWorkoutScreen';
import FinishWorkoutScreen from '../screens/workouts/FinishWorkoutScreen';

// SnapMeal Screens
import CameraScreen from '../screens/snapmeal/CameraScreen';
import FoodReviewScreen from '../screens/snapmeal/FoodReviewScreen';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnBoardingScreen from '../screens/auth/OnBoardingScreen';

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CreateCustomFood: undefined;
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OnBoarding: undefined;
  Camera: undefined;
  FoodSearch: undefined;
  FoodDetails: { foodId: string };
  WorkoutDetails: { workoutId: string };
  NewWorkout: undefined;
  StartWorkout: undefined;
  EditWorkout: { workout?: any };
  FinishWorkout: { workout: any };
  FoodReview: { imageUri: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Workouts: undefined;
  SnapMeal: undefined;
  Diary: undefined;
  Graphs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Workouts Navigator
const WorkoutsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'Workouts', headerShown: false }} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailScreen} options={({ route }) => ({ title: 'Workout Details' })} />
      <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} options={{ title: 'New Workout' }} />
      <Stack.Screen name="StartWorkout" component={StartWorkoutScreen} options={{ title: 'Start Workout' }} />
      <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} options={{ title: 'Edit Workout', headerShown: false }} />
      <Stack.Screen name="FinishWorkout" component={FinishWorkoutScreen} options={{ title: 'Workout Complete', headerShown: false }} />
    </Stack.Navigator>
  );
};

// SnapMeal Navigator
const SnapMealNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Snap Meal', headerShown: false }} />
      <Stack.Screen name="FoodReview" component={FoodReviewScreen} options={{ title: 'Food Analysis' }} />
    </Stack.Navigator>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.background,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          color: COLORS.text,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SnapMeal"
        component={SnapMealNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food-apple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Graphs"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  // For development, set initialRouteName to "Main" to skip login
  // For production, set to "Auth"
  const initialRouteName = "Main";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="CreateCustomFood" 
          component={CreateCustomFoodScreen}
          options={{
            headerShown: true,
            headerTitle: 'Create Custom Food',
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTitleStyle: {
              color: COLORS.text,
            },
            headerTintColor: COLORS.primary,
          }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 