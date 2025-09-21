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
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.positionHeader}>
          <Text style={styles.headerText}>Rank</Text>
        </View>
        <View style={styles.usernameHeader}>
          <Text style={styles.headerText}>Player</Text>
        </View>
        <View style={styles.pointsHeader}>
          <Text style={styles.headerText}>Points</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1976d2"]}
            tintColor="#1976d2"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {ranking.map((user, index) => {
          const isTopThree = index < 3;
          const isCurrentUser = false; // You might want to add logic to detect current user

          return (
            <TouchableOpacity
              style={[
                styles.tableRow,
                isTopThree && styles.topThreeRow,
                isCurrentUser && styles.currentUserRow,
              ]}
              key={user.username + index}
              onPress={() =>
                navigation.navigate("Home", {
                  username: user.username,
                  gameweek: undefined,
                })
              }
              activeOpacity={0.7}
            >
              {/* Position with medal for top 3 */}
              <View style={styles.positionContainer}>
                {isTopThree ? (
                  <View
                    style={[
                      styles.medal,
                      styles[`medal${index + 1}` as keyof typeof styles],
                    ]}
                  >
                    <Text style={styles.medalText}>{index + 1}</Text>
                  </View>
                ) : (
                  <Text style={styles.positionText}>{index + 1}</Text>
                )}
              </View>

              {/* User Info */}
              <View style={styles.usernameRow}>
                {user.favorite && logos?.[user.favorite] && (
                  <View style={styles.logoContainer}>
                    <Image
                      source={{ uri: logos[user.favorite] }}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                )}
                <View style={styles.userInfo}>
                  <Text style={styles.username} numberOfLines={1}>
                    @{user.username}
                  </Text>
                </View>
              </View>

              {/* Points */}
              <View style={styles.pointsContainer}>
                <Text
                  style={[
                    styles.pointsText,
                    isTopThree && styles.topThreePoints,
                  ]}
                >
                  {user.score}
                </Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tableHeader: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: -12,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  tableRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  topThreeRow: {
    backgroundColor: "#fff",
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
    paddingLeft: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentUserRow: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  positionHeader: {
    width: 60,
    alignItems: "center",
  },
  positionContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  positionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  medal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  medal1: {
    backgroundColor: "#ffd700",
  },
  medal2: {
    backgroundColor: "#c0c0c0",
  },
  medal3: {
    backgroundColor: "#cd7f32",
  },
  medalText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  usernameHeader: {
    flex: 1,
  },
  usernameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  pointsHeader: {
    width: 80,
    alignItems: "flex-end",
  },
  pointsContainer: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6366f1",
  },
  topThreePoints: {
    fontSize: 20,
    color: "#6366f1",
  },
  pointsLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  bottomSpacing: {
    height: 20,
  },
});
