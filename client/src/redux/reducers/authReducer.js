const initialState = {
  token: localStorage.getItem("token"),
  authenticated: null,
  user: null,
  loading: false
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "USER_LOADING":
      return {
        ...state,
        loading: true
      };
    case "USER_LOADED":
      return {
        ...state,
        authenticated: true,
        loading: false,
        user: action.payload
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticated: true,
        loading: false
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
    case "LOGOUT_SUCCESS":
      // if error occurs, remove token from local storage.
      localStorage.removeItem("token");
      return {
        ...state,
        authenticated: null,
        token: null,
        user: null,
        loading: false
      };
    default:
      return state;
  }
}
