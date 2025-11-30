import React, { useEffect, useState } from "react";
import { calculateOffsets } from "../home/table/MyTable";
import {
  getFantasyRanking,
  getUserPoints,
  submitFantasyRanking,
} from "../../actions/fantasy";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FantasyTable } from "./FantasyTable";
import { useSelector } from "react-redux";

export interface FantasyRankingProps {
  isWeekComplete: boolean;
  gameWeek: number;
  selectedGameWeek: number;
  liveRanking: string[];
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

export const FantasyRanking: React.FC<FantasyRankingProps> = ({
  isWeekComplete,
  gameWeek,
  selectedGameWeek,
  liveRanking,
}) => {
  const logos = useSelector((state: any) => state.logos.logos);

  const [myRanking, setMyRanking] = useState<string[]>([]);
  const [adjustedRanking, setAdjustedRanking] = useState<string[]>([]);
  const [myPoints, setMyPoints] = useState<number>(0);
  const [pointsUsed, setPointsUsed] = useState<number>(0);
  const [submittingRanking, setSubmittingRanking] = useState(false);

  const moveTeam = (index: number, direction: -1 | 1) => {
    const newRank = [...adjustedRanking];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newRank.length) return;

    const temp = newRank[index];
    newRank[index] = newRank[newIndex];
    newRank[newIndex] = temp;

    const { totalOffset } = calculateOffsets(newRank, myRanking);

    if (totalOffset / 2 > myPoints) {
      alert("No remaining points");
    } else {
      setAdjustedRanking(newRank);
      setPointsUsed(totalOffset / 2);
    }
  };

  const handleSubmitRanking = async () => {
    if (gameWeek === undefined) return;
    setSubmittingRanking(true);

    const newFantasyRanking = await submitFantasyRanking(
      adjustedRanking,
      pointsUsed,
      gameWeek
    );
    setMyRanking(newFantasyRanking.ranking);
    setMyPoints(newFantasyRanking.userPoints);
    setPointsUsed(0);
    setSubmittingRanking(false);
  };

  const handleResetRanking = () => {
    setAdjustedRanking(myRanking);
    setPointsUsed(0);
  };

  const fetchData = async () => {
    const rankingResponse = await getFantasyRanking(selectedGameWeek);
    setMyRanking(rankingResponse.ranking);
    setAdjustedRanking(rankingResponse.ranking);

    const points = await getUserPoints();
    setMyPoints(points);
    setPointsUsed(0);
  };

  useEffect(() => {
    fetchData();
  }, [selectedGameWeek]);

  // TODO, make the buttons and arrows only appear for this gameweek
  return (
    <>
      {/* HEADER */}
      <Text style={styles.title}>My Season Ranking</Text>

      {/* CONTROL BAR */}
      {isWeekComplete && selectedGameWeek === gameWeek ? (
        <View style={styles.controlBar}>
          <View style={styles.leftButtons}>
            {/* SUBMIT BUTTON FIRST */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (submittingRanking ||
                  arraysEqual(myRanking, adjustedRanking)) &&
                  styles.submitDisabled,
              ]}
              onPress={handleSubmitRanking}
              disabled={
                submittingRanking || arraysEqual(myRanking, adjustedRanking)
              }
            >
              <Text style={styles.submitText}>
                {submittingRanking ? "Updating..." : "Submit"}
              </Text>
            </TouchableOpacity>

            {/* RESET BUTTON — ONLY ACTIVE IF POINTS USED */}
            <TouchableOpacity
              style={[
                styles.resetButton,
                pointsUsed === 0 && styles.resetDisabled,
              ]}
              onPress={handleResetRanking}
              disabled={pointsUsed === 0}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* POINTS DISPLAY */}
          <Text style={styles.pointsText}>
            Points:{" "}
            <Text style={styles.pointsValue}>{myPoints - pointsUsed}</Text>
          </Text>
        </View>
      ) : null}

      {/* TABLE */}
      <FantasyTable
        liveRanking={liveRanking}
        myRanking={adjustedRanking}
        logos={logos}
        isEditable={isWeekComplete && selectedGameWeek === gameWeek}
        moveTeam={moveTeam}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1e293b",
  },

  /* CONTROL BAR */
  controlBar: {
    marginTop: 4,
    marginBottom: 12,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  /* SUBMIT BUTTON */
  submitButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  submitDisabled: {
    backgroundColor: "#90caf9",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  /* RESET BUTTON */
  resetButton: {
    backgroundColor: "#e11d48",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  resetDisabled: {
    backgroundColor: "#fda4af",
    opacity: 0.6,
  },
  resetText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  /* POINTS DISPLAY */
  pointsText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  pointsValue: {
    fontWeight: "700",
    color: "#1e293b",
  },
});
