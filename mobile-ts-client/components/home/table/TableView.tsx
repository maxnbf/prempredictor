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
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Array.from({ length: parseInt(currentGameWeek) }, (_, index) => ({
      label: `Gameweek ${index + 1}`,
      value: (index + 1).toString(),
    }))
  );
  const [selectedGameweekState, setSelectedGameweekState] = useState<string>(
    selectedGameWeek ?? live?.currentRound.toString() ?? "1"
  );

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
    return <Loading />;
  }

  return (
    <>
      {/* Header Section with Controls */}
      <View style={styles.headerSection}>
        <View style={styles.controlsContainer}>
          <Text style={styles.selectLabel}>Select Gameweek</Text>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={selectedGameweekState}
            setValue={setSelectedGameweekState}
            items={items}
            setItems={setItems}
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownStyle}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
            autoScroll={true}
            placeholder="Select Gameweek"
            multiple={false}
            zIndex={1000}
          />
        </View>
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
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 2000,
  },
  headerContent: {
    padding: 20,
    paddingBottom: 16,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    zIndex: 1001,
  },
  selectContainer: {
    padding: 16,
    zIndex: 1001,
  },
  selectLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 10,
  },
  dropdown: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropDownStyle: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownContainer: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    zIndex: 1000,
  },
  tableSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 96,
  },
  chartHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});
