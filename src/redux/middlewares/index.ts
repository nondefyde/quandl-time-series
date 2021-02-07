import app from "./app";
import stocks from "./stocks";

const middlewares = [...app, ...stocks];
export default middlewares;
