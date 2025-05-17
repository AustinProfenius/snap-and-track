import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { COLORS } from "../../../app/styles/colors";
import { Button, Searchbar, Card, Chip } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for templates
const MOCK_TEMPLATES = [
  {
    id: "1",
    title: "Upper Body Strength",
    exercises: ["Bench Press", "Overhead Press", "Pull Ups", "Rows"],
    lastUsed: "3 days ago",
    favorite: true,
  },
  {
    id: "2",
    title: "Lower Body Power",
    exercises: ["Squats", "Deadlifts", "Lunges", "Leg Press"],
    lastUsed: "1 week ago",
    favorite: false,
  },
  {
    id: "3",
    title: "Full Body Workout",
    exercises: ["Squats", "Bench Press", "Deadlifts", "Pull Ups", "Lunges"],
    lastUsed: "2 weeks ago",
    favorite: true,
  },
];

interface Template {
  id: string;
  title: string;
  exercises: string[];
  lastUsed: string;
  favorite: boolean;
}

const StartWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const handleCustomWorkout = () => {
    navigation.navigate("EditWorkout", {
      workout: {
        title: "Custom Workout",
        exercises: [],
        duration: 0,
      },
    });
  };

  const handleSelectTemplate = (template: Template) => {
    // Convert template to workout format
    navigation.navigate("EditWorkout", {
      workout: {
        title: template.title,
        exercises: template.exercises.map((name, index) => ({
          id: `${index}`,
          name,
          sets: [{ id: `${index}-1`, completed: false }],
        })),
        duration: 0,
      },
      isTemplate: true,
    });
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? { ...template, favorite: !template.favorite }
          : template
      )
    );
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    if (filter === "favorites") {
      return matchesSearch && template.favorite;
    }
    
    return matchesSearch;
  });

  const renderTemplateItem = ({ item }: { item: Template }) => (
    <Card style={styles.templateCard} onPress={() => handleSelectTemplate(item)}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.templateTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
            <MaterialCommunityIcons
              name={item.favorite ? "star" : "star-outline"}
              size={24}
              color={item.favorite ? COLORS.warning : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.lastUsed}>Last used: {item.lastUsed}</Text>
        <View style={styles.exerciseChips}>
          {item.exercises.slice(0, 3).map((exercise, index) => (
            <Chip key={index} style={styles.exerciseChip}>
              {exercise}
            </Chip>
          ))}
          {item.exercises.length > 3 && (
            <Chip style={styles.exerciseChip}>+{item.exercises.length - 3} more</Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Start a Workout</Text>
        </View>

        <View style={styles.customWorkoutContainer}>
          <TouchableOpacity
            style={styles.customWorkoutButton}
            onPress={handleCustomWorkout}
          >
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={48}
              color={COLORS.primary}
            />
            <Text style={styles.customWorkoutText}>Start Custom Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR CHOOSE TEMPLATE</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search templates"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <View style={styles.filterChips}>
            <Chip
              selected={filter === "all"}
              onPress={() => setFilter("all")}
              style={[
                styles.filterChip,
                filter === "all" && styles.selectedFilterChip,
              ]}
              textStyle={[
                styles.filterChipText,
                filter === "all" && styles.selectedFilterChipText,
              ]}
            >
              All
            </Chip>
            <Chip
              selected={filter === "favorites"}
              onPress={() => setFilter("favorites")}
              style={[
                styles.filterChip,
                filter === "favorites" && styles.selectedFilterChip,
              ]}
              textStyle={[
                styles.filterChipText,
                filter === "favorites" && styles.selectedFilterChipText,
              ]}
            >
              Favorites
            </Chip>
          </View>
        </View>

        {filteredTemplates.length > 0 ? (
          <FlatList
            data={filteredTemplates}
            renderItem={renderTemplateItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.templateList}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="magnify"
              size={48}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyStateText}>No templates found</Text>
          </View>
        )}
      </ScrollView>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  customWorkoutContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  customWorkoutButton: {
    alignItems: "center",
  },
  customWorkoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchbar: {
    backgroundColor: COLORS.card,
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: "row",
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: COLORS.card,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.text,
  },
  selectedFilterChipText: {
    color: COLORS.white,
  },
  templateList: {
    marginBottom: 24,
  },
  templateCard: {
    backgroundColor: COLORS.card,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  lastUsed: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  exerciseChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  exerciseChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.card,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});

export default StartWorkoutScreen; 