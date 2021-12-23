import './App.css';
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Component } from 'react';
import Home from './components/home/Home';



class App extends Component {
    render() {
      return (
          <Router>
            <div className="App">
              <Switch>
                <PrivateRoute exact path="/home" element={Home} />
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
             </Switch>
  
            </div>
          </Router>
    );
  }
}

export default App;
