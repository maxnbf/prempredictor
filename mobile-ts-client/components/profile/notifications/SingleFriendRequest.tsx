import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FriendRequest, FriendRequestType } from "../../../types/types";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../../actions/friends";
import { HomeScreenProps, ProfileScreenProps } from "../../../types/routes";

interface SingleFriendRequestProps {
  friendRequest: FriendRequest;
}

export const SingleFriendRequest = ({
  friendRequest,
}: SingleFriendRequestProps) => {
  const navigation = useNavigation<HomeScreenProps>();
  const [requestStatus, setRequestStatus] = useState<FriendRequestType>(
    FriendRequestType.REQUEST
  );

  const goToProfile = () => {
    navigation.navigate("Home", {
      username: friendRequest.from,
      gameweek: undefined,
    });
  };

  const acceptNotifFriendRequest = async () => {
    await acceptFriendRequest(friendRequest.from);
    setRequestStatus(FriendRequestType.ACCEPTED);
  };

  const rejectNotifFriendRequest = async () => {
    await rejectFriendRequest(friendRequest.from);
    setRequestStatus(FriendRequestType.REJECTED);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToProfile} style={styles.left}>
        <Avatar.Text
          label={friendRequest.from[0].toUpperCase()}
          size={40}
          style={{ marginRight: 10 }}
        />
        <View>
          <Text variant="bodyLarge">{friendRequest.from}</Text>
          <Text variant="bodySmall" style={styles.timestamp}>
            {new Date(friendRequest.createdAt).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.right}>
        {requestStatus === FriendRequestType.REQUEST ? (
          <>
            <Button
              mode="outlined"
              onPress={acceptNotifFriendRequest}
              style={styles.button}
            >
              Accept
            </Button>
            <Button
              mode="outlined"
              textColor="red"
              onPress={rejectNotifFriendRequest}
              style={styles.button}
            >
              Reject
            </Button>
          </>
        ) : (
          <Text>{requestStatus}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  button: {
    marginLeft: 5,
  },
  timestamp: {
    color: "#666",
  },
});
