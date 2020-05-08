import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const App = () => {
  return (
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
  );
};

export default App;
