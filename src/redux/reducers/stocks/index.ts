import {
  DISPLAY_EMA,
  DISPLAY_SMA,
  GET_STOCK_HISTORICAL_DATA,
  GET_STOCK_SYMBOLS,
  SET_CURRENT_SYMBOL,
} from "../../actions/stocks";
import { get, isEmpty, first, flatMap, clamp } from "lodash";
import { Action } from "redux";
import { EMA, SMA } from "technicalindicators";

export type StockState = {
  symbols: Array<{ label: string; value: string }>;
  currentSymbol: any | undefined;
  symbolsObj: any;
  currentSymbolName: string;
  sma: any;
  ema: Array<{}>;
  historicalData: any;
  tmp: {
    currentSymbolName: string;
  };
  displaySMA: boolean;
  displayEMA: boolean;
};
const defaultState: StockState = {
  sma: [],
  ema: [],
  currentSymbol: undefined,
  symbols: [],
  historicalData: [],
  symbolsObj: {},
  currentSymbolName: "",
  tmp: {
    currentSymbolName: "Facebook inc",
  },
  displaySMA: false,
  displayEMA: true,
};

const stockReducer = (state = defaultState, action: Action): StockState => {
  switch (action.type) {
    case GET_STOCK_HISTORICAL_DATA.SUCCESS: {
      const historicalData = get(action, "payload.dataset", {});
      const datasetData = historicalData?.data ?? [];
      const sma = SMA.calculate({
        values: flatMap(datasetData, (o) => o[1]),
        period: clamp(30, 1, datasetData.length - 1),
      }).map((o: number, i: number) => {
        return [first(datasetData[i] ?? [new Date()]), o ?? 0];
      });
      const ema = EMA.calculate({
        values: flatMap(datasetData, (o) => o[1]),
        period: clamp(30, 1, datasetData.length - 1),
      }).map((o: number, i: number) => {
        return [first(datasetData[i] ?? [new Date()]), o ?? 0];
      });

      return {
        ...state,
        historicalData,
        currentSymbolName: state.tmp.currentSymbolName,
        sma,
        ema,
      };
    }
    case GET_STOCK_SYMBOLS.SUCCESS: {
      const currentSymbol = get(
        first(get(action, "payload")),
        "value",
        undefined
      );

      return Object.assign(
        {},
        state,
        {
          symbols: get(action, "payload"),
          // symbolsObj: arrayToBySymbol(get(action, "payload", [])),
        },
        !isEmpty(state.symbols)
          ? {
              currentSymbol,
              currentSymbolName: get(currentSymbol, "label", ""),
            }
          : { currentSymbol: "FB", currentSymbolName: "Facebook inc" }
      );
    }
    case SET_CURRENT_SYMBOL: {
      const option = get(action, "payload");
      return {
        ...state,
        currentSymbol: get(option, "value", undefined),
        tmp: {
          currentSymbolName: get(option, "label", ""),
        },
      };
    }
    case DISPLAY_SMA: {
      return { ...state, displaySMA: get(action, "payload", false) };
    }
    case DISPLAY_EMA: {
      return { ...state, displayEMA: get(action, "payload", false) };
    }
    default:
      return state;
  }
};

export default stockReducer;
