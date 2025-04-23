import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { LiveRanking, UserRanking } from "../../../types/types";
import { FriendButton } from "./FriendButton";
import { Loading } from "../../common/Loading";
import { getTeamAbbreviation, timeAgo } from "../../../utils/utils";

interface RankingTableProps {
  liveTable: LiveRanking;
  myTable: UserRanking;
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

export const MyTable: React.FC<RankingTableProps> = ({
  liveTable,
  myTable,
  otherTable,
}) => {
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);
  const [otherScore, setOtherScore] = useState<MyScore | undefined>(undefined);

  useEffect(() => {
    if (liveTable && myTable) {
      setMyScore(calculateOffsets(liveTable.ranking, myTable.ranking));
    }
    if (liveTable && otherTable) {
      setOtherScore(calculateOffsets(liveTable.ranking, otherTable.ranking));
    }
  }, [liveTable, myTable, otherTable]);

  const getOffsetStyle = (offset: number) => {
    if (offset > 0) return { color: "green" };
    if (offset < 0) return { color: "red" };
    return { color: "black" };
  };

  if (!liveTable || !myTable) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          @{otherTable ? otherTable.username : myTable.username}{" "}
          {liveTable.season} Predictions
        </Text>
        {otherTable && (
          <FriendButton
            activeUser={myTable.username}
            otherUsername={otherTable.username}
          />
        )}
      </View>

      <Text style={styles.subtitle}>
        Last Updated {timeAgo(liveTable.lastUpdated)}
      </Text>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.pos}>#</Text>
          <Text style={[styles.headerText, { flex: 2 }]}>Live</Text>
          {otherTable && (
            <Text style={[styles.headerText, { flex: 2 }]}>
              @{otherTable.username}
            </Text>
          )}
          {otherTable && (
            <Text style={[styles.headerText, { flex: 1 }]}>Pts</Text>
          )}
          <Text style={[styles.headerText, { flex: 2 }]}>
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

              <View style={[styles.teamRow, { flex: 2 }]}>
                <Image
                  source={{ uri: liveTable.logoUrls[index] }}
                  style={styles.logo}
                />
                <Text>{getTeamAbbreviation(liveTable.ranking[index])}</Text>
              </View>

              {otherTable && (
                <>
                  <View style={[styles.teamRow, { flex: 2 }]}>
                    <Image
                      source={{
                        uri: liveTable.logoUrls[
                          liveTable.ranking.indexOf(otherTable.ranking[index])
                        ],
                      }}
                      style={styles.logo}
                    />
                    <Text>
                      {getTeamAbbreviation(otherTable.ranking[index])}
                    </Text>
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

              <View style={[styles.teamRow, { flex: 2 }]}>
                <Image
                  source={{
                    uri: liveTable.logoUrls[
                      liveTable.ranking.indexOf(myTable.ranking[index])
                    ],
                  }}
                  style={styles.logo}
                />
                <Text>{getTeamAbbreviation(myTable.ranking[index])}</Text>
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
  footerRow: {
    paddingTop: 8,
  },
  container: {
    padding: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  table: {
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    backgroundColor: "#eee",
    paddingVertical: 6,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  pos: {
    fontSize: 16,
    width: 40,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  offset: {
    fontSize: 24,
    marginLeft: 8,
    textAlign: "left",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    display: "flex",
    textAlign: "left",
  },
});
