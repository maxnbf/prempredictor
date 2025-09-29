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
        style={[styles.row, isFavorite && styles.favoriteRow]}
        onTouchStart={drag}
      >
        <Text style={[styles.position, isFavorite && styles.favoriteText]}>
          {index + 1}
        </Text>
        <Image source={{ uri: item.logo }} style={[styles.logo]} />
        <Text style={[styles.team, isFavorite && styles.favoriteText]}>
          {item.team}
        </Text>
        {isFavorite && <Text style={styles.favoriteIcon}>⭐</Text>}
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
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#495057",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
    minHeight: 60,
  },
  position: {
    width: 35,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 16,
    color: "#212529",
  },
  logo: {
    width: 28,
    height: 28,
    marginLeft: 8,
  },
  favoriteRow: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    paddingLeft: 16, // Compensate for the border width
  },
  favoriteText: {
    color: "#856404",
    fontWeight: "bold",
  },
  favoriteIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
});
