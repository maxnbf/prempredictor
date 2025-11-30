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
  const [originalPredictions, setOriginalPredictions] = useState<Prediction[]>([]);
  const [submittingPredictions, setSubmittingPredictions] = useState(false);

  const logos = useSelector((state: any) => state.logos.logos);

  const fetchData = async () => {
    const fixturesResponse = await getFixtures(selectedGameWeek);

    setFixtures(fixturesResponse.fixtures);
    setPredictions(fixturesResponse.predictions);
    setOriginalPredictions(fixturesResponse.predictions); // ← store baseline copy
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

    const newPredictions = await submitPredictions(payload);

    // Update both current + original predictions
    setPredictions(newPredictions);
    setOriginalPredictions(newPredictions);

    setSubmittingPredictions(false);
  };

  if (fixtures?.length === 0) {
    return <></>;
  }

  // ----------------------------------------------------------
  // COMPUTE WHETHER THE BUTTON SHOULD BE ENABLED
  // ----------------------------------------------------------

  const allPredictionsFilled =
    predictions.length === fixtures?.length &&
    !predictions.some((p) => p.homeScore === undefined || p.awayScore === undefined);

  const predictionsChanged = (() => {
    if (predictions.length !== originalPredictions.length) return true;

    for (let p of predictions) {
      const orig = originalPredictions.find(
        (o) => o.fixture._id === p.fixture._id
      );
      if (!orig) return true;

      if (orig.homeScore !== p.homeScore || orig.awayScore !== p.awayScore) {
        return true;
      }
    }
    return false;
  })();

  const canSubmit =
    isWeekComplete &&
    !submittingPredictions &&
    allPredictionsFilled &&
    predictionsChanged;

  // ----------------------------------------------------------

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>Fixtures</Text>

        {isWeekComplete && gameWeek === selectedGameWeek ? (
          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleSubmitPredictions}
            disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>
              {submittingPredictions ? "Submitting..." : "Submit Predictions"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {(fixtures ?? []).map((f) => {
        const prediction = predictions.find((p) => p.fixture._id === f._id);

        const homeLogo = logos?.[f.homeTeam];
        const awayLogo = logos?.[f.awayTeam];

        const userHome = prediction?.homeScore;
        const userAway = prediction?.awayScore;

        // Placeholder until live data is implemented
        const liveHome = f.homeScore;
        const liveAway = f.awayScore;
        const matchInProgress = liveHome !== undefined && liveAway !== undefined

        return (
          <View key={f._id} style={styles.card}>
            <View style={styles.rowContainer}>
              <Image source={{ uri: homeLogo }} style={styles.logo} />

              <View style={styles.centerContent}>
                {isWeekComplete && gameWeek === selectedGameWeek ? (
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
  card: {
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    minHeight: 60,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    borderRadius: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  scoreDash: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  lockedPrediction: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    paddingVertical: 4,
  },
  liveScoreBelowPrediction: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "center",
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#90caf9",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
