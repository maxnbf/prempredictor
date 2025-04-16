import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getLiveRanking, getLiveRankingForGameWeek, getRanking } from '../../actions/rankings';
import { NewUserOnboarding } from './onboarding/NewUserOnboarding';
import {
  Container,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import NavLayout from '../NavLayout';
import { MyTable } from './table/MyTable';
import { LiveRanking, UserRanking } from '../../types/types';
import { TimeSeriesPointsGraph } from './table/TimeSeriesPoints';
import { TableView } from './table/TableView';

export const Home = () => {
  const [myTable, setMyTable] = useState<UserRanking | undefined>(undefined);
  const [otherTable, setOtherTable] = useState<UserRanking | undefined>(undefined);
  const [live, setLive] = useState<LiveRanking | undefined>(undefined);
  const [currentGameWeek, setCurrentGameWeek] = useState<number>(0); // live game week
  const [isLoading, setIsLoading] = useState(false);

  const ownUsername = useSelector((state: any) => state.auth.user_info.username);
  const { username, gameWeek } = useParams();

  useEffect(() => {
    setIsLoading(true);
    getRanking(ownUsername).then((res) => setMyTable(res));
    if (username != ownUsername && username != undefined) {
      getRanking(username).then((res) => setOtherTable(res));
    }
    getLiveRanking().then((res: any) => {
      setCurrentGameWeek(res.currentRound);
      if (gameWeek) {
        getLiveRankingForGameWeek(gameWeek).then((res: any) => {
          setLive(res);
        });
      } else {
        setLive(res);
      }
      setIsLoading(false);
    });
  }, [ownUsername, username, gameWeek]);

  console.log(live?.currentRound, live, currentGameWeek);
  const renderContent = () => {
    return (
      <Box sx={{ pb: 8, zIndex: 1 }}>
        {isLoading ? (
          <Container maxWidth="md">
            <CircularProgress />
          </Container>
        ) : myTable && live ? (
          <Container maxWidth="md">
            <TableView
              setLive={setLive}
              live={live}
              myTable={myTable}
              otherTable={otherTable}
              currentGameWeek={currentGameWeek}
            />
          </Container>
        ) : myTable === null ? (
          <Container maxWidth="md">
            <NewUserOnboarding />
          </Container>
        ) : (
          <Container maxWidth="md">Something Went Wrong</Container>
        )}
      </Box>
    );
  };

  return <NavLayout disableNav={myTable === null}>{renderContent()}</NavLayout>;
};
