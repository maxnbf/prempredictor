import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { LiveRanking, UserRanking } from "../../../types/types";
import { FriendButton } from "./FriendButton";
import { Loading } from "../../common/Loading";
import { getTeamAbbreviation, timeAgo } from "../../../utils/utils";
import { useSelector } from "react-redux";

interface RankingTableProps {
  liveTable: LiveRanking;
  myTable: UserRanking | undefined;
  otherTable: UserRanking | undefined;
}

interface MyScore {
  offsets: number[];
  totalOffset: number;
}

const calculateOffsets = (live: string[], user: string[]): MyScore => {
  const offsets = [];
  let totalOffset = 0;

  for (let i = 0; i < 20; i++) {
    const livePos = live.indexOf(user[i]);
    const offset = livePos - i;
    offsets.push(offset);
    totalOffset += Math.abs(offset);
  }

  return { offsets, totalOffset };
};

const getOffsetStyle = (offset: number) => {
  const baseStyle = {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    textAlign: "center" as const,
  };

  if (offset > 0) {
    return {
      ...baseStyle,
      backgroundColor: "#4caf50",
      color: "white",
    };
  } else if (offset < 0) {
    return {
      ...baseStyle,
      backgroundColor: "#f44336",
      color: "white",
    };
  } else {
    return {
      ...baseStyle,
      backgroundColor: "#e0e0e0",
      color: "#666",
    };
  }
};

export const MyTable: React.FC<RankingTableProps> = ({
  liveTable,
  myTable,
  otherTable,
}) => {
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);
  const [otherScore, setOtherScore] = useState<MyScore | undefined>(undefined);

  const logos = useSelector((state: any) => state.logos.logos);
  useEffect(() => {
    if (liveTable && myTable) {
      setMyScore(calculateOffsets(liveTable.ranking, myTable.ranking));
    }
    if (liveTable && otherTable) {
      setOtherScore(calculateOffsets(liveTable.ranking, otherTable.ranking));
    }
  }, [liveTable, myTable, otherTable]);

  if (!liveTable || !myTable) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              @{otherTable ? otherTable.username : myTable.username}
            </Text>
            <Text style={styles.subtitle}>
              updated {timeAgo(liveTable.lastUpdated)}
            </Text>
          </View>
          {otherTable && (
            <View style={styles.friendButtonContainer}>
              <FriendButton
                activeUser={myTable.username}
                otherUsername={otherTable.username}
              />
            </View>
          )}
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Your Points</Text>
            <Text style={[styles.statValue, { color: "#1976d2" }]}>
              {myScore?.totalOffset}
            </Text>
          </View>
          {otherTable && otherScore && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {otherTable.username}'s Points
              </Text>
              <Text style={[styles.statValue, { color: "#9c27b0" }]}>
                {otherScore.totalOffset}
              </Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gameweek</Text>
            <Text style={styles.statValue}>{liveTable.currentRound}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.pos}>#</Text>
          <Text style={[styles.headerText, { flex: 2 }]}>Live</Text>
          {otherTable && (
            <Text
              numberOfLines={1}
              style={[styles.headerText, styles.usernameHeader, { flex: 2 }]}
            >
              @{otherTable.username}
            </Text>
          )}
          {otherTable && (
            <Text style={[styles.headerText, { flex: 1 }]}>Pts</Text>
          )}
          <Text
            numberOfLines={1}
            style={[styles.headerText, styles.usernameHeader, { flex: 2 }]}
          >
            @{myTable.username}
          </Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Pts</Text>
        </View>

        {/* Table Rows */}
        {liveTable.ranking.map((team, index) => {
          const myOffset = myScore?.offsets[index] ?? 0;
          const otherOffset = otherScore?.offsets[index] ?? 0;

          return (
            <View style={styles.row} key={index}>
              <Text style={styles.pos}>{index + 1}</Text>

              <View
                style={[
                  styles.teamRow,
                  { flex: 2 },
                  otherTable && { flexDirection: undefined },
                ]}
              >
                <Image
                  source={{ uri: logos[liveTable.ranking[index]] }}
                  style={styles.logo}
                />
                {!otherTable && (
                  <Text>{getTeamAbbreviation(liveTable.ranking[index])}</Text>
                )}
              </View>

              {otherTable && (
                <>
                  <View
                    style={[
                      styles.teamRow,
                      { flex: 2 },
                      otherTable && { flexDirection: undefined },
                    ]}
                  >
                    <Image
                      source={{
                        uri: logos[otherTable.ranking[index]],
                      }}
                      style={styles.logo}
                    />
                  </View>
                  <Text
                    style={{
                      ...getOffsetStyle(otherOffset),
                      ...styles.offset,
                      flex: 1,
                    }}
                  >
                    {Math.abs(otherOffset)}
                  </Text>
                </>
              )}

              <View
                style={[
                  styles.teamRow,
                  { flex: 2 },
                  otherTable && { flexDirection: undefined },
                ]}
              >
                <Image
                  source={{
                    uri: logos[myTable.ranking[index]],
                  }}
                  style={styles.logo}
                />
                {!otherTable && (
                  <Text>{getTeamAbbreviation(myTable.ranking[index])}</Text>
                )}
              </View>
              <Text
                style={{
                  ...getOffsetStyle(myOffset),
                  ...styles.offset,
                  flex: 1,
                }}
              >
                {Math.abs(myOffset)}
              </Text>
            </View>
          );
        })}

        {/* Table Footer */}
        <View style={[styles.row, styles.footerRow]}>
          <Text style={styles.pos}> </Text>
          <Text style={[styles.footerText, { flex: 2 }]}>Total Points</Text>
          {otherTable && (
            <>
              <Text style={[styles.footerText, { flex: 2 }]}></Text>
              <Text style={[styles.footerText, { flex: 1 }]}>
                {otherScore?.totalOffset}
              </Text>
            </>
          )}
          <Text style={[styles.footerText, { flex: 2 }]}></Text>
          <Text style={[styles.footerText, { flex: 1 }]}>
            {myScore?.totalOffset}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    zIndex: -1,
  },
  friendButtonContainer: {
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  usernameHeader: {
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pos: {
    fontSize: 16,
    width: 40,
    fontWeight: "500",
    color: "#666",
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 4,
  },
  offset: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footerRow: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
});
