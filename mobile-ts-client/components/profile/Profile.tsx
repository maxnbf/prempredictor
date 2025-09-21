import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Menu } from "react-native-paper";
import { ProfileScreenProps } from "../../types/routes";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Notifications } from "./notifications/Notifications";
import { logoutUser } from "../../navigation/navigation";
import { deleteAccount, getProfile } from "../../actions/user";
import { Profile } from "../../types/types";
import { Loading } from "../common/Loading";

export const ProfileView = () => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  const fetchData = async () => {
    const response: Profile = await getProfile();
    setProfile(response);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const navigation = useNavigation<ProfileScreenProps>();

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            handleLogout();
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    closeMenu();
    navigation.navigate("PrivacyPolicy");
  };

  if (profile === undefined) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBanner}>
        <View style={styles.iconPlaceholder} />
        <Text style={styles.topBannerTitle}>League Lock</Text>

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={handleLogout} title="Logout" />
          <Menu.Item onPress={handleDeleteAccount} title="Delete Account" />
          <Menu.Item onPress={handlePrivacyPolicy} title="Privacy Policy" />
        </Menu>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Enhanced Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Avatar.Text
                label={profile.username.charAt(0).toUpperCase()}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>{profile.fullName}</Text>
              <Text style={styles.username}>@{profile.username}</Text>
              <View style={styles.scoreContainer}>
                <Ionicons name="trophy-outline" size={16} color="#FFD700" />
                <Text style={styles.scoreText}>{profile.total} points</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.friendsButton}
              onPress={() => navigation.navigate("Friends")}
            >
              <Text style={styles.friendsCount}>{profile.friendCount}</Text>
              <View style={styles.friendsLabelContainer}>
                <Text style={styles.friendsLabel}>Friends</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={24} color="#E91E63" />
            <Text style={styles.statValue}>{profile.favoriteTeam}</Text>
            <Text style={styles.statLabel}>Favorite Team</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#2196F3" />
            <Text style={styles.statValue}>
              {profile.joined.toString().substring(0, 10)}
            </Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsCard}>
          <Notifications />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
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
    color: "#333",
  },
  iconPlaceholder: {
    width: 24,
  },
  // Enhanced Profile Card Styles
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
  },
  avatarLabel: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginLeft: 4,
  },
  friendsButton: {
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  friendsCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  friendsLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  // Stats Grid Styles
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  // Notifications Card Styles
  notificationsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  friendsLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
