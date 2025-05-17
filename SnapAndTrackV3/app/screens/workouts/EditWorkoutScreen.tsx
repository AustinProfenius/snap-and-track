import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { COLORS } from "../../../app/styles/colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, FAB, IconButton, Chip, Menu } from "react-native-paper";

// Types
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutRouteProps = RouteProp<RootStackParamList, "EditWorkout">;

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  note?: string;
}

interface Set {
  id: string;
  weight?: number;
  reps?: number;
  rpe?: number;
  completed: boolean;
}

const EditWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorkoutRouteProps>();
  const [workoutTitle, setWorkoutTitle] = useState("New Workout");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [exerciseMenuVisible, setExerciseMenuVisible] = useState(false);

  // Example exercises for demo
  const exampleExercises = [
    { id: "1", name: "Bench Press" },
    { id: "2", name: "Squat" },
    { id: "3", name: "Deadlift" },
    { id: "4", name: "Pull-ups" },
    { id: "5", name: "Shoulder Press" },
  ];

  // Start timer on mount
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimer(0);
    startTimer();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddExercise = (exercise: { id: string; name: string }) => {
    const newExercise: Exercise = {
      id: exercise.id,
      name: exercise.name,
      sets: [
        {
          id: `set-${Date.now()}`,
          weight: undefined,
          reps: undefined,
          rpe: undefined,
          completed: false,
        },
      ],
    };
    setExercises([...exercises, newExercise]);
    setExerciseMenuVisible(false);
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: `set-${Date.now()}-${ex.sets.length}`,
                weight: undefined,
                reps: undefined,
                rpe: undefined,
                completed: false,
              },
            ],
          };
        }
        return ex;
      })
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    Alert.alert(
      "Remove Exercise",
      "Are you sure you want to remove this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setExercises(exercises.filter((ex) => ex.id !== exerciseId));
          },
        },
      ]
    );
  };

  const updateSetValue = (
    exerciseId: string,
    setId: string,
    field: keyof Set,
    value: any
  ) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                return { ...set, [field]: value };
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

  const handleFinishWorkout = () => {
    navigation.navigate("FinishWorkout", {
      workout: {
        title: workoutTitle,
        duration: timer,
        exercises,
        notes,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TextInput
            style={styles.titleInput}
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
            placeholder="Workout Title"
            placeholderTextColor={COLORS.textSecondary}
          />
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <TouchableOpacity
              onPress={isRunning ? pauseTimer : startTimer}
              style={styles.timerButton}
            >
              <MaterialCommunityIcons
                name={isRunning ? "pause" : "play"}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={resetTimer}
              style={styles.timerButton}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {exercises.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={60}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyStateText}>
                No exercises added yet. Tap the button below to add exercises.
              </Text>
            </View>
          ) : (
            exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => handleRemoveExercise(exercise.id)}
                  />
                </View>

                {exercise.sets.map((set, index) => (
                  <View key={set.id} style={styles.setRow}>
                    <Text style={styles.setNumber}>{index + 1}</Text>
                    <TextInput
                      style={styles.setInput}
                      placeholder="lbs"
                      keyboardType="numeric"
                      value={set.weight?.toString() || ""}
                      onChangeText={(text) =>
                        updateSetValue(
                          exercise.id,
                          set.id,
                          "weight",
                          text ? Number(text) : undefined
                        )
                      }
                    />
                    <TextInput
                      style={styles.setInput}
                      placeholder="reps"
                      keyboardType="numeric"
                      value={set.reps?.toString() || ""}
                      onChangeText={(text) =>
                        updateSetValue(
                          exercise.id,
                          set.id,
                          "reps",
                          text ? Number(text) : undefined
                        )
                      }
                    />
                    <TextInput
                      style={styles.setInput}
                      placeholder="RPE"
                      keyboardType="numeric"
                      value={set.rpe?.toString() || ""}
                      onChangeText={(text) =>
                        updateSetValue(
                          exercise.id,
                          set.id,
                          "rpe",
                          text ? Number(text) : undefined
                        )
                      }
                    />
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        set.completed && styles.checkboxChecked,
                      ]}
                      onPress={() =>
                        updateSetValue(
                          exercise.id,
                          set.id,
                          "completed",
                          !set.completed
                        )
                      }
                    >
                      {set.completed && (
                        <MaterialCommunityIcons
                          name="check"
                          size={16}
                          color={COLORS.background}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}

                <Button
                  mode="text"
                  onPress={() => handleAddSet(exercise.id)}
                  style={styles.addSetButton}
                >
                  Add Set
                </Button>
              </View>
            ))
          )}

          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Workout Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Add notes about this workout..."
              placeholderTextColor={COLORS.textSecondary}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.exerciseSelectorContainer}>
            <Menu
              visible={exerciseMenuVisible}
              onDismiss={() => setExerciseMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setExerciseMenuVisible(true)}
                  style={styles.addExerciseButton}
                  icon="plus"
                >
                  Add Exercise
                </Button>
              }
            >
              {exampleExercises.map((ex) => (
                <Menu.Item
                  key={ex.id}
                  onPress={() => handleAddExercise(ex)}
                  title={ex.name}
                />
              ))}
            </Menu>
          </View>

          {/* Add some space at the bottom for better scrolling */}
          <View style={{ height: 100 }} />
        </ScrollView>

        <FAB
          style={styles.fab}
          icon="check"
          label="Finish Workout"
          onPress={handleFinishWorkout}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    padding: 0,
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 8,
  },
  timerButton: {
    padding: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  setNumber: {
    width: 30,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  setInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    color: COLORS.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  addSetButton: {
    marginTop: 8,
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    color: COLORS.text,
    textAlignVertical: "top",
  },
  exerciseSelectorContainer: {
    marginBottom: 20,
  },
  addExerciseButton: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
});

export default EditWorkoutScreen; 