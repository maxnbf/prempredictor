import { useEffect, useState } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { searchUsers } from '../../actions/user';
import { useNavigate } from 'react-router-dom';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

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
          console.error('Search failed:', error);
          setUsers(undefined);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const nav = useNavigate();
  const navigateToUser = (username: string) => {
    nav(`/home/${username}`);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mx: 'auto', my: 1 }}>
      <TextField
        fullWidth
        label="Search users"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Paper
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 10,
          mt: 1,
          minHeight: loading || users != undefined ? 200 : 0,
          maxHeight: 200,
          overflowY: 'auto',
        }}
      >
        {loading && users == undefined && <div>Loading</div>}
        {!loading && users && users.length == 0 && query.length > 0 && (
          <Typography>No results for search: {query}</Typography>
        )}
        {(users?.length ?? 0) > 0 && (
          <List disablePadding>
            {users?.map((username, i) => (
              <ListItem
                key={i}
                divider={i !== users.length - 1} // no divider on last item
                onClick={() => navigateToUser(username)}
              >
                <ListItemText primary={username} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};
