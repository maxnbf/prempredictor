import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import {
  getLiveRanking,
  getLiveRankingForGameWeek,
  getRanking,
} from "../../actions/rankings";
import { StyleSheet, Text, View } from "react-native";
import { LiveRanking, UserRanking } from "../../types/types";
import { TableView } from "./table/TableView";
import { HomeRouteProps, HomeScreenProps } from "../../types/routes";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../common/Loading";
import { logoutUser } from "../../navigation/navigation";

export const Home = () => {
  const [myTable, setMyTable] = useState<UserRanking | undefined>(undefined);
  const [otherTable, setOtherTable] = useState<UserRanking | undefined>(
    undefined
  );
  const [live, setLive] = useState<LiveRanking | undefined>(undefined);
  const [currentGameWeek, setCurrentGameWeek] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const ownUsername = useSelector(
    (state: any) => state.auth.user_info.username
  );
  const route = useRoute<HomeRouteProps>();
  const { username, gameweek } = route.params || {};
  const [selectedGameWeek, setSelectedGameWeek] = useState<string | undefined>(
    undefined
  );

  const navigation = useNavigation<HomeScreenProps>();

  const fetchData = async () => {
    setIsLoading(true);
    getRanking(ownUsername).then((res) => setMyTable(res));
    if (username !== ownUsername && username !== undefined) {
      getRanking(username).then((res) => setOtherTable(res));
    }
    getLiveRanking().then((res: any) => {
      setCurrentGameWeek(res.currentRound);
      setLive(res);
      if (gameweek) {
        getLiveRankingForGameWeek(gameweek).then((res: any) => {
          setLive(res);
          setSelectedGameWeek(gameweek);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        setSelectedGameWeek(undefined);
        setMyTable(undefined);
        setOtherTable(undefined);
        setLive(undefined);
        navigation.setParams({ username: undefined, gameweek: undefined });
      };
    }, [])
  );

  // Used to reset the selected gameweek when the user navigates back to this screen using params
  useEffect(() => {
    setSelectedGameWeek(gameweek);
  }, [gameweek]);

  useEffect(() => {
    fetchData();
  }, [ownUsername, username, gameweek]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBanner}>
        <View style={{ width: 24 }} />
        <Text style={styles.topBannerTitle}>League Lock</Text>
        <View style={{ width: 24 }} />
      </View>
      {isLoading ? (
        <Loading />
      ) : (
        <TableView
          setLive={setLive}
          live={live}
          myTable={myTable}
          otherTable={otherTable}
          currentGameWeek={currentGameWeek}
          selectedGameWeek={selectedGameWeek}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f8f9fa",
  },
  topBanner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  topBannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  iconPlaceholder: {
    width: 24, // matches icon size
  },
});
