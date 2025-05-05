import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Search } from "./Search";
import { getFavorite } from "../../actions/user";
import { Ionicons } from "@expo/vector-icons";
import { GroupHomeScreenProps, HomeScreenProps } from "../../types/routes";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getRankingSnapshot } from "../../actions/rankings";
import { RankingSnapshot } from "../../types/types";
import { Loading } from "../common/Loading";

export const Groups: React.FC = () => {
  const [favoriteTeam, setFavoriteTeam] = useState<string | undefined>(
    undefined
  );

  const [rankingSnapshot, setRankingSnapshot] = useState<
    RankingSnapshot | undefined
  >(undefined);

  const navigation = useNavigation<GroupHomeScreenProps>();
  const tabNavigation = useNavigation<HomeScreenProps>();

  const fetchData = async () => {
    const favorite = await getFavorite();
    const snapshot: RankingSnapshot = await getRankingSnapshot();
    setRankingSnapshot(snapshot);
    setFavoriteTeam(favorite);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (!rankingSnapshot) {
    return <Loading />;
  }

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <View style={styles.topBanner}>
            <View style={{ width: 24 }} />
            <Text style={styles.topBannerTitle}>League Lock</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ padding: 20 }}>
            <Search />
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Gameweek {rankingSnapshot.currentGameWeek}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {rankingSnapshot.averagePoints}
                  </Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>

                <TouchableOpacity
                  style={styles.myPointsContainer}
                  onPress={() =>
                    tabNavigation.navigate("Home", {
                      username: undefined,
                      gameweek: undefined,
                    })
                  }
                >
                  <Text style={styles.myPointsValue}>
                    {rankingSnapshot.myPoints}
                  </Text>
                  <View style={styles.statWithIcon}>
                    <Text style={styles.myPointsLabel}>My Points</Text>
                    <Ionicons name="chevron-forward" size={16} color="#555" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statBox}
                  onPress={() =>
                    tabNavigation.navigate("Home", {
                      username: rankingSnapshot.lowestPoints?.username,
                      gameweek: undefined,
                    })
                  }
                >
                  <Text style={styles.statValue}>
                    {rankingSnapshot?.lowestPoints?.points}
                  </Text>
                  <View style={styles.statWithIcon}>
                    <Text style={styles.statLabel}>Best</Text>
                    <Ionicons name="chevron-forward" size={16} color="#555" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}
              >
                My Groups
              </Text>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 1 }]}>Rank</Text>
                <Text style={[styles.headerCell, { flex: 4 }]}>Group Name</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>{""}</Text>
                {/* Placeholder for icon */}
              </View>

              {/* Group Rows */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Table", { type: "Overall" })
                }
                style={styles.leagueRow}
              >
                <Text style={[styles.leagueText, { flex: 1 }]}>
                  {rankingSnapshot.overallRank}
                </Text>
                <Text style={[styles.leagueText, { flex: 4 }]}>Overall</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#555"
                  style={{ flex: 1, textAlign: "right" }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Table", { type: "Friends" })
                }
                style={styles.leagueRow}
              >
                <Text style={[styles.leagueText, { flex: 1 }]}>
                  {rankingSnapshot.friendsRank}
                </Text>
                <Text style={[styles.leagueText, { flex: 4 }]}>Friends</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#555"
                  style={{ flex: 1, textAlign: "right" }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Table", { type: `${favoriteTeam} Fans` })
                }
                style={styles.leagueRow}
              >
                <Text style={[styles.leagueText, { flex: 1 }]}>
                  {rankingSnapshot.favoriteTeamRank}
                </Text>
                <Text style={[styles.leagueText, { flex: 4 }]}>
                  {`${favoriteTeam} Fans`}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#555"
                  style={{ flex: 1, textAlign: "right" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  banner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  bannerText: {
    color: "purple",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  myPointsContainer: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#444",
    backgroundColor: "#f9f9f9",
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
  myPointsValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  myPointsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  leagueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  leagueText: {
    fontSize: 16,
  },
  statWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  topBannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
});
