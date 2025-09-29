import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import CreatePrediction from "./CreatePrediction";
import { OnboardingScreenProps } from "../../../types/routes";
import { getRanking } from "../../../actions/rankings";
import { Loading } from "../../common/Loading";

const { width, height } = Dimensions.get("window");

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
        <View style={styles.backgroundContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../../assets/leaguelock.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>Welcome, {username}!</Text>

                <Text style={styles.heading}>
                  Build your Premier League season predictions.
                </Text>

                <Text style={styles.paragraph}>
                  To get started, create your full prediction for the 2025/2026
                  Premier League final standings.{"\n\n"}
                  Your accuracy will determine your ranking throughout the
                  season!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => setOnboardingPage((prev) => prev + 1)}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  } else if (onboardingPage === 1) {
    return <CreatePrediction navigation={navigation} route={route} />;
  } else {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#6366f1",
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#6366f1",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.2,
    margin: -35,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
    lineHeight: 28,
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  getStartedButton: {
    backgroundColor: "#6366f1",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: width * 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6366f1",
  },
  errorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
