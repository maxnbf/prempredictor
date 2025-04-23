import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import {
  NotificationsResponse,
  getNotifs,
} from "../../../actions/notifications";
import { getAllFriendRequests } from "../../../actions/friends";
import { FriendRequest } from "../../../types/types";
import { SingleNotification } from "./SingleNotification";
import { SingleFriendRequest } from "./SingleFriendRequest";
import { useFocusEffect } from "@react-navigation/native";
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
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const { notifs, newNotifs } = notifsData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Notifications ({newNotifs} new)
      </Text>

      <Text variant="titleSmall" style={styles.subTitle}>
        Friend Requests
      </Text>
      {!friendRequests || friendRequests.length === 0 ? (
        <Text style={styles.emptyText}>Nothing to see at this time.</Text>
      ) : (
        <>
          {(showAllFriends ? friendRequests : friendRequests.slice(0, 3)).map(
            (friendRequest, index) => (
              <SingleFriendRequest key={index} friendRequest={friendRequest} />
            )
          )}
          {friendRequests.length > 3 && (
            <Button onPress={() => setShowAllFriends(!showAllFriends)}>
              {showAllFriends ? "See less" : "See more"}
            </Button>
          )}
        </>
      )}

      <Divider style={{ marginVertical: 16 }} />

      <Text variant="titleSmall" style={styles.subTitle}>
        Other Notifications
      </Text>
      {notifs.length === 0 ? (
        <Text style={styles.emptyText}>Nothing to see at this time.</Text>
      ) : (
        <>
          {(showAllOthers ? notifs : notifs.slice(0, 3)).map((notif, index) => (
            <SingleNotification key={index} notif={notif} />
          ))}
          {notifs.length > 3 && (
            <Button onPress={() => setShowAllOthers(!showAllOthers)}>
              {showAllOthers ? "See less" : "See more"}
            </Button>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "bold",
  },
  subTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  emptyText: {
    color: "#666",
    marginBottom: 8,
  },
});
