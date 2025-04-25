import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { sendFriendRequest, unfriendUser } from "../../../actions/friends";
import { Friend } from "../../../types/types";
import { HomeScreenProps, ProfileScreenProps } from "../../../types/routes";

interface SingleFriendProps {
  friend: Friend;
}

export const SingleFriend: React.FC<SingleFriendProps> = ({ friend }) => {
  const navigation = useNavigation<HomeScreenProps>();
  const [isFriend, setIsFriend] = useState(true);
  const [isRequest, setIsRequest] = useState(false);

  const goToProfile = () => {
    navigation.navigate("Home", {
      username: friend.user.username,
      gameweek: undefined,
    });
  };

  const removeFriend = async () => {
    await unfriendUser(friend.user.username);
    setIsFriend(false);
  };

  const addFriend = async () => {
    await sendFriendRequest(friend.user.username);
    setIsRequest(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={goToProfile}>
        <Avatar.Text label={friend.user.username[0].toUpperCase()} size={40} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text variant="bodyLarge">{friend.user.username}</Text>
      </View>
      <View>
        {isFriend ? (
          <Button mode="outlined" onPress={removeFriend}>
            Remove Friend
          </Button>
        ) : isRequest ? (
          <Button mode="outlined" disabled>
            Requested
          </Button>
        ) : (
          <Button mode="outlined" onPress={addFriend}>
            Add Friend
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
});
