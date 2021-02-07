import {
  apiRequest,
  GET_STOCK_HISTORICAL_DATA,
  GET_STOCK_SYMBOLS,
} from "../../actions";
import { Dispatch, AnyAction } from "redux";

const getStocksHistoricalData = ({
  dispatch,
}: {
  dispatch: Dispatch<AnyAction>;
  getState: any;
}) => (next: Function) => (action: { type: string; meta?: any }) => {
  next(action);
  if (action.type === GET_STOCK_HISTORICAL_DATA.START) {
    const { key, params, stockSymbol, ...rest } = action.meta;
    const url = process.env.REACT_APP_QUANDL_URL;
    dispatch(
      apiRequest({
        method: "get",
        url: `${url}WIKI/${stockSymbol ?? "FB"}.json`,
        key: key || "getStocksHistoricalData",
        onSuccess: GET_STOCK_HISTORICAL_DATA.SUCCESS,
        noSuccessMessage: false,
        noErrorMessage: false,
        errorMessage: "Could not retrieve historical data for " + stockSymbol,
        successMessage: "Historical data retrieved successfully",
        ...rest,
        params: Object.assign(params, {
          api_key: process.env.REACT_APP_QUANDL_API_KEY,
          column_names: ["Date", "Close"],
          column_index: 4,
        }),
      })
    );
  }
};

const getStockSymbols = ({
  dispatch,
}: {
  dispatch: Dispatch<AnyAction>;
  getState: any;
}) => (next: Function) => (action: { type: string; meta?: any }) => {
  next(action);
  if (action.type === GET_STOCK_SYMBOLS.START) {
    const { key, ...rest } = action.meta;
    const url = process.env.REACT_APP_QUANDL_WIKI_PRICES_URL;
    dispatch(
      apiRequest({
        method: "get",
        url,
        key: key || "getStockSymbols",
        onSuccess: GET_STOCK_SYMBOLS.SUCCESS,
        ...rest,
      })
    );
  }
};

const middlewares = [getStocksHistoricalData, getStockSymbols];

export default middlewares;
