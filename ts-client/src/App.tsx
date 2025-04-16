import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { setAuthToken } from './actions/util';
import store from './redux/store';
import { signInResponse } from './redux/reducers/auth';
import { Home } from './components/home/Home';
import { All } from './components/all/All';
import Profile from './components/profile/Profile';

const AppWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  if (localStorage.jwtToken && !isAuthenticated) {
    const token = localStorage.jwtToken;
    const username = localStorage.username;

    // Set the authorization token in axios headers
    setAuthToken(token);

    // Dispatch the signInResponse action to update the Redux state
    dispatch(signInResponse({ username, token }));
  }

  return (
    <Router>
      <Routes>
        {/* Define routes for login, register, and home */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/home" />}
        />
        {/* Redirect to home (or current route) if user is authenticated */}
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/home/:username/:gameWeek"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/home/:username"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        <Route path="/all" element={isAuthenticated ? <All /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route
          path="*"
          element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        {/* Redirect to login if no match */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};

export default App;
