import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import customMiddleWares from "./middlewares";
import appReducers from "./reducers";
import { Action } from "./types";

const rootReducer = (state: any, action: Action) => {
  return appReducers(state, action);
};

// add the middleWares
const middleWares = [...customMiddleWares];

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  middleWares.push(createLogger());
}

// apply the middleware
let middleware = applyMiddleware(...middleWares);

if (
  process.env.NODE_ENV !== "production" &&
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  //@ts-ignore
  middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__());
}

// create the store
const store = createStore(rootReducer, {}, middleware);

// export
export default store;
