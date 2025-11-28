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
    return <></>;
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
                    <Ionicons name="chevron-forward" size={14} color="#fff" />
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
                      size={14}
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
                    size={18}
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
                    size={18}
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
                    size={18}
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
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
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
  banner: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  gameweekBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: "center",
  },
  bannerText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  myPointsContainer: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  myPointsValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 3,
  },
  myPointsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  statWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  groupsSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  groupsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerCell: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  leagueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 12,
    minWidth: 36,
    alignItems: "center",
    flex: 1,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  leagueText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
});
