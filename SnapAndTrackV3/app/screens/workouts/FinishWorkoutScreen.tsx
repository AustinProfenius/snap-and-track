import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Share,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { COLORS } from "../../../app/styles/colors";
import {
  Button,
  Card,
  Divider,
  Dialog,
  Portal,
  TextInput,
  Checkbox,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FinishWorkoutScreenRouteProp = RouteProp<RootStackParamList, "FinishWorkout">;

interface Set {
  id: string;
  weight?: number;
  reps?: number;
  rpe?: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
  weightUnit?: "lbs" | "kg";
  barType?: "barbell" | "dumbbell" | "machine" | "bodyweight" | "other";
  pr?: {
    weight: number;
    reps: number;
    date: string;
  };
}

interface Workout {
  title: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
}

const FinishWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FinishWorkoutScreenRouteProp>();
  const workout = route.params?.workout;

  // States for save as template dialog
  const [saveDialogVisible, setSaveDialogVisible] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>(workout?.title || "");
  const [saveExerciseSets, setSaveExerciseSets] = useState<boolean>(false);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds / 60) % 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m ${secs}s`;
  };

  const handleSaveAsTemplate = () => {
    // Reset dialog state
    setTemplateName(workout?.title || "");
    setSaveExerciseSets(false);
    setSaveDialogVisible(true);
  };

  const handleConfirmSaveTemplate = () => {
    // Here you would save the template to your storage/database
    
    // Mock implementation
    Alert.alert(
      "Template Saved",
      `"${templateName}" has been saved to your templates${
        saveExerciseSets ? " with exercise sets" : ""
      }.`,
      [{ text: "OK" }]
    );
    
    setSaveDialogVisible(false);
    
    // In a real app, you would save the template data here
  };

  const handleShareWorkout = async () => {
    try {
      // Create a string representation of the workout
      let message = `🏋️‍♂️ ${workout.title} - ${formatTime(workout.duration)}\n\n`;
      
      workout.exercises.forEach((exercise) => {
        message += `📊 ${exercise.name}\n`;
        
        // Count completed sets
        const completedSets = exercise.sets.filter((set) => set.completed).length;
        
        message += `   ${completedSets}/${exercise.sets.length} sets`;
        
        // Add best set info if available
        const validSets = exercise.sets.filter((set) => 
          set.completed && set.weight !== undefined && set.reps !== undefined
        );
        
        if (validSets.length > 0) {
          // Find the set with highest volume (weight * reps)
          const bestSet = validSets.reduce((prev, current) => {
            const prevVolume = (prev.weight || 0) * (prev.reps || 0);
            const currentVolume = (current.weight || 0) * (current.reps || 0);
            return currentVolume > prevVolume ? current : prev;
          });
          
          message += ` - Best: ${bestSet.weight}${exercise.weightUnit} x ${bestSet.reps}`;
          if (bestSet.rpe) {
            message += ` @${bestSet.rpe}`;
          }
        }
        
        message += "\n";
        
        // Add exercise notes if available
        if (exercise.notes) {
          message += `   Note: ${exercise.notes}\n`;
        }
      });
      
      // Add workout notes if available
      if (workout.notes) {
        message += `\n📝 Notes: ${workout.notes}\n`;
      }
      
      message += `\nTracked with SnapAndTrack`;
      
      await Share.share({
        message,
        title: workout.title,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share workout");
      console.error(error);
    }
  };

  const calculateWorkoutStats = () => {
    let totalSets = 0;
    let completedSets = 0;
    let totalVolume = 0;
    
    workout.exercises.forEach((exercise) => {
      totalSets += exercise.sets.length;
      
      exercise.sets.forEach((set) => {
        if (set.completed) {
          completedSets++;
          
          // Calculate volume if weight and reps are available
          if (set.weight && set.reps) {
            totalVolume += set.weight * set.reps;
          }
        }
      });
    });
    
    return {
      totalExercises: workout.exercises.length,
      totalSets,
      completedSets,
      completionRate: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
      totalVolume,
    };
  };

  const handleDone = () => {
    // Navigate back to the workout list screen
    navigation.reset({
      index: 0,
      routes: [{ name: "WorkoutList" }],
    });
  };

  const stats = calculateWorkoutStats();

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No workout data found</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="trophy-outline"
            size={24}
            color={COLORS.success}
          />
          <Text style={styles.headerTitle}>Workout Complete</Text>
        </View>
        <Text style={styles.workoutTitle}>{workout.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTime(workout.duration)}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalExercises}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{`${stats.completedSets}/${stats.totalSets}`}</Text>
                <Text style={styles.statLabel}>Sets</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{`${stats.completionRate}%`}</Text>
                <Text style={styles.statLabel}>Completion</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalVolume.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Volume</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Exercise Summary</Text>

        {workout.exercises.map((exercise) => {
          // Calculate exercise stats
          const totalSets = exercise.sets.length;
          const completedSets = exercise.sets.filter((set) => set.completed).length;
          let bestSet = null;
          let volume = 0;
          
          // Find best set and calculate volume
          exercise.sets.forEach((set) => {
            if (set.completed && set.weight && set.reps) {
              const setVolume = set.weight * set.reps;
              volume += setVolume;
              
              if (!bestSet || setVolume > (bestSet.weight || 0) * (bestSet.reps || 0)) {
                bestSet = set;
              }
            }
          });
          
          return (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <Card.Title
                title={exercise.name}
                subtitle={`${exercise.barType || "barbell"} • ${completedSets}/${totalSets} sets completed`}
                titleStyle={styles.exerciseTitle}
              />
              <Card.Content>
                <View style={styles.exerciseStatsRow}>
                  <View style={styles.exerciseStatItem}>
                    <Text style={styles.exerciseStatValue}>
                      {volume.toLocaleString()}
                    </Text>
                    <Text style={styles.exerciseStatLabel}>Volume</Text>
                  </View>
                  
                  {bestSet && (
                    <View style={styles.exerciseStatItem}>
                      <Text style={styles.exerciseStatValue}>
                        {`${bestSet.weight}${exercise.weightUnit} × ${bestSet.reps}`}
                        {bestSet.rpe && ` @${bestSet.rpe}`}
                      </Text>
                      <Text style={styles.exerciseStatLabel}>Best Set</Text>
                    </View>
                  )}
                </View>

                {/* Display sets */}
                <View style={styles.setsContainer}>
                  <View style={styles.setHeaderRow}>
                    <Text style={styles.setHeader}>SET</Text>
                    <Text style={styles.setHeader}>{exercise.weightUnit?.toUpperCase()}</Text>
                    <Text style={styles.setHeader}>REPS</Text>
                    <Text style={styles.setHeader}>RPE</Text>
                  </View>
                  
                  {exercise.sets.map((set, index) => (
                    <View
                      key={set.id}
                      style={[
                        styles.setRow,
                        !set.completed && styles.incompleteSetRow,
                      ]}
                    >
                      <Text style={styles.setCell}>{index + 1}</Text>
                      <Text style={styles.setCell}>
                        {set.weight !== undefined ? set.weight : "-"}
                      </Text>
                      <Text style={styles.setCell}>
                        {set.reps !== undefined ? set.reps : "-"}
                      </Text>
                      <Text style={styles.setCell}>
                        {set.rpe !== undefined ? set.rpe : "-"}
                      </Text>
                    </View>
                  ))}
                </View>

                {exercise.notes && (
                  <View style={styles.noteContainer}>
                    <MaterialCommunityIcons
                      name="note-text"
                      size={16}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.noteText}>{exercise.notes}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          );
        })}

        {workout.notes && (
          <Card style={styles.notesCard}>
            <Card.Title
              title="Workout Notes"
              titleStyle={styles.notesTitle}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="note-text"
                  size={24}
                  color={COLORS.primary}
                />
              )}
            />
            <Card.Content>
              <Text style={styles.workoutNotes}>{workout.notes}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleSaveAsTemplate}
          icon="content-save-outline"
          style={styles.footerButton}
        >
          Save as Template
        </Button>
        <Button
          mode="outlined"
          onPress={handleShareWorkout}
          icon="share-variant"
          style={styles.footerButton}
        >
          Share
        </Button>
        <Button
          mode="contained"
          onPress={handleDone}
          style={styles.doneButton}
        >
          Done
        </Button>
      </View>

      {/* Save as Template Dialog */}
      <Portal>
        <Dialog visible={saveDialogVisible} onDismiss={() => setSaveDialogVisible(false)}>
          <Dialog.Title>Save as Template</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Template Name"
              value={templateName}
              onChangeText={setTemplateName}
              style={styles.dialogInput}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={saveExerciseSets ? "checked" : "unchecked"}
                onPress={() => setSaveExerciseSets(!saveExerciseSets)}
              />
              <Text style={styles.checkboxLabel}>
                Save exercise sets (weights, reps, etc.)
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSaveDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleConfirmSaveTemplate} disabled={!templateName.trim()}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginBottom: 20,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.success,
    marginLeft: 8,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  exerciseCard: {
    marginBottom: 12,
    backgroundColor: COLORS.card,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exerciseStatItem: {
    alignItems: "center",
    flex: 1,
  },
  exerciseStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  exerciseStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  setsContainer: {
    marginTop: 8,
  },
  setHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  setHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    flex: 1,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  incompleteSetRow: {
    opacity: 0.5,
  },
  setCell: {
    flex: 1,
    textAlign: "center",
    color: COLORS.text,
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    alignItems: "flex-start",
  },
  noteText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
    flex: 1,
  },
  notesCard: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: COLORS.card,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  workoutNotes: {
    color: COLORS.text,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  doneButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  dialogInput: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    color: COLORS.text,
    marginLeft: 8,
  },
});

export default FinishWorkoutScreen; 