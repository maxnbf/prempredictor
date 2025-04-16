import React, { useState, useEffect } from 'react';
import { getLiveRanking, makeRanking } from '../../../actions/rankings';
import { Box, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DraggableTable from './DragAndDrop';
import { setFavorite } from '../../../actions/user';

const CreatePrediction: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [favoriteTeam, setFavoriteTeam] = useState<string>('');

  useEffect(() => {
    getLiveRanking()
      .then((liveRanking) => {
        setTeams(liveRanking.ranking);
        setFavoriteTeam(liveRanking.ranking[0]); // Default favorite to top-ranked team
      })
      .catch((error) => {
        console.error('Error fetching live ranking:', error);
      });
  }, []);

  const saveTable = () => {
    makeRanking({ teams })
      .then(() => {
        setFavorite(favoriteTeam);
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  return (
    <Box>
      <DraggableTable items={teams} setItems={setTeams} />

      <Box mt={4}>
        <FormControl fullWidth>
          <InputLabel id="favorite-team-label">Favorite Team</InputLabel>
          <Select
            labelId="favorite-team-label"
            value={favoriteTeam}
            label="Favorite Team"
            onChange={(e) => setFavoriteTeam(e.target.value)}
          >
            {teams.map((team) => (
              <MenuItem key={team} value={team}>
                {team}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={saveTable}>
          Save Standings
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePrediction;
