import axios from "axios";

import { registerGroup, getGroup, setGroupLoading } from "./groupActions";

import { getErrors } from "./errorActions";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from "./types";

// initializes the axios request header to send along a token to the database.
export const tokenConfig = getState => {
  // get token from localstorage
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  // if token exists, add it to the axios request header
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};

/* check token and load user.
 * Must get token from state.
 */
export const loadUser = () => (dispatch, getState) => {
  // set user loading
  dispatch({ type: USER_LOADING });
  axios
    .get(`/api/auth/user`, tokenConfig(getState))
    .then(res => {
      dispatch(getGroup(res.data.group));
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch(getErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

/* Registers a user and the group they are a part of.
 *
 */
export const registerUser = ({ name, email, password, group }) => dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  // send lower case name to database.
  const body = JSON.stringify({ name, email, password, group });

  // TODO change dispatch to disallow users to be added to a group they don't belong to.
  dispatch(registerGroup(group));

  axios
    .post(`/api/users`, body, config)
    .then(res => {
      dispatch(setGroupLoading());
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
      dispatch(getGroup(res.data.user.group));
    })
    .catch(err => {
      dispatch(
        getErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

export const loginUser = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  axios
    .post(`/api/auth`, body, config)
    .then(res => {
      dispatch(setGroupLoading());
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(getGroup(res.data.user.group));
    })
    .catch(err => {
      console.log(err);
      dispatch(getErrors(err.response.data, err.response.status, "LOGIN_FAIL"));
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

export const logoutUser = () => dispatch => {
  dispatch({
    type: LOGOUT_SUCCESS
  });
};
