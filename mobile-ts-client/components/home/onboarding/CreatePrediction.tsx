import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
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
        setTeams(
          liveRanking.ranking.map((team: string) => ({
            team,
            logo: logos[team],
          }))
        );
        setFavoriteTeam(liveRanking.ranking[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching live ranking:", error);
      });
  }, []);

  const saveTable = async () => {
    await makeRanking({
      teams: teams.map((team) => team.team),
      favoriteTeam: favoriteTeam,
    });
    await AsyncStorage.setItem("favoriteTeam", favoriteTeam);
    navigation.navigate("Main", {
      screen: "Home",
      params: { username: undefined, gameweek: undefined },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Prediction</Text>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle}>
            Reorder the table to predict the final standings. Double-tap to set
            your favorite team, then save!
          </Text>
          <View style={styles.saveButton}>
            <Button title="Save" onPress={saveTable} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        persistentScrollbar={true} // <- Forces scrollbar to always show
        showsVerticalScrollIndicator={true}
        indicatorStyle="black" // Only works on iOS, but we'll fix it for Android too below
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#444",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#222222",
  },
  headerRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 22,
    flex: 1,
  },
  saveButton: {
    width: "35%", // Adjust size as needed
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  container: {
    justifyContent: "center",
  },
});

export default CreatePrediction;
