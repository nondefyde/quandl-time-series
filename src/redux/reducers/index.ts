import { combineReducers } from "redux";
import stockReducer from "./stocks";
import app from "./app";

const appReducers = combineReducers({
  ...app,
  stocks: stockReducer,
});

export default appReducers;
