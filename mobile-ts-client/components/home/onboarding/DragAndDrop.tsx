import React, { memo, useState } from "react";
import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";
import { Item } from "./CreatePrediction";
import { DoubleTapView } from "./DoubleTapView";

type DragAndDropProps = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  favoriteTeam: string;
  setFavoriteTeam: React.Dispatch<React.SetStateAction<string>>;
};

const Card: React.FC<{
  item: Item;
  index: number;
  isFavorite: boolean;
  setFavoriteTeam: (team: string) => void;
}> = memo(({ item, index, isFavorite, setFavoriteTeam }) => {
  const drag = useReorderableDrag();

  return (
    <DoubleTapView onDoubleTap={() => setFavoriteTeam(item.team)}>
      <View
        style={[styles.row, isFavorite && { backgroundColor: "gold" }]}
        onTouchStart={drag}
      >
        <Text style={styles.position}>{index + 1}</Text>
        <Image source={{ uri: item.logo }} style={styles.logo} />
        <Text style={styles.team}>{item.team}</Text>
      </View>
    </DoubleTapView>
  );
});

export const DragAndDrop: React.FC<DragAndDropProps> = ({
  items,
  setItems,
  favoriteTeam,
  setFavoriteTeam,
}) => {
  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setItems((value) => reorderItems(value, from, to));
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<Item>) => (
    <Card
      item={item}
      index={index}
      isFavorite={favoriteTeam === item.team}
      setFavoriteTeam={setFavoriteTeam}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.position]}>#</Text>
        <Text style={[styles.headerText, styles.team]}>Team</Text>
      </View>
      <ReorderableList
        data={items}
        onReorder={handleReorder}
        renderItem={renderItem}
        keyExtractor={(item) => item.team}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  position: {
    width: 30,
    textAlign: "center",
  },
  team: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 12,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 16,
    marginRight: 12,
    marginLeft: 12,
  },
});
