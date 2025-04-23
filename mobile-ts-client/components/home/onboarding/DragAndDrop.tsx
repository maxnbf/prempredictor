import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

type Props = {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function DraggableStringList({ items, setItems }: Props) {
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<string>) => {
      return (
        <View
          style={[
            styles.item,
            { backgroundColor: isActive ? "#e0e0e0" : "#ffffff" },
          ]}
          onTouchStart={drag}
        >
          <Text style={styles.text}>{item}</Text>
        </View>
      );
    },
    [] // Safe because we're not using external state/props here
  );

  return (
    <DraggableFlatList
      data={items}
      onDragEnd={({ data }) => setItems([...data])}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
  },
});
