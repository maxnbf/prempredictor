import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { TimeSeriesPoints } from '../../../types/types';
import { getTimeSeriesPoints } from '../../../actions/rankings';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export const TimeSeriesPointsGraph: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<TimeSeriesPoints[]>([]);
  const [ownData, setOwnData] = useState<TimeSeriesPoints[]>([]);

  const navigate = useNavigate();
  const ownUsername = useSelector((state: any) => state.auth.user_info.username);
  const { username } = useParams();

  const isComparingUsers = username && username !== ownUsername;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [ownRes, userRes] = await Promise.all([
          getTimeSeriesPoints(ownUsername),
          isComparingUsers ? getTimeSeriesPoints(username) : Promise.resolve([]),
        ]);

        setOwnData(ownRes);
        if (isComparingUsers) {
          setUserData(userRes as TimeSeriesPoints[]);
        }
      } catch (err) {
        console.error('Error fetching time series data:', err);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [username, ownUsername]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const mergeScores = (own: TimeSeriesPoints[], other: TimeSeriesPoints[]): any[] => {
    const merged = own.map((entry, index) => ({
      currentRound: entry.currentRound,
      [ownUsername]: entry.score,
      ...(other[index] && { [username as string]: other[index].score }),
    }));

    return merged;
  };

  return (
    <Box>
      <Typography>
        {isComparingUsers
          ? `${username} vs ${ownUsername}'s Weekly Scores`
          : `${ownUsername}'s Weekly Scores`}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={
            isComparingUsers
              ? mergeScores(ownData, userData)
              : ownData.map((entry) => ({
                  currentRound: entry.currentRound,
                  [ownUsername]: entry.score,
                }))
          }
          onClick={(e) =>
            navigate(
              `/home/${username ?? ownUsername}/${ownData[e.activeTooltipIndex ?? 0]?.currentRound}`
            )
          }
          margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="currentRound">
            <Label value="Gameweek" offset={0} position="bottom" />
          </XAxis>
          <YAxis>
            <Label value="Points" angle={-90} position="left" />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey={ownUsername} stroke="#8884d8" activeDot={{ r: 6 }} />
          {isComparingUsers && (
            <Line type="monotone" dataKey={username} stroke="#82ca9d" activeDot={{ r: 6 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
