import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getLiveRanking, makeRanking } from "../../../actions/rankings";
import { setFavorite } from "../../../actions/user";
import { SafeAreaView } from "react-native-safe-area-context";
import { DragAndDrop } from "./DragAndDrop";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { OnboardingScreenProps } from "../../../types/routes";
import { useSelector } from "react-redux";

export type Item = {
  team: string;
  logo: string;
};

const CreatePrediction: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [teams, setTeams] = useState<Item[]>([]);
  const [favoriteTeam, setFavoriteTeam] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logos = useSelector((state: any) => state.logos.logos);

  useEffect(() => {
    setIsLoading(true);
    getLiveRanking()
      .then((liveRanking) => {
        const sortedTeams = liveRanking.ranking
          .map((team: string) => ({
            team,
            logo: logos[team],
          }))
          .sort((a, b) => a.team.localeCompare(b.team));

        setTeams(sortedTeams);
        setFavoriteTeam("");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching live ranking:", error);
      });
  }, []);

  const saveTable = async () => {
    if (favoriteTeam !== "") {
      setIsLoading(true);
      try {
        await makeRanking({
          teams: teams.map((team) => team.team),
          favoriteTeam: favoriteTeam,
        });
        await AsyncStorage.setItem("favoriteTeam", favoriteTeam);
        navigation.navigate("Main", {
          screen: "Home",
          params: { username: undefined, gameweek: undefined },
        });
      } catch (error) {
        console.error("Error saving prediction:", error);
        Alert.alert(
          "Error",
          "Failed to save your prediction. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Choose a Favorite Team",
        "Please select a favorite team by double-tapping on it.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingBackground}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading teams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBackground}>
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Create Your Prediction 🏆</Text>
          <Text style={styles.subtitle}>
            Drag to reorder • Double-tap to set favorite
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
      >
        <View style={styles.container}>
          <DragAndDrop
            items={teams}
            setItems={setTeams}
            favoriteTeam={favoriteTeam}
            setFavoriteTeam={setFavoriteTeam}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveTable}>
          <View style={styles.saveButtonBackground}>
            <Text style={styles.saveButtonText}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 16,
  },
  headerBackground: {
    backgroundColor: "#6366f1",
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
  },
  favoriteIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  favoriteText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
  },
  instructionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonBackground: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreatePrediction;
