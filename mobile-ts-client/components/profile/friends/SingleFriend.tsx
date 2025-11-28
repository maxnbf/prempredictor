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
        <Text variant="bodyLarge" style={styles.fullName}>
          {friend.user.fullName}
        </Text>
        <Text variant="bodyMedium" style={styles.username}>
          @{friend.user.username}
        </Text>
      </View>
      <View>
        {isFriend ? (
          <Button mode="outlined" compact onPress={removeFriend} style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
            Remove Friend
          </Button>
        ) : isRequest ? (
          <Button mode="outlined" compact disabled style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
            Requested
          </Button>
        ) : (
          <Button mode="outlined" compact onPress={addFriend} style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
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
    paddingVertical: 6,
  },
  avatarContainer: {
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
  },
  fullName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  username: {
    fontSize: 12,
    color: "#64748b",
  },
  button: {
    minWidth: 0,
    height: 32,
    margin: 0,
  },
  buttonContent: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    height: 32,
  },
  buttonLabel: {
    fontSize: 12,
    marginVertical: 0,
  },
});
