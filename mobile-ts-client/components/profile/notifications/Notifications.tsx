import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  NotificationsResponse,
  getNotifs,
} from "../../../actions/notifications";
import { getAllFriendRequests } from "../../../actions/friends";
import { FriendRequest } from "../../../types/types";
import { SingleNotification } from "./SingleNotification";
import { SingleFriendRequest } from "./SingleFriendRequest";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "../../common/Loading";
export const Notifications = () => {
  const [notifsData, setNotifsData] = useState<
    NotificationsResponse | undefined
  >(undefined);
  const [friendRequests, setFriendRequests] = useState<
    FriendRequest[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showAllOthers, setShowAllOthers] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const notifs = await getNotifs();
    const requests = await getAllFriendRequests();
    setNotifsData(notifs);
    setFriendRequests(requests);
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

  if (isLoading || !notifsData) {
    return <></>;
  }

  const { notifs, newNotifs } = notifsData;

  return (
    <View>
      {/* Header with notification count */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Ionicons name="notifications-outline" size={20} color="#6366f1" />
          <Text style={styles.sectionTitle}>Notifications</Text>
          {newNotifs > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{newNotifs}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Friend Requests Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people-outline" size={18} color="#E91E63" />
          <Text style={styles.subTitle}>Friend Requests</Text>
        </View>
        {!friendRequests || friendRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="person-add-outline" size={28} color="#9ca3af" />
            <Text style={styles.emptyText}>No friend requests</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {(showAllFriends ? friendRequests : friendRequests.slice(0, 3)).map(
              (friendRequest, index) => (
                <SingleFriendRequest
                  key={index}
                  friendRequest={friendRequest}
                />
              )
            )}
            {friendRequests.length > 3 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setShowAllFriends(!showAllFriends)}
              >
                <Text style={styles.expandButtonText}>
                  {showAllFriends
                    ? "Show less"
                    : `Show ${friendRequests.length - 3} more`}
                </Text>
                <Ionicons
                  name={showAllFriends ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#6366f1"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Other Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#2196F3"
            />
          <Text style={styles.subTitle}>Other Notifications</Text>
        </View>
        {notifs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={28}
              color="#9ca3af"
            />
            <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {(showAllOthers ? notifs : notifs.slice(0, 3)).map(
              (notif, index) => (
                <SingleNotification key={index} notif={notif} />
              )
            )}
            {notifs.length > 3 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setShowAllOthers(!showAllOthers)}
              >
                <Text style={styles.expandButtonText}>
                  {showAllOthers
                    ? "Show less"
                    : `Show ${notifs.length - 3} more`}
                </Text>
                <Ionicons
                  name={showAllOthers ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#6366f1"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  contentContainer: {
    gap: 6,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginTop: 6,
  },
  expandButtonText: {
    color: "#6366f1",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
});
