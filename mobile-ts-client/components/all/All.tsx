import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { PaginatedTable, UserScore } from "./PaginatedTable";
import {
  getAllFriendsRankings,
  getAllRanking,
  getFanRanking,
} from "../../actions/rankings";
import { getFavorite } from "../../actions/user";
import { Search } from "./Search";
import { getDimensions } from "../../utils/utils";

export const All: React.FC = () => {
  const [global, setGlobal] = useState<UserScore[]>([]);
  const [fan, setFan] = useState<UserScore[]>([]);
  const [friends, setFriends] = useState<UserScore[]>([]);
  const [favoriteTeam, setFavoriteTeam] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      const favorite = await getFavorite();
      setFavoriteTeam(favorite);

      if (favorite) {
        const allRanking = await getAllRanking();
        setGlobal(allRanking.data);

        const fanRanking = await getFanRanking(favorite);
        setFan(fanRanking.data);

        const friendRankings = await getAllFriendsRankings();
        setFriends(friendRankings);
      }
    };

    fetchData();
  }, []);

  if (favoriteTeam === undefined) {
    return (
      <SafeAreaView>
        <Text>Please make your predictions on the Home page</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
        }}
      >
        <Search />
        <PaginatedTable title="Global Leaderboard" data={global} />
        <PaginatedTable title="My Friends" data={friends} />

        <PaginatedTable title={`${favoriteTeam} Fans Leaderboard`} data={fan} />
      </ScrollView>
    </SafeAreaView>
  );
};
