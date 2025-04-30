import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { HomeScreenProps, TableRouteProps } from "../../types/routes";
import { UserScore } from "../../types/types";
import {
  getAllFriendsRankings,
  getAllRanking,
  getFanRanking,
} from "../../actions/rankings";
import { Loading } from "../common/Loading";

export const SingleTable: React.FC = () => {
  const route = useRoute<TableRouteProps>();
  const { type } = route.params;

  const [ranking, setRanking] = useState<UserScore[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<HomeScreenProps>();

  const logos = useSelector((state: any) => state.logos.logos);

  const fetchData = async () => {
    if (type === "Overall") {
      const overall = await getAllRanking();
      setRanking(overall);
    } else if (type === "Friends") {
      const friends = await getAllFriendsRankings();
      setRanking(friends);
    } else if (type.includes("Fans")) {
      const fans = await getFanRanking(
        type.substring(0, type.indexOf("Fans") - 1)
      );
      setRanking(fans);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [type]);

  if (loading || !ranking) {
    return <Loading />;
  }

  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.position]}>Pos</Text>
        <Text style={[styles.cell, styles.usernameHeader]}>User</Text>
        <Text style={[styles.cell, styles.points]}>Points</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {ranking.map((user, index) => (
          <TouchableOpacity
            style={[styles.tableRow, index === 0 && { paddingTop: 0 }]}
            key={user.username + index}
            onPress={() =>
              navigation.navigate("Home", {
                username: user.username,
                gameweek: undefined,
              })
            }
          >
            <Text style={[styles.cell, styles.position]}>{index + 1}</Text>
            <View style={[styles.usernameRow]}>
              {user.favorite && logos?.[user.favorite] && (
                <Image
                  source={{ uri: logos[user.favorite] }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              )}
              {/* <Text style={styles.fullName}>{user.fullName}</Text> */}
              <Text style={styles.username}>@{user.username}</Text>
            </View>
            <Text style={[styles.cell, styles.points]}>{user.score}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  tableHeader: {
    padding: 16,
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    fontSize: 20,
  },
  position: {
    width: 60,
    fontWeight: "bold",
  },
  usernameHeader: {
    flex: 1,
    fontWeight: "bold",
  },
  usernameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 20,
  },
  points: {
    width: 90,
    textAlign: "right",
    fontWeight: "600",
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    color: "gray",
  },
});
