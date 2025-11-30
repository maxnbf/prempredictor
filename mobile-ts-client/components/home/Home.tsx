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
import { Platform, StyleSheet, Text, View } from "react-native";
import { LiveRanking, UserRanking } from "../../types/types";
import { TableView } from "./table/TableView";
import { HomeRouteProps, HomeScreenProps } from "../../types/routes";
import { SafeAreaView } from "react-native-safe-area-context";
import { failedNotif, registerNotifs } from "../../actions/pushnotifs";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from 'expo-constants';

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

  
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        //alert("Failed to get push token for push notification!");
        await failedNotif(finalStatus)
        return;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas.projectId })).data;
      } catch (e) {
        if (e instanceof Error) {
          await failedNotif(e.message)
        }
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      // Send token to your backend to store in MongoDB
      if (token) {
        registerNotifs(token);
      }
    });
  }, []);

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
        <></>
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
  },

  topBannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    color: "#1e293b",
  },
  iconPlaceholder: {
    width: 24, // matches icon size
  },
});
