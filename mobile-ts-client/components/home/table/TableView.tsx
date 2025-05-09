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
      <View style={styles.selectContainer}>
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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MyTable liveTable={live} myTable={myTable} otherTable={otherTable} />
        <TimeSeriesPointsGraph username={otherTable?.username} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  selectContainer: {
    padding: 16,
    zIndex: 1000,
  },
  selectLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 10,
  },
  dropdown: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  dropDownStyle: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  dropdownContainer: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    zIndex: 1000, // Important for DropDownPicker stacking
  },
});
