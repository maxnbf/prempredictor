import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { getLiveRanking } from "../../actions/rankings";
import { FantasyPredictions } from "./FantasyPredictions";
import { GameweekDropdown } from "../common/GameWeekDropDown";
import { FantasyRanking } from "./FantasyRanking";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { FantasyScreenProps } from "../../types/routes";
import { Icon, IconButton } from "react-native-paper";

export const Fantasy = () => {
  const [gameWeek, setGameWeek] = useState<number>(-1);
  const [selectedGameWeek, setSelectedGameWeek] = useState<number>(-1);
  const [isWeekComplete, setIsWeekComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [liveRanking, setLiveRanking] = useState<string[]>([]);

  const navigation = useNavigation<FantasyScreenProps>();
  const fetchData = async () => {
    setLoading(true);
    const rankingResult = await getLiveRanking();

    setLiveRanking(rankingResult.ranking);
    setIsWeekComplete(rankingResult.isWeekComplete);

    const roundToQuery = rankingResult.isWeekComplete
      ? rankingResult.currentRound + 1
      : rankingResult.currentRound;

    setGameWeek(roundToQuery);
    setSelectedGameWeek(roundToQuery);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      //   return () => {
      //     setSelectedGameWeek(undefined);
      //     setMyTable(undefined);
      //     setOtherTable(undefined);
      //     setLive(undefined);
      //     navigation.setParams({ username: undefined, gameweek: undefined });
      //   };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleInfoPress = () => {
    navigation.navigate("FantasyRules");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBanner}>
        <Text style={styles.topBannerTitle}>League Lock</Text>
        <View style={styles.infoButtonWrapper}>
          <IconButton
            icon="information-outline"
            size={20}
            onPress={handleInfoPress}
            style={styles.infoButton}
          />
        </View>
      </View>
      <View style={styles.headerSection}>
        <GameweekDropdown
          currentGameWeek={gameWeek.toString()}
          selectedGameWeek={selectedGameWeek.toString()}
          onSelect={(gw: string) => setSelectedGameWeek(parseInt(gw))}
        />
      </View>
      <ScrollView style={styles.container}>
        <FantasyPredictions
          isWeekComplete={isWeekComplete}
          gameWeek={gameWeek}
          selectedGameWeek={selectedGameWeek}
        />
        <FantasyRanking
          liveRanking={liveRanking}
          isWeekComplete={isWeekComplete}
          gameWeek={gameWeek}
          selectedGameWeek={selectedGameWeek}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, backgroundColor: "#f8fafc" },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1e293b",
  },
  safeArea: {
    backgroundColor: "#f8fafc",
  },
  topBanner: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  topBannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    color: "#1e293b",
  },
  headerSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    zIndex: 2000,
  },
  infoButtonWrapper: {
    position: "absolute",
    right: 10,
    top: -10,
  },
  infoButton: {
    backgroundColor: "lightblue",
    margin: 0,
  },
});
