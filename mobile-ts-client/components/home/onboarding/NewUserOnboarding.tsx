import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import CreatePrediction from "./CreatePrediction";

export const NewUserOnboarding: React.FC = () => {
  const username = useSelector((state: any) => state.auth.user_info.username);
  const [onboardingPage, setOnboardingPage] = useState(0);

  if (onboardingPage === 0) {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Hello, {username}!</Text>
          <Text style={styles.subtitle}>
            Welcome to Premier League Season Predictor.
          </Text>
          <Text style={styles.paragraph}>
            To complete your new account, you must create a prediction for the
            final standings of the 2024/2025 Premier League season.
          </Text>
          <Button
            title="Continue to Create Prediction"
            onPress={() => setOnboardingPage((prev) => prev + 1)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  } else if (onboardingPage === 1) {
    return <CreatePrediction />;
  } else {
    return <Text>Something went wrong</Text>;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});
