import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Notification } from "../../../types/types";
import { HomeScreenProps, ProfileScreenProps } from "../../../types/routes";

interface NotificationProps {
  notif: Notification;
}

export const SingleNotification = ({ notif }: NotificationProps) => {
  const navigation = useNavigation<HomeScreenProps>();

  const goToProfile = () => {
    navigation.navigate("Home", { username: notif.from, gameweek: undefined });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToProfile} style={styles.left}>
        <Avatar.Text
          label={notif.from[0].toUpperCase()}
          size={40}
          style={styles.avatar}
        />
        <View>
          <Text variant="bodyLarge">{notif.from}</Text>
          <Text variant="bodySmall" style={styles.timestamp}>
            {new Date(notif.createdAt).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
      <Text variant="bodyMedium" style={styles.meta}>
        {notif.metadata}
      </Text>
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
  avatar: {
    marginRight: 12,
  },
  timestamp: {
    color: "#666",
  },
  meta: {
    marginLeft: 10,
  },
});
