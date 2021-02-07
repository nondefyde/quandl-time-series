import { createActionString, createActionType } from "../../../_shared/utils";

const entity = "STOCKS";
export const GET_STOCK_HISTORICAL_DATA = createActionType(
  "GET_STOCK_HISTORICAL_DATA",
  entity
);
export const SET_CURRENT_SYMBOL = createActionString(
  "SET_CURRENT_SYMBOL",
  entity
);
export const DISPLAY_SMA = createActionString("DISPLAY_SMA", entity);
export const DISPLAY_EMA = createActionString("DISPLAY_EMA", entity);
export const GET_STOCK_SYMBOLS = createActionType("GET_STOCK_SYMBOLS", entity);

export const getStocksHistoricalData = (
  stockSymbol: string,
  params = {},
  key?: string
) => ({
  type: GET_STOCK_HISTORICAL_DATA.START,
  meta: {
    key,
    params,
    stockSymbol,
  },
});

export const getStockSymbols = (params = {}, key?: string) => ({
  type: GET_STOCK_SYMBOLS.START,
  meta: {
    key,
    params,
  },
});

export const setCurrentSymbol = (payload: string) => ({
  type: SET_CURRENT_SYMBOL,
  payload,
});

export const setDisplaySMA = (payload: boolean) => ({
  type: DISPLAY_SMA,
  payload,
});

export const setDisplayEMA = (payload: boolean) => ({
  type: DISPLAY_EMA,
  payload,
});
