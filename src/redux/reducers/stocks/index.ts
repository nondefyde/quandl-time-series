import {
  GET_STOCK_HISTORICAL_DATA,
  GET_STOCK_SYMBOLS,
  SET_CURRENT_SYMBOL,
} from "../../actions/stocks";
import { get, isEmpty, first } from "lodash";
import { Action } from "redux";

export type StockState = {
  symbols: Array<{ label: string; value: string }>;
  currentSymbol: any | undefined;
  symbolsObj: any;
  currentSymbolName: string;
  sma: Array<{}>;
  ema: Array<{}>;
  historicalData: Array<{}>;
  tmp: {
    currentSymbolName: string;
  };
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
};

const stockReducer = (state = defaultState, action: Action): StockState => {
  switch (action.type) {
    case GET_STOCK_HISTORICAL_DATA.SUCCESS: {
      return {
        ...state,
        historicalData: get(action, "payload.dataset", []),
        currentSymbolName: state.tmp.currentSymbolName,
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

    default:
      return state;
  }
};

export default stockReducer;
