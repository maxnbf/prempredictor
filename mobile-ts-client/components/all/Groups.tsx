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
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.topBanner}>
            <View style={{ width: 24 }} />
            <Text style={styles.topBannerTitle}>League Lock</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <Search />
            </View>

            <View style={styles.banner}>
              <View style={styles.gameweekBadge}>
                <Text style={styles.bannerText}>
                  Gameweek {rankingSnapshot.currentGameWeek}
                </Text>
              </View>

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
                  activeOpacity={0.8}
                >
                  <Text style={styles.myPointsValue}>
                    {rankingSnapshot.myPoints}
                  </Text>
                  <View style={styles.statWithIcon}>
                    <Text style={styles.myPointsLabel}>My Points</Text>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
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
                  activeOpacity={0.7}
                >
                  <Text style={styles.statValue}>
                    {rankingSnapshot?.lowestPoints?.points}
                  </Text>
                  <View style={styles.statWithIcon}>
                    <Text style={styles.statLabel}>Best</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#6366f1"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.groupsSection}>
              <Text style={styles.sectionTitle}>My Groups</Text>

              <View style={styles.groupsCard}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, { flex: 2 }]}>Rank</Text>
                  <Text style={[styles.headerCell, { flex: 4 }]}>
                    Group Name
                  </Text>
                  <Text style={[styles.headerCell, { flex: 1 }]}></Text>
                </View>

                {/* Group Rows */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Table", { type: "Overall" })
                  }
                  style={[styles.leagueRow, styles.firstRow]}
                  activeOpacity={0.7}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>
                      {rankingSnapshot.overallRank}
                    </Text>
                  </View>
                  <Text style={[styles.leagueText, { flex: 4 }]}>Overall</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#6366f1"
                    style={{ flex: 1, textAlign: "right" }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Table", { type: "Friends" })
                  }
                  style={styles.leagueRow}
                  activeOpacity={0.7}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>
                      {rankingSnapshot.friendsRank}
                    </Text>
                  </View>
                  <Text style={[styles.leagueText, { flex: 4 }]}>Friends</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#6366f1"
                    style={{ flex: 1, textAlign: "right" }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Table", {
                      type: `${favoriteTeam} Fans`,
                    })
                  }
                  style={[styles.leagueRow, styles.lastRow]}
                  activeOpacity={0.7}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>
                      {rankingSnapshot.favoriteTeamRank}
                    </Text>
                  </View>
                  <Text style={[styles.leagueText, { flex: 4 }]}>
                    {`${favoriteTeam} Fans`}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#6366f1"
                    style={{ flex: 1, textAlign: "right" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
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
  banner: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameweekBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  bannerText: {
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  myPointsContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  myPointsValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  myPointsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  statWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  groupsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  groupsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  leagueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fff",
  },
  firstRow: {
    borderTopWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rankBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 16,
    minWidth: 40,
    alignItems: "center",
    flex: 1,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  leagueText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
});
