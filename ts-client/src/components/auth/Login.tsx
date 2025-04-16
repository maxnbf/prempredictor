import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigate in v6
import { loginUser } from '../../actions/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // replaced useHistory with useNavigate

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ username, password });
    navigate('/'); // navigate to home or dashboard
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleLogin} mt={2} width="100%">
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
        <Box mt={2}>
          <Link href="/register" variant="body2">
            Don't have an account? Register
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
