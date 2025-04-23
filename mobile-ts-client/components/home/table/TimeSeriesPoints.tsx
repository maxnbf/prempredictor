import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { getTimeSeriesPoints } from "../../../actions/rankings";
import { TimeSeriesPoints } from "../../../types/types";
import { HomeScreenProps } from "../../../types/routes";
import { useSelector } from "react-redux";
import { getDimensions } from "../../../utils/utils";

type TimeSeriesPointsGraphProps = {
  username?: string;
};

export const TimeSeriesPointsGraph: React.FC<TimeSeriesPointsGraphProps> = ({
  username,
}) => {
  const navigation = useNavigation<HomeScreenProps>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<TimeSeriesPoints[]>([]);
  const [ownData, setOwnData] = useState<TimeSeriesPoints[]>([]);

  const ownUsername = useSelector(
    (state: any) => state.auth.user_info.username
  );

  const isComparingUsers = username && username !== ownUsername;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ownRes, userRes] = await Promise.all([
          getTimeSeriesPoints(ownUsername),
          isComparingUsers
            ? getTimeSeriesPoints(username)
            : Promise.resolve([]),
        ]);

        setOwnData(ownRes);
        if (isComparingUsers) {
          setUserData(userRes as TimeSeriesPoints[]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching time series data:", err);
      }
    };

    fetchData();
  }, [username, ownUsername]);

  // Validate data: filter out any invalid values (NaN, Infinity, undefined)
  const validateData = (data: TimeSeriesPoints[]) => {
    return data.filter(
      (item) =>
        !isNaN(item.score) &&
        item.score !== Infinity &&
        item.score !== -Infinity
    );
  };

  const validOwnData = validateData(ownData);
  const validUserData = validateData(userData);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        {isComparingUsers
          ? `${username} vs ${ownUsername}'s Weekly Scores`
          : `${ownUsername}'s Weekly Scores`}
      </Text>
      {isComparingUsers ? (
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#8884d8",
                marginRight: 6,
                borderRadius: 2,
              }}
            />
            <Text>{ownUsername}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#82ca9d",
                marginRight: 6,
                borderRadius: 2,
              }}
            />
            <Text>{username}</Text>
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#8884d8",
                marginRight: 6,
                borderRadius: 2,
              }}
            />
            <Text>{ownUsername}</Text>
          </View>
        </View>
      )}
      <LineChart
        data={{
          labels: validOwnData?.map((entry) => `GW${entry.currentRound}`),
          datasets: [
            {
              data: validOwnData.map((entry) => entry.score),
              color: () => "#8884d8",
              strokeWidth: 2,
            },
            ...(isComparingUsers && validUserData.length > 0
              ? [
                  {
                    data: validUserData.map((entry) => entry.score),
                    color: () => "#82ca9d",
                    strokeWidth: 2,
                  },
                ]
              : []),
          ],
        }}
        width={getDimensions().width * 0.8}
        transparent={true}
        height={getDimensions().width * 0.8}
        chartConfig={{
          decimalPlaces: 0,
          color: () => "#000000",
          labelColor: () => "#000000",
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#fff",
          },
        }}
        onDataPointClick={(e) =>
          navigation.navigate("Home", {
            username: username ?? ownUsername,
            gameweek: validOwnData[e.index]?.currentRound.toString(),
          })
        }
      />
    </View>
  );
};
