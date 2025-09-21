import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getFriends } from "../../../actions/friends";
import { Friend } from "../../../types/types";
import { SingleFriend } from "./SingleFriend";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "../../common/Loading";

export const Friends = () => {
  const [friends, setFriends] = useState<Friend[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const username = useSelector((state: any) => state.auth.user_info.username);

  const fetchData = async () => {
    setIsLoading(true);
    const friendsResponse = await getFriends(username);
    setFriends(friendsResponse);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Content */}
      {!friends || friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-add-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No friends yet</Text>
          <Text style={styles.emptySubtitle}>
            Start connecting with other players to see them here
          </Text>
        </View>
      ) : (
        <View style={styles.friendsList}>
          {friends.map((friend) => (
            <View key={friend.user.username} style={styles.friendCard}>
              <SingleFriend friend={friend} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    minHeight: "100%",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 12,
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: "center",
  },
  countText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  friendsList: {
    gap: 12,
  },
  friendCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandButtonText: {
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
