import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { getLiveRanking, makeRanking } from "../../../actions/rankings";
import { setFavorite } from "../../../actions/user";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import DraggableStringList from "./DragAndDrop";

const CreatePrediction: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [favoriteTeam, setFavoriteTeam] = useState<string>("");

  useEffect(() => {
    getLiveRanking()
      .then((liveRanking) => {
        setTeams(liveRanking.ranking);
        setFavoriteTeam(liveRanking.ranking[0]);
      })
      .catch((error) => {
        console.error("Error fetching live ranking:", error);
      });
  }, []);

  const saveTable = () => {
    makeRanking({ teams })
      .then(() => {
        setFavorite(favoriteTeam);
      })
      .then(() => {
        Alert.alert("Success", "Your standings have been saved");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  console.log(teams);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <DraggableStringList items={teams} setItems={setTeams} />
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Favorite Team</Text>
          <Picker
            selectedValue={favoriteTeam}
            onValueChange={(itemValue) => setFavoriteTeam(itemValue)}
            style={styles.picker}
          >
            {teams.map((team) => (
              <Picker.Item key={team} label={team} value={team} />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Save Standings" onPress={saveTable} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
    marginBottom: 150,
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
