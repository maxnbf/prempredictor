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

export type Item = {
  team: string;
  logo: string;
};

const CreatePrediction: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [teams, setTeams] = useState<Item[]>([]);
  const [favoriteTeam, setFavoriteTeam] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getLiveRanking()
      .then((liveRanking) => {
        setTeams(
          liveRanking.ranking.map((team: string, index) => ({
            team,
            logo: liveRanking.logoUrls[index],
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
    await makeRanking({ teams: teams.map((team) => team.team) });
    setFavorite(favoriteTeam);
    await AsyncStorage.setItem("favoriteTeam", favoriteTeam);
    navigation.navigate("Main", {
      screen: "Home",
      params: { username: undefined, gameweek: undefined },
    });
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaView>
      <Text>
        Reorder the standings below to make your prediction. Double click your
        favorite team, then click 'Save'
      </Text>
      <Button title="Save" onPress={() => saveTable()} />
      <ScrollView>
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
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: "center",
    marginBottom: 100,
  },
  dropdownContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default CreatePrediction;
