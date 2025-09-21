import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { getTimeSeriesPoints } from "../../../actions/rankings";
import { TimeSeriesPoints } from "../../../types/types";
import { HomeScreenProps } from "../../../types/routes";
import { useSelector } from "react-redux";
import { getDimensions } from "../../../utils/utils";
import { Loading } from "../../common/Loading";

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
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legendContainer}>
        {isComparingUsers ? (
          <>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#8884d8" }]}
              />
              <Text style={styles.legendText}>{ownUsername}</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#82ca9d" }]}
              />
              <Text style={styles.legendText}>{username}</Text>
            </View>
          </>
        ) : (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#8884d8" }]} />
            <Text style={styles.legendText}>{ownUsername}</Text>
          </View>
        )}
      </View>

      <LineChart
        data={{
          labels: validOwnData.map((entry, index) => {
            // Show around 8 labels for x-axis
            return index % Math.ceil(validOwnData.length / 8) === 0
              ? `GW${entry.currentRound}`
              : "";
          }),
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
        withShadow={false}
        height={getDimensions().width * 0.8}
        chartConfig={{
          decimalPlaces: 0,
          color: () => "#000000",
          labelColor: () => "#000000",
          propsForBackgroundLines: {
            stroke: "transparent",
          },
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
