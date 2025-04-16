import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import { MyTable } from './MyTable';
import { TimeSeriesPointsGraph } from './TimeSeriesPoints';
import { getLiveRankingForGameWeek } from '../../../actions/rankings';
import { LiveRanking, UserRanking } from '../../../types/types';

interface TableViewProps {
  setLive: React.Dispatch<React.SetStateAction<LiveRanking | undefined>>;
  live: LiveRanking;
  myTable: UserRanking;
  otherTable: UserRanking | undefined;
  currentGameWeek: number;
}

export const TableView = ({
  setLive,
  live,
  myTable,
  otherTable,
  currentGameWeek,
}: TableViewProps) => {
  // Function to handle gameweek change
  const handleGameweekChange = (event: any) => {
    const newGameweek = event.target.value;

    // Fetch live ranking for the selected gameweek
    getLiveRankingForGameWeek(newGameweek).then((res: LiveRanking) => {
      setLive(res);
    });
  };

  return (
    <>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="gameweek-select-label">Select Gameweek</InputLabel>
        <Select
          labelId="gameweek-select-label"
          value={live.currentRound}
          onChange={handleGameweekChange}
          label="Select Gameweek"
        >
          {/* Render all gameweeks up to the current round */}
          {Array.from({ length: currentGameWeek }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              Gameweek {index + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MyTable liveTable={live} myTable={myTable} otherTable={otherTable} />
      <Paper sx={{ p: 1 }}>
        <TimeSeriesPointsGraph />
      </Paper>
    </>
  );
};
