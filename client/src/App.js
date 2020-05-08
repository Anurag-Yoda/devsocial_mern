import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

//Redux 
import {Provider} from 'react-redux';
import store from './store'; 



const App = () => {
  return (
    <Provider store = {store}>
    <Router>
      <Fragment>
        <NavBar />
        <Route path="/" exact component={Landing} />
        <section className = "container">
          <Switch>
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
    </Provider>
  );
};

export default App;
