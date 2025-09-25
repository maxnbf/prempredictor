import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  TextInput,
  Card,
  Text,
  ActivityIndicator,
  List,
  Divider,
  Surface,
} from "react-native-paper";
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

  const clearQuery = () => {
    setQuery("");
    setUsers(undefined);
  };

  const showResults = !loading && (users?.length ?? 0) > 0;
  const showNoResults = !loading && !!query.trim() && (users?.length ?? 0) === 0;

  return (
    <View style={{ width: "100%", marginBottom: 16 }}>
      <TextInput
        placeholder="Search by username"
        mode="outlined"
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 8 }}
        left={<TextInput.Icon icon="magnify" />}
        right={
          query ? (
            <TextInput.Icon
              icon={loading ? "progress-clock" : "close-circle"}
              onPress={!loading ? clearQuery : undefined}
            />
          ) : undefined
        }
      />

      {loading && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ActivityIndicator animating size="small" />
          <Text>Searching…</Text>
        </View>
      )}

      {showResults && (
        <Surface
          elevation={4}
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 999,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <FlatList
            data={users}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={{
              maxHeight: 260,
            }}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => navigateToUser(item)}>
                <List.Item
                  title={`@${item}`}
                  left={(props) => <List.Icon {...props} icon="account" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  style={{
                    backgroundColor: "white",
                  }}
                />
              </TouchableOpacity>
            )}
          />
        </Surface>
      )}

      {showNoResults && (
        <Surface
          elevation={2}
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 999,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <List.Icon icon="magnify" />
            <Text>No matches found</Text>
          </View>
        </Surface>
      )}
    </View>
  );
};
