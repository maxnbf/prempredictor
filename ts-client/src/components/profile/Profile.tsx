import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, Paper, Typography } from '@mui/material';
import NavLayout from '../NavLayout';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetStore } from '../../redux/reducers/auth';
import { GetUserMetadataResponse, getUserMetadata } from '../../actions/user';
import { Notifications } from './notifications/Notifications';
import { Friends } from './friends/Friends';

const Profile: React.FC = () => {
  const [userMetadata, setUserMetadata] = useState<GetUserMetadataResponse | undefined>(undefined);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state: any) => state.auth.user_info.username);

  const logout = () => {
    localStorage.removeItem('jwtToken');
    nav('/login');
    dispatch(resetStore());
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserMetadata();
      setUserMetadata(response);
    };

    fetchData();
  }, []);

  return (
    <NavLayout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Banner */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>{username.charAt(0)}</Avatar>
          <Box>
            <Typography variant="h4">@{username}</Typography>
            <Typography color="text.secondary">{'fake bio'}</Typography>
          </Box>
          <Button onClick={() => logout()}>Logout</Button>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Profile Info
          </Typography>
          <Typography>
            <strong>Favorite Team:</strong> {userMetadata?.favoriteTeam}
          </Typography>
          <Typography>
            <strong>Season Score:</strong> {'50'}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Friends />
        </Paper>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Notifications />
        </Paper>
      </Container>
    </NavLayout>
  );
};

export default Profile;
