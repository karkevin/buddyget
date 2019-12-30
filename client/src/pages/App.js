import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

// pages
import Home from "./Home";
import Welcome from "./Welcome";
import Form from "./Form";

// load user dispatch function
import { loadUser } from "../redux/actions/authActions";
import { connect } from "react-redux";

const authenticated = false;

const PrivateRoute = props => {
  const { path, authenticated } = props;
  console.log(props);
  return (
    <Route
      path={path}
      authenticated={authenticated}
      render={() => (authenticated ? <Home /> : <Welcome />)}
    />
  );
};

class App extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route
            path="/login"
            render={() => <Form title="Login" items={["Email", "Password"]} />}
          />
          <Route
            path="/sign-up"
            render={() => (
              <Form
                title="Sign Up"
                items={["Name", "Email", "Password", "Group"]}
              />
            )}
          />
          <Route
            path="/app"
            render={() => (this.props.authenticated ? <Home /> : <Welcome />)}
          />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated
});

export default connect(mapStateToProps, { loadUser })(App);
