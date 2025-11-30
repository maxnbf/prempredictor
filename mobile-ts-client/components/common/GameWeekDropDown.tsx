import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface GameweekDropdownProps {
  currentGameWeek: string;
  selectedGameWeek: string;
  onSelect: (value: string) => void; // parent receives the selected gameweek
}

export const GameweekDropdown: React.FC<GameweekDropdownProps> = ({
  currentGameWeek,
  selectedGameWeek,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Array.from({ length: parseInt(currentGameWeek) }, (_, index) => ({
      label: `Gameweek ${index + 1}`,
      value: (index + 1).toString(),
    }))
  );

  const [value, setValue] = useState<string>(
    selectedGameWeek 
  );

  useEffect(() => {
    onSelect(value); // propagate initial value
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Gameweek</Text>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 1001,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1e293b",
  },
  dropdownContainer: {
    height: 44,
    width: "100%",
    marginVertical: 6,
    zIndex: 1000,
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
});
