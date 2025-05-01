import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
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
        <Text style={styles.topBannerTitle}>Prem Predictor</Text>

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
        <View style={styles.topSection}>
          <Avatar.Text
            label={profile.username.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.fullName}>{profile.fullName}</Text>
            <Text style={styles.username}>@{profile.username}</Text>
          </View>
          <TouchableOpacity
            style={styles.friendsCountContainer}
            onPress={() => navigation.navigate("Friends")}
          >
            <Text style={styles.friendsCount}>{profile.friendCount}</Text>
            <Text style={styles.friendsLabel}>Friends</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Your Info</Text>

        <View style={styles.detailsSection}>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Favorite Team: </Text>
            {profile.favoriteTeam}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Joined: </Text>
            {profile.joined.toString().substring(0, 10)}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Score: </Text>
            {profile.total}
          </Text>
        </View>

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
