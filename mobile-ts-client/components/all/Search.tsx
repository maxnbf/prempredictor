import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { TextInput, Card, Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { searchUsers } from "../../actions/user"; // your API call
import { AllScreenProps, TabParamList } from "../../types/routes";
import { Loading } from "../common/Loading";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<AllScreenProps>();

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
          console.error("Search failed:", error);
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
        label="Search users"
        mode="outlined"
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 8 }}
      />

      {loading && !users && <Loading />}

      {!loading && users && users.length === 0 && query.length > 0 && (
        <Text style={{ marginTop: 8 }}>No results for: "{query}"</Text>
      )}

      {(users?.length ?? 0) > 0 && (
        <FlatList
          data={users}
          keyExtractor={(item, index) => `${item}-${index}`}
          style={{
            maxHeight: 200,
            borderRadius: 8,
            backgroundColor: "#fff",
            borderWidth: 1,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToUser(item)}>
              <Card mode="contained" style={{ borderRadius: 0 }}>
                <Card.Content>
                  <Text>{item}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
