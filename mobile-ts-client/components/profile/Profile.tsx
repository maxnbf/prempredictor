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
import { useSelector } from "react-redux";

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
  const logos = useSelector((state: any) => state.logos.logos);
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
    return <></>
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
              <Ionicons name="settings-outline" size={22} color="#1e293b" />
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
                <Ionicons name="trophy-outline" size={14} color="#FFD700" />
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
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Image
              source={{ uri: logos[profile.favoriteTeam] }}
              style={styles.logo}
            />
            <Text style={styles.statValue}>{profile.favoriteTeam}</Text>
            <Text style={styles.statLabel}>Favorite Team</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={20} color="#2196F3" />
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
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  topBanner: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  topBannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    color: "#1e293b",
  },
  iconPlaceholder: {
    width: 24,
  },
  // Enhanced Profile Card Styles
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366f1",
  },
  avatarLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 3,
  },
  username: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f59e0b",
    marginLeft: 4,
  },
  friendsButton: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 70,
  },
  friendsCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  friendsLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  // Stats Grid Styles
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 6,
    marginBottom: 3,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
  },
  // Notifications Card Styles
  notificationsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  friendsLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 22,
    height: 22,
  },
});
