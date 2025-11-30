import { Button, StyleSheet, View } from "react-native";
import { calculateOffsets } from "../home/table/MyTable";
import { Text } from "react-native";
import { getTeamAbbreviation } from "../../utils/utils";
import { Image } from "react-native";

interface FantasyTableProps {
  liveRanking: string[];
  myRanking: string[];
  logos: Record<string, string>;
  isEditable: boolean;
  moveTeam: (index: number, direction: -1 | 1) => void;
}

const getOffsetStyle = (offset: number) => {
  const baseStyle = {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 22,
    textAlign: "center" as const,
  };

  if (offset > 0) {
    return { ...baseStyle, backgroundColor: "#4caf50", color: "white" };
  } else if (offset < 0) {
    return { ...baseStyle, backgroundColor: "#f44336", color: "white" };
  } else {
    return { ...baseStyle, backgroundColor: "#e0e0e0", color: "#666" };
  }
};

export const FantasyTable: React.FC<FantasyTableProps> = ({
  liveRanking,
  myRanking,
  logos,
  isEditable,
  moveTeam,
}) => {
  const { offsets, totalOffset } = calculateOffsets(liveRanking, myRanking);

  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={[styles.row, styles.tableHeader]}>
        <Text style={styles.pos}>#</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Live</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>My Fantasy</Text>
        {isEditable ? (
          <Text style={[styles.headerText, { flex: 1.5 }]}></Text>
        ) : null}
        <Text style={[styles.headerText, { flex: 1 }]}>Pts</Text>
      </View>

      {/* Table Rows */}
      {liveRanking.map((team, index) => {
        const offset = offsets[index] ?? 0;
        return (
          <View style={styles.row} key={index}>
            <Text style={styles.pos}>{index + 1}</Text>
            <View style={[styles.teamRow, { flex: 2 }]}>
              <Image source={{ uri: logos[team] }} style={styles.logo} />
              <Text style={styles.teamAbbreviation}>
                {getTeamAbbreviation(team)}
              </Text>
            </View>
            <View style={[styles.teamRow, { flex: 2 }]}>
              <Image
                source={{ uri: logos[myRanking[index]] }}
                style={styles.logo}
              />
              <Text style={styles.teamAbbreviation}>
                {getTeamAbbreviation(myRanking[index])}
              </Text>
            </View>
            {isEditable ? (
              <View
                style={[styles.teamRow, { flex: 1.5, flexDirection: "row" }]}
              >
                <Button
                  title="↑"
                  onPress={() => moveTeam(index, -1)}
                />
                <Button
                  title="↓"
                  onPress={() => moveTeam(index, 1)}

                />
              </View>
            ) : (
              <></>
            )}
            <Text
              style={{ ...getOffsetStyle(offset), ...styles.offset, flex: 1 }}
            >
              {Math.abs(offset)}
            </Text>
          </View>
        );
      })}

      {/* Table Footer */}
      <View style={[styles.row, styles.footerRow]}>
        <Text style={styles.pos}></Text>
        <Text style={[styles.footerText, { flex: 2 }]}>Total Points</Text>
        <Text style={[styles.footerText, { flex: 2 }]}></Text>
        <Text style={[styles.footerText, { flex: 1 }]}>{totalOffset}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  table: { borderTopWidth: 1, borderTopColor: "#f1f5f9", marginBottom: 200 },
  tableHeader: {
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  pos: { fontSize: 14, width: 36, fontWeight: "500", color: "#64748b" },
  headerText: {
    fontWeight: "600",
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  teamRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 26, height: 26, marginRight: 6, borderRadius: 4 },
  teamAbbreviation: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1e293b",
    marginLeft: 6,
  },
  offset: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  footerRow: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },


});
