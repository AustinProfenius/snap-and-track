import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { COLORS } from "../../../app/styles/colors";
import {
  Text,
  Button,
  IconButton,
  Card,
  Avatar,
  Searchbar,
  Chip,
  FAB,
  SegmentedButtons,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";

interface Exercise {
  id: string;
  name: string;
  sets: {
    id: string;
    weight?: number;
    reps?: number;
    rpe?: number;
    completed: boolean;
  }[];
}

interface WorkoutTemplate {
  id: string;
  title: string;
  exercises: Exercise[];
  lastUsed?: string;
  favorite: boolean;
}

interface WorkoutHistory {
  id: string;
  title: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  volume: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for workout history
const MOCK_WORKOUT_HISTORY: WorkoutHistory[] = [
  {
    id: "1",
    title: "Upper Body Push",
    date: new Date(2023, 6, 10).toISOString(),
    duration: 3600,
    exercises: [
      {
        id: "ex1",
        name: "Bench Press",
        sets: [
          { id: "s1", weight: 135, reps: 10, completed: true },
          { id: "s2", weight: 155, reps: 8, completed: true },
          { id: "s3", weight: 175, reps: 6, completed: true },
        ],
      },
      {
        id: "ex2",
        name: "Overhead Press",
        sets: [
          { id: "s4", weight: 85, reps: 10, completed: true },
          { id: "s5", weight: 95, reps: 8, completed: true },
          { id: "s6", weight: 105, reps: 6, completed: true },
        ],
      },
    ],
    volume: 5740,
  },
  {
    id: "2",
    title: "Lower Body",
    date: new Date(2023, 6, 12).toISOString(),
    duration: 4500,
    exercises: [
      {
        id: "ex3",
        name: "Squats",
        sets: [
          { id: "s7", weight: 185, reps: 8, completed: true },
          { id: "s8", weight: 205, reps: 8, completed: true },
          { id: "s9", weight: 225, reps: 6, completed: true },
        ],
      },
      {
        id: "ex4",
        name: "Romanian Deadlift",
        sets: [
          { id: "s10", weight: 155, reps: 10, completed: true },
          { id: "s11", weight: 175, reps: 8, completed: true },
          { id: "s12", weight: 195, reps: 6, completed: true },
        ],
      },
    ],
    volume: 8280,
  },
  {
    id: "3",
    title: "Upper Body Pull",
    date: new Date(2023, 6, 14).toISOString(),
    duration: 3900,
    exercises: [
      {
        id: "ex5",
        name: "Pull-ups",
        sets: [
          { id: "s13", reps: 10, completed: true },
          { id: "s14", reps: 8, completed: true },
          { id: "s15", reps: 7, completed: true },
        ],
      },
      {
        id: "ex6",
        name: "Barbell Rows",
        sets: [
          { id: "s16", weight: 135, reps: 10, completed: true },
          { id: "s17", weight: 145, reps: 10, completed: true },
          { id: "s18", weight: 155, reps: 8, completed: true },
        ],
      },
    ],
    volume: 4390,
  },
  {
    id: "4",
    title: "Full Body",
    date: new Date().toISOString(),
    duration: 5400,
    exercises: [
      {
        id: "ex7",
        name: "Deadlift",
        sets: [
          { id: "s19", weight: 225, reps: 5, completed: true },
          { id: "s20", weight: 275, reps: 3, completed: true },
          { id: "s21", weight: 315, reps: 1, completed: true },
        ],
      },
      {
        id: "ex8",
        name: "Bench Press",
        sets: [
          { id: "s22", weight: 155, reps: 8, completed: true },
          { id: "s23", weight: 175, reps: 6, completed: true },
          { id: "s24", weight: 185, reps: 4, completed: true },
        ],
      },
      {
        id: "ex9",
        name: "Squat",
        sets: [
          { id: "s25", weight: 205, reps: 8, completed: true },
          { id: "s26", weight: 225, reps: 5, completed: true },
          { id: "s27", weight: 245, reps: 3, completed: true },
        ],
      },
    ],
    volume: 9820,
  },
];

// Mock data for workout templates
const MOCK_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "t1",
    title: "Push Day",
    exercises: [
      {
        id: "tex1",
        name: "Bench Press",
        sets: [
          { id: "ts1", completed: false },
          { id: "ts2", completed: false },
          { id: "ts3", completed: false },
        ],
      },
      {
        id: "tex2",
        name: "Overhead Press",
        sets: [
          { id: "ts4", completed: false },
          { id: "ts5", completed: false },
          { id: "ts6", completed: false },
        ],
      },
      {
        id: "tex3",
        name: "Incline Dumbbell Press",
        sets: [
          { id: "ts7", completed: false },
          { id: "ts8", completed: false },
          { id: "ts9", completed: false },
        ],
      },
    ],
    lastUsed: new Date(2023, 6, 10).toISOString(),
    favorite: true,
  },
  {
    id: "t2",
    title: "Pull Day",
    exercises: [
      {
        id: "tex4",
        name: "Pull-ups",
        sets: [
          { id: "ts10", completed: false },
          { id: "ts11", completed: false },
          { id: "ts12", completed: false },
        ],
      },
      {
        id: "tex5",
        name: "Barbell Rows",
        sets: [
          { id: "ts13", completed: false },
          { id: "ts14", completed: false },
          { id: "ts15", completed: false },
        ],
      },
      {
        id: "tex6",
        name: "Face Pulls",
        sets: [
          { id: "ts16", completed: false },
          { id: "ts17", completed: false },
          { id: "ts18", completed: false },
        ],
      },
    ],
    lastUsed: new Date(2023, 6, 12).toISOString(),
    favorite: false,
  },
  {
    id: "t3",
    title: "Leg Day",
    exercises: [
      {
        id: "tex7",
        name: "Squats",
        sets: [
          { id: "ts19", completed: false },
          { id: "ts20", completed: false },
          { id: "ts21", completed: false },
        ],
      },
      {
        id: "tex8",
        name: "Romanian Deadlifts",
        sets: [
          { id: "ts22", completed: false },
          { id: "ts23", completed: false },
          { id: "ts24", completed: false },
        ],
      },
      {
        id: "tex9",
        name: "Leg Press",
        sets: [
          { id: "ts25", completed: false },
          { id: "ts26", completed: false },
          { id: "ts27", completed: false },
        ],
      },
    ],
    lastUsed: new Date(2023, 6, 14).toISOString(),
    favorite: true,
  },
];

// Define filter types for workout history
type DateFilter = "all" | "week" | "month" | "3months";

const WorkoutListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // State variables
  const [activeTab, setActiveTab] = useState<"history" | "templates">("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Fetch workout data (in a real app this would be from AsyncStorage/database)
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>(MOCK_WORKOUT_HISTORY);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(MOCK_WORKOUT_TEMPLATES);
  
  // Filter and sort workout history based on search and date filter
  const filteredWorkoutHistory = workoutHistory
    .filter((workout) => {
      // Search filter
      const matchesSearch = workout.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const workoutDate = parseISO(workout.date);
        let cutoffDate;
        
        switch (dateFilter) {
          case "week":
            cutoffDate = subDays(new Date(), 7);
            break;
          case "month":
            cutoffDate = subDays(new Date(), 30);
            break;
          case "3months":
            cutoffDate = subDays(new Date(), 90);
            break;
        }
        
        matchesDate = isAfter(workoutDate, cutoffDate);
      }
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      // Sort by date (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  // Filter workout templates based on search and favorites
  const filteredWorkoutTemplates = workoutTemplates
    .filter((template) => {
      // Search filter
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      // Favorites filter
      const matchesFavorite = showFavoritesOnly ? template.favorite : true;
      
      return matchesSearch && matchesFavorite;
    })
    .sort((a, b) => {
      // Sort by last used (most recent first) and then by favorite status
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      
      if (a.lastUsed && b.lastUsed) {
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      }
      
      return 0;
    });
  
  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // In a real app, you would refetch data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  // Handle starting a new workout
  const handleStartWorkout = () => {
    navigation.navigate("StartWorkout");
  };
  
  // Handle using a template
  const handleUseTemplate = (template: WorkoutTemplate) => {
    // Convert template to workout format
    const workout = {
      title: template.title,
      duration: 0,
      exercises: template.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => ({
          ...set,
          completed: false,
        })),
      })),
    };
    
    // Navigate to edit workout screen with the template
    navigation.navigate("EditWorkout", { workout });
  };
  
  // Handle viewing workout details
  const handleViewWorkout = (workout: WorkoutHistory) => {
    // Navigate to workout details screen
    // navigation.navigate("WorkoutDetail", { workoutId: workout.id });
    // For now, just display an alert
    alert(`Viewing details for workout: ${workout.title}`);
  };
  
  // Toggle template favorite status
  const handleToggleFavorite = (templateId: string) => {
    setWorkoutTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, favorite: !template.favorite }
          : template
      )
    );
  };
  
  // Render workout history item
  const renderWorkoutHistoryItem = ({ item }: { item: WorkoutHistory }) => {
    const formattedDate = format(new Date(item.date), "MMM d, yyyy");
    
    // Format duration
    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };
    
    return (
      <Card style={styles.workoutCard} onPress={() => handleViewWorkout(item)}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.workoutCardTitle}>{item.title}</Text>
              <Text style={styles.workoutCardDate}>{formattedDate}</Text>
            </View>
            <View style={styles.workoutCardStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.exercises.length}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.volume.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Volume</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.exercisesList}>
            {item.exercises.slice(0, 3).map((exercise) => (
              <Chip key={exercise.id} style={styles.exerciseChip}>
                {exercise.name}
              </Chip>
            ))}
            {item.exercises.length > 3 && (
              <Chip style={styles.exerciseChip}>
                +{item.exercises.length - 3} more
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  // Render workout template item
  const renderWorkoutTemplateItem = ({ item }: { item: WorkoutTemplate }) => {
    return (
      <Card style={styles.templateCard}>
        <Card.Content>
          <View style={styles.templateCardHeader}>
            <View style={styles.templateCardTitleContainer}>
              <Text style={styles.templateCardTitle}>{item.title}</Text>
              <Text style={styles.templateCardExercises}>
                {item.exercises.length} exercises
              </Text>
            </View>
            <IconButton
              icon={item.favorite ? "star" : "star-outline"}
              size={24}
              iconColor={item.favorite ? COLORS.warning : COLORS.textSecondary}
              onPress={() => handleToggleFavorite(item.id)}
            />
          </View>
          
          <View style={styles.exercisesList}>
            {item.exercises.slice(0, 3).map((exercise) => (
              <Chip key={exercise.id} style={styles.exerciseChip}>
                {exercise.name}
              </Chip>
            ))}
            {item.exercises.length > 3 && (
              <Chip style={styles.exerciseChip}>
                +{item.exercises.length - 3} more
              </Chip>
            )}
          </View>
          
          <View style={styles.templateActions}>
            {item.lastUsed && (
              <Text style={styles.lastUsedText}>
                Last used: {format(new Date(item.lastUsed), "MMM d, yyyy")}
              </Text>
            )}
            <Button
              mode="contained"
              style={styles.useTemplateButton}
              onPress={() => handleUseTemplate(item)}
            >
              Use
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "history" | "templates")}
          buttons={[
            {
              value: "history",
              label: "History",
              icon: "history",
            },
            {
              value: "templates",
              label: "Templates",
              icon: "bookmark-outline",
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={
            activeTab === "history"
              ? "Search workout history..."
              : "Search templates..."
          }
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={COLORS.textSecondary}
        />
      </View>
      
      {activeTab === "history" && (
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <Chip
              selected={dateFilter === "all"}
              onPress={() => setDateFilter("all")}
              style={styles.filterChip}
            >
              All Time
            </Chip>
            <Chip
              selected={dateFilter === "week"}
              onPress={() => setDateFilter("week")}
              style={styles.filterChip}
            >
              Last Week
            </Chip>
            <Chip
              selected={dateFilter === "month"}
              onPress={() => setDateFilter("month")}
              style={styles.filterChip}
            >
              Last Month
            </Chip>
            <Chip
              selected={dateFilter === "3months"}
              onPress={() => setDateFilter("3months")}
              style={styles.filterChip}
            >
              Last 3 Months
            </Chip>
          </ScrollView>
        </View>
      )}
      
      {activeTab === "templates" && (
        <View style={styles.filterContainer}>
          <Chip
            selected={showFavoritesOnly}
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={styles.filterChip}
            icon="star"
          >
            Favorites Only
          </Chip>
        </View>
      )}
      
      {activeTab === "history" && filteredWorkoutHistory.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="weight-lifter"
            size={64}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>No workout history found</Text>
          <Button
            mode="contained"
            onPress={handleStartWorkout}
            style={styles.emptyButton}
            icon="plus"
          >
            Start a Workout
          </Button>
        </View>
      )}
      
      {activeTab === "templates" && filteredWorkoutTemplates.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={64}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>No workout templates found</Text>
          <Text style={styles.emptySubtext}>
            Complete a workout and save it as a template
          </Text>
        </View>
      )}
      
      {activeTab === "history" && filteredWorkoutHistory.length > 0 && (
        <FlatList
          data={filteredWorkoutHistory}
          renderItem={renderWorkoutHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      {activeTab === "templates" && filteredWorkoutTemplates.length > 0 && (
        <FlatList
          data={filteredWorkoutTemplates}
          renderItem={renderWorkoutTemplateItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      <FAB
        icon="plus"
        label="New Workout"
        style={styles.fab}
        onPress={handleStartWorkout}
      />
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
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: COLORS.card,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBar: {
    backgroundColor: COLORS.card,
    elevation: 0,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  workoutCard: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  workoutCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  workoutCardDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  workoutCardStats: {
    flexDirection: "row",
  },
  statItem: {
    alignItems: "center",
    marginLeft: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  exercisesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  exerciseChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.card,
  },
  templateCard: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
  },
  templateCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  templateCardTitleContainer: {
    flex: 1,
  },
  templateCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  templateCardExercises: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  templateActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  lastUsedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  useTemplateButton: {
    minWidth: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
  },
});

export default WorkoutListScreen;
