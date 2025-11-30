import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MyTable } from "./MyTable";
import { TimeSeriesPointsGraph } from "./TimeSeriesPoints";
import { getLiveRankingForGameWeek } from "../../../actions/rankings";
import { LiveRanking, UserRanking } from "../../../types/types";
import DropDownPicker from "react-native-dropdown-picker";
import { Loading } from "../../common/Loading";
import { useSelector } from "react-redux";
import { GameweekDropdown } from "../../common/GameWeekDropDown";

interface TableViewProps {
  setLive: React.Dispatch<React.SetStateAction<LiveRanking | undefined>>;
  live: LiveRanking | undefined;
  myTable: UserRanking | undefined;
  otherTable: UserRanking | undefined;
  currentGameWeek: string;
  selectedGameWeek: string | undefined;
}

export const TableView = ({
  setLive,
  live,
  myTable,
  otherTable,
  currentGameWeek,
  selectedGameWeek,
}: TableViewProps) => {
  const [selectedGameweekState, setSelectedGameweekState] = useState<string>(
    selectedGameWeek ?? live?.currentRound.toString() ?? currentGameWeek
  );

  console.log(selectedGameWeek, currentGameWeek, live?.currentRound)
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const liveRanking = await getLiveRankingForGameWeek(selectedGameweekState);
    setLive(liveRanking);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (selectedGameweekState) {
      fetchData();
    }
  }, [selectedGameweekState, setLive]);

  if (!live) {
    return <></>;
  }

  return (
    <>
      {/* Header Section with Controls */}
      <View style={styles.headerSection}>
      <GameweekDropdown
        currentGameWeek={currentGameWeek}
        selectedGameWeek={selectedGameweekState}
        onSelect={(gameweek) => setSelectedGameweekState(gameweek)}
      />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Table Section */}
        <View style={styles.tableSection}>
          <MyTable liveTable={live} myTable={myTable} otherTable={otherTable} />
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Total Points Over Time</Text>
            <View style={styles.divider} />
          </View>
          <TimeSeriesPointsGraph username={otherTable?.username} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  headerSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    zIndex: 2000,
  },
  headerContent: {
    padding: 16,
    paddingBottom: 12,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1976d2",
    marginBottom: 6,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 1001,
  },
  selectContainer: {
    padding: 12,
    zIndex: 1001,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1e293b",
  },
  picker: {
    height: 44,
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 8,
  },
  dropdown: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dropDownStyle: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dropdownContainer: {
    height: 44,
    width: "100%",
    marginVertical: 6,
    zIndex: 1000,
  },
  tableSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: 96,
  },
  chartHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
});
