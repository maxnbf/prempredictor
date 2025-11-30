import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { Fixture, Prediction, PredictionInput } from "../../types/types";
import { getFixtures, submitPredictions } from "../../actions/fantasy";

interface FantasyPredictionProps {
  isWeekComplete: boolean;
  gameWeek: number;
  selectedGameWeek: number;
}

export const FantasyPredictions: React.FC<FantasyPredictionProps> = ({
  isWeekComplete,
  gameWeek,
  selectedGameWeek,
}) => {
  const [fixtures, setFixtures] = useState<Fixture[]>();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [submittingPredictions, setSubmittingPredictions] = useState(false);

  const logos = useSelector((state: any) => state.logos.logos);

  const fetchData = async () => {
    const fixturesResponse = await getFixtures(selectedGameWeek);
    setFixtures(fixturesResponse.fixtures);
    setPredictions(fixturesResponse.predictions);
  };

  useEffect(() => {
    fetchData();
  }, [selectedGameWeek]);

  const updatePrediction = (
    fixtureId: string,
    field: "homeScore" | "awayScore",
    value: string
  ) => {
    if (value !== "" && isNaN(parseInt(value))) return;

    const score = value === "" ? undefined : parseInt(value);

    setPredictions((prev) => {
      const existing = prev.find((p) => p.fixture._id === fixtureId);

      if (existing) {
        return prev.map((p) =>
          p.fixture._id === fixtureId ? { ...p, [field]: score } : p
        ) as Prediction[];
      } else {
        return [
          ...prev,
          {
            fixture: fixtures?.find((fx) => fx._id === fixtureId),
            homeScore: field === "homeScore" ? score : 0,
            awayScore: field === "awayScore" ? score : 0,
          },
        ] as Prediction[];
      }
    });
  };

  const handleSubmitPredictions = async () => {
    setSubmittingPredictions(true);

    const payload = predictions.map((p) => ({
      fixture: p.fixture._id,
      homeScore: p.homeScore,
      awayScore: p.awayScore,
    })) as PredictionInput[];

    await submitPredictions(payload);
    setSubmittingPredictions(false);
  };

  if (fixtures?.length === 0) {
    return <></>;
  }

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>Fixtures</Text>

        {isWeekComplete ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              (submittingPredictions ||
                predictions.length !== fixtures?.length ||
                predictions.some(
                  (p) =>
                    p.homeScore === undefined || p.awayScore === undefined
                )) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitPredictions}
            disabled={
              submittingPredictions ||
              predictions.length !== fixtures?.length ||
              predictions.some(
                (p) => p.homeScore === undefined || p.awayScore === undefined
              )
            }
          >
            <Text style={styles.submitButtonText}>
              {submittingPredictions ? "Submitting..." : "Submit Predictions"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* FIXTURE CARDS */}
      {(fixtures ?? []).map((f) => {
        const prediction = predictions.find((p) => p.fixture._id === f._id);

        const homeLogo = logos?.[f.homeTeam];
        const awayLogo = logos?.[f.awayTeam];

        const userHome = prediction?.homeScore;
        const userAway = prediction?.awayScore;

        // Live / current score
        // TODO: add live (and ultimately final) scores to the model
        const liveHome = null;
        const liveAway = null;
        const matchInProgress = liveHome !== null && liveAway !== null && !isWeekComplete;

        return (
          <View key={f._id} style={styles.card}>
            {/* TEAMS + SCORES */}
            <View style={styles.rowContainer}>
              <Image source={{ uri: homeLogo }} style={styles.logo} />

              <View style={styles.centerContent}>
                {isWeekComplete ? (
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={userHome !== undefined ? String(userHome) : ""}
                      onChangeText={(v) =>
                        updatePrediction(f._id, "homeScore", v)
                      }
                      placeholder="0"
                    />
                    <Text style={styles.scoreDash}>-</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={userAway !== undefined ? String(userAway) : ""}
                      onChangeText={(v) =>
                        updatePrediction(f._id, "awayScore", v)
                      }
                      placeholder="0"
                    />
                  </View>
                ) : prediction ? (
                  <Text style={styles.lockedPrediction}>
                    {userHome !== undefined && userAway !== undefined
                      ? `${userHome} - ${userAway}`
                      : "No prediction"}
                  </Text>
                ) : (
                  <Text style={styles.lockedPrediction}>No prediction</Text>
                )}

                {matchInProgress ? (
                  <Text style={styles.liveScoreBelowPrediction}>
                    {liveHome} - {liveAway}
                  </Text>
                ) : (
                  <Text style={styles.date}>{f.dateTime}</Text>
                )}
              </View>

              <Image source={{ uri: awayLogo }} style={styles.logo} />
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  // Header row at the top with section title and submit button
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },

  // Card container for each fixture
  card: {
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  // Row for logos and central content
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertically center logos and central content
    justifyContent: "space-between",
  },

  // Center content between logos
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    minHeight: 60, // ensures consistent card height
  },

  // Team logos
  logo: {
    width: 48,
    height: 48, // keep logos square
    resizeMode: "contain",
    borderRadius: 6,
  },

  // Row for home/away input fields
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Input fields for prediction
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginHorizontal: 4,
  },

  // Dash between scores
  scoreDash: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },

  // Locked prediction text
  lockedPrediction: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    paddingVertical: 4,
  },

  // Live score text
  liveScoreBelowPrediction: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "center",
  },

  // Date text below prediction
  date: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },

  // Submit button
  submitButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  // Disabled state of submit button
  submitButtonDisabled: {
    backgroundColor: "#90caf9",
  },

  // Submit button text
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
