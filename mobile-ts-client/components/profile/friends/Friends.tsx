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
    return <></>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Content */}
      {!friends || friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-add-outline" size={36} color="#9ca3af" />
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
    padding: 12,
    backgroundColor: "#f8fafc",
    minHeight: "100%",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 10,
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: "center",
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
  friendsList: {
    gap: 8,
  },
  friendCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  expandButtonText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
});
