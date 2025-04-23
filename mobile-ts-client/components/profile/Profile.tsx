import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { GetUserMetadataResponse, getUserMetadata } from "../../actions/user";
import { navigateToLogin } from "../../navigation/navigation";
import { Friends } from "./friends/Friends";
import { Notifications } from "./notifications/Notifications";

const Profile: React.FC = () => {
  const [userMetadata, setUserMetadata] = useState<
    GetUserMetadataResponse | undefined
  >(undefined);

  const username = useSelector((state: any) => state.auth.user_info.username);

  const logout = () => {
    navigateToLogin();
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserMetadata();
      setUserMetadata(response);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {/* Banner */}
        <View style={styles.banner}>
          {/* <Avatar size={80} rounded title={username.charAt(0)} /> */}
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.bio}>{"fake bio"}</Text>
          </View>
          <Button title="Logout" onPress={logout} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.sectionTitle}>Profile Info</Text>
          <Text>
            <Text style={styles.boldText}>Favorite Team: </Text>
            {userMetadata?.favoriteTeam}
          </Text>
          <Text>
            <Text style={styles.boldText}>Season Score: </Text>
            {"50"}
          </Text>
        </View>

        {/* Friends */}
        <View style={styles.friendsSection}>
          <Friends />
        </View>

        {/* Notifications */}
        <View style={styles.notificationsSection}>
          <Notifications />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bio: {
    color: "#888",
  },
  profileInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  friendsSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
  },
  notificationsSection: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
  },
});

export default Profile;
