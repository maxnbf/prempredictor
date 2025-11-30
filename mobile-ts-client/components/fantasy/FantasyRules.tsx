import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export const FantasyRules: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fantasy League Lock — Rules</Text>

      <Text style={styles.paragraph}>
        Welcome to <Text style={styles.bold}>Fantasy League Lock</Text>! ⚽🔥
      </Text>

      <Text style={styles.sectionTitle}>🎯 Weekly Predictions</Text>
      <Text style={styles.paragraph}>
        • Before each game week, you will be given{" "}
        <Text style={styles.bold}>three (3)</Text> randomly selected matches.
        {"\n"}• Predict the final score for each match.
      </Text>

      <Text style={styles.sectionTitle}>🏆 Scoring</Text>
      <Text style={styles.paragraph}>
        • <Text style={styles.bold}>Exact score correct</Text> → ⭐ +3 points
        {"\n"}• <Text style={styles.bold}>Correct result (winner/draw)</Text> →
        👍 +1 point
      </Text>

      <Text style={styles.sectionTitle}>📊 Using Your Points</Text>
      <Text style={styles.paragraph}>
        Before the next game week begins, you may spend your points to adjust
        your fantasy ranking table.{"\n\n"}•{" "}
        <Text style={styles.bold}>Each table move costs 1 point</Text> 🔄{"\n"}•
        Be strategic — points give you flexibility but are limited!
      </Text>

      <Text style={styles.sectionTitle}>⏳ Expiration</Text>
      <Text style={styles.paragraph}>
        All unused points <Text style={styles.bold}>expire</Text> at the start
        of the next game week. Use them wisely! 💡
      </Text>

      <Text style={styles.footer}>
        Good luck, and make your moves count! ⚔️
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#1e293b",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
});
