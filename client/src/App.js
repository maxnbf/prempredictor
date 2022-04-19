import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Landing from './components/auth/landing/Landing';
import Register from './components/auth/register/Register';
import Login from './components/auth/login/Login';
import Home from './components/home/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
import setAuthToken from './redux/actions/setAuthToken';
import { dispatchAction } from './redux/actions/utilActions';
import { SIGN_IN_RESPONSE } from './redux/types/authTypes';
import jwt_decode from "jwt-decode";
import LeaderBoard from './components/LeaderBoard/LeaderBoard';
import { logoutUser } from './redux/actions/authActions';
// import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
  
    
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      const username = localStorage.username;
      const id = localStorage.id
      const name = localStorage.name
      const favorite_team = localStorage.favorite_team
      setAuthToken(token);

      dispatchAction(SIGN_IN_RESPONSE, {username: username, id: id, name: name, favorite_team: favorite_team});

      window.href="./home";

      // const decoded = jwt_decode(token);
      // const currentTime = Date.now() / 1000; // to get in milliseconds

      // if (decoded.exp < currentTime || decoded.iat < 1627172707) {
      //   // Logout user
      //   logoutUser()
      // }
    
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
