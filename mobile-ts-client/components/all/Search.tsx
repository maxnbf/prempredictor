import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
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
    <View style={{ width: "100%", marginBottom: 16 }}>
      <TextInput
        placeholder="Search by username"
        mode="outlined"
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 8, color: "white" }}
        left={<TextInput.Icon icon="magnify" />}
      />

      {!loading && (users?.length ?? 0) > 0 && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 999,
            backgroundColor: "white",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            borderRadius: 8,
          }}
        >
          <FlatList
            data={users}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={{
              maxHeight: 200,
              borderRadius: 8,
              borderWidth: 1,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToUser(item)}>
                <Card
                  mode="contained"
                  style={{ borderRadius: 0, backgroundColor: "white" }}
                >
                  <Card.Content>
                    <Text>@{item}</Text>
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
