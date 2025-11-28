import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, StyleSheet } from "react-native";
import { TextInput, Card, Text } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { searchUsers } from "../../actions/user";
import { HomeScreenProps } from "../../types/routes";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<HomeScreenProps>();

  useFocusEffect(
    useCallback(() => {
      setQuery("");

      return () => setQuery("");
    }, [])
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setUsers(undefined);
        return;
      }

      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await searchUsers(query);
          setUsers(response);
        } catch (error) {
          setUsers(undefined);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const navigateToUser = (username: string) => {
    navigation.navigate("Home", { username: username, gameweek: undefined });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by username"
        mode="outlined"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        contentStyle={styles.inputContent}
        left={<TextInput.Icon icon="magnify" size={18} />}
      />

      {!loading && (users?.length ?? 0) > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={users}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToUser(item)}>
                <Card
                  mode="contained"
                  style={styles.card}
                >
                  <Card.Content style={styles.cardContent}>
                    <Text style={styles.usernameText}>@{item}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  input: {
    marginBottom: 6,
  },
  inputContent: {
    fontSize: 14,
  },
  dropdown: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  list: {
    maxHeight: 200,
    borderRadius: 10,
  },
  card: {
    borderRadius: 0,
    backgroundColor: "#fff",
    elevation: 0,
  },
  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
});
