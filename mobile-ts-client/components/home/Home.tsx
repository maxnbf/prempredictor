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
import { NewUserOnboarding } from "./onboarding/NewUserOnboarding";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LiveRanking, UserRanking } from "../../types/types";
import { TableView } from "./table/TableView";
import { HomeRouteProp, HomeScreenProps } from "../../types/routes";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const route = useRoute<HomeRouteProp>();
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
          console.log("setting selected gameweek to:", gameweek);
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

  console.log(myTable);
  return (
    <SafeAreaView>
      <View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : myTable && live ? (
          <TableView
            setLive={setLive}
            live={live}
            myTable={myTable}
            otherTable={otherTable}
            currentGameWeek={currentGameWeek}
            selectedGameWeek={selectedGameWeek}
          />
        ) : myTable === null ? (
          <NewUserOnboarding />
        ) : (
          <Text>Something Went Wrong</Text>
        )}
      </View>
    </SafeAreaView>
  );
};
