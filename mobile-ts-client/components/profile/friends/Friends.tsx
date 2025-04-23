import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { getFriends } from "../../../actions/friends";
import { Friend } from "../../../types/types";
import { SingleFriend } from "./SingleFriend";
import { useFocusEffect } from "@react-navigation/native";

export const Friends = () => {
  const [friends, setFriends] = useState<Friend[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllFriends, setShowAllFriends] = useState(false);

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
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Friends ({friends?.length ?? 0})
      </Text>

      {!friends || friends.length === 0 ? (
        <Text style={{ color: "gray" }}>Nothing to see at this time.</Text>
      ) : (
        <View>
          {(showAllFriends ? friends : friends.slice(0, 3)).map((friend) => (
            <SingleFriend key={friend.user.username} friend={friend} />
          ))}
          {friends.length > 3 && (
            <Button onPress={() => setShowAllFriends(!showAllFriends)}>
              {showAllFriends ? "See less" : "See more"}
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};
