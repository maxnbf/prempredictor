import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import CreatePrediction from "./CreatePrediction";
import { OnboardingScreenProps } from "../../../types/routes";
import { getRanking } from "../../../actions/rankings";
import { Loading } from "../../common/Loading";

export const NewUserOnboarding: React.FC<OnboardingScreenProps> = ({
  navigation,
  route,
}) => {
  const username = useSelector((state: any) => state.auth.user_info.username);
  const [onboardingPage, setOnboardingPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkNewUser = async () => {
      const ranking = await getRanking(username);
      if (ranking?.ranking) {
        navigation.navigate("Main", {
          screen: "Home",
          params: { username: undefined, gameweek: undefined },
        });
      } else {
        setIsLoading(false);
      }
    };

    checkNewUser();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (onboardingPage === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.scrollContainer}>
          <Image
            source={require("../../../assets/leaguelock.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcomeText}>Welcome, {username}!</Text>

          <Text style={styles.heading}>
            Build your Premier League season predictions.
          </Text>

          <Text style={styles.paragraph}>
            To get started, create your full prediction for the 2024/2025
            Premier League final standings.{"\n\n"}
            Your accuracy will determine your ranking throughout the season!
          </Text>

          <Button
            title="Get Started"
            onPress={() => setOnboardingPage((prev) => prev + 1)}
          />
        </View>
      </SafeAreaView>
    );
  } else if (onboardingPage === 1) {
    return <CreatePrediction navigation={navigation} route={route} />;
  } else {
    return <Text>Something went wrong</Text>;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    marginBottom: "30%",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#222222",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    color: "#444444",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666666",
    lineHeight: 22,
  },
});
