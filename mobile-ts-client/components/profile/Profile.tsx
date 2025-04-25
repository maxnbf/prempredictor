import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { ProfileScreenProps } from "../../types/routes";
import { useNavigation } from "@react-navigation/native";
import { Notifications } from "./notifications/Notifications";

const Profile = () => {
  // Example data — replace with real data
  const fullName = "John Doe";
  const username = "johndoe";
  const friendsCount = 42;
  const favoriteTeam = "Arsenal";
  const joinedDate = "Jan 1, 2024";
  const score = 1280;
  const notifications = [
    "Reminder: Update your picks!",
    "New friend request from @alex99",
  ];

  const navigation = useNavigation<ProfileScreenProps>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <View style={styles.iconPlaceholder} />
        <Text style={styles.topBannerTitle}>Prem Predictor</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Avatar.Text
            label={fullName.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.fullName}>{fullName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>
          <TouchableOpacity
            style={styles.friendsCountContainer}
            onPress={() => navigation.navigate("Friends")}
          >
            <Text style={styles.friendsCount}>{friendsCount}</Text>
            <Text style={styles.friendsLabel}>Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Label */}
        <Text style={styles.sectionLabel}>Your Info</Text>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Favorite Team: </Text>
            {favoriteTeam}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Joined: </Text>
            {joinedDate}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Score: </Text>
            {score}
          </Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsSection}>
          <Notifications />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  topBanner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  topBannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  iconPlaceholder: {
    width: 24,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    color: "gray",
  },
  friendsCountContainer: {
    alignItems: "center",
  },
  friendsCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  friendsLabel: {
    fontSize: 12,
    color: "gray",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailItem: {
    fontSize: 15,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: "500",
    color: "#333",
  },
  notificationsSection: {
    marginBottom: 16,
  },
  notification: {
    fontSize: 14,
    paddingVertical: 4,
    color: "#444",
  },
});

export default Profile;
