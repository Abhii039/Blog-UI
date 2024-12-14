import { createContext, useReducer, useEffect } from "react";
import Reducer from "./Reducer"; // Ensure this is your reducer file

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  // Effect to sync user state with localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const logout = () => {
    dispatch({ type: "LOGOUT" }); // Assuming you have a LOGOUT case in your reducer
  };

  return (
    <Context.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch, logout }}>
      {children}
    </Context.Provider>
  );
};