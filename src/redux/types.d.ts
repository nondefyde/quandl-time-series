import { StockState } from "./reducers/stocks";
import { UIState } from "./reducers/app/ui";

type RootState = {
  stocks: StockState;
  ui: UIState;
};

type Action = {
  type: string;
  payload?: any;
  key?: string | number | symbol | any;
  value?: any;
  meta?: any;
};

export { Action, RootState };
