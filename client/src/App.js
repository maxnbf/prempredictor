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

const App = () => {
    console.log(localStorage)

    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      const username = localStorage.jwtToken
      setAuthToken(token);

      dispatchAction(SIGN_IN_RESPONSE, {username: username});

      window.href="./home";
      
    
    }

      return (
        <Provider store={store}>
          <Router>
            <div className="App">
              <Switch>
                  {/* <PrivateRoute exact path="/home" component={Home} /> */}
                  <PrivateRoute exact path="/home" component={Home} />
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
