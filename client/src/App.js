import './App.css';
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Component } from 'react';
import Home from './components/home/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
import setAuthToken from './redux/actions/setAuthToken';
import { dispatchAction } from './redux/actions/utilActions';
import { SIGN_IN_RESPONSE } from './redux/types/authTypes';
import jwt_decode from "jwt-decode";
import LeaderBoard from './components/LeaderBoard/LeaderBoard';
const App = () => {
    console.log(localStorage)
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      const username = localStorage.username;
      const id = localStorage.id
      const name = localStorage.name
      setAuthToken(token);

      dispatchAction(SIGN_IN_RESPONSE, {username: username, id: id, name: name});

      window.href="./home";

      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000; // to get in milliseconds
      //if the token is expired or before July 25 2021 it is bad
      if (decoded.exp < currentTime || decoded.iat < 1627172707) {
        // Logout user
        localStorage.removeItem("jwtToken");
        // Remove auth header for future requests
        setAuthToken(false);
        // Set current user to empty object {} which will set isAuthenticated to false
        dispatchAction(SIGN_IN_RESPONSE, {});
        // Redirect to login
        window.location.href = "./login";
      }
    
    }

      return (
        <Provider store={store}>
          <Router>
            <div className="App">
              <Switch>
                  {/* <PrivateRoute exact path="/home" component={Home} /> */}
                  <PrivateRoute exact path="/home" component={Home} />
                  <PrivateRoute exact path="/home/:username" component={Home} />
                  <PrivateRoute exact path="/leaderboard" component={LeaderBoard} />
              </Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />

            </div>
          </Router>
        </Provider>
    );
}


export default App;
