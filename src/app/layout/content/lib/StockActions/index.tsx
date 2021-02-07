import { Button, DatePicker, Select } from "antd";
import { RootState } from "../../../../../redux/types";
import {
  getStockSymbols,
  setCurrentSymbol,
  getStocksHistoricalData,
} from "../../../../../redux/actions";
import { connect, ConnectedProps } from "react-redux";
import { Moment } from "moment";
import { FC, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { transforms } from "../../../../../_shared/utils";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

// dispatch props
const dispatchProps = {
  getStockSymbols,
  setCurrentSymbol,
  getStocksHistoricalData,
};
// state derived props.
const stateProps = (state: RootState) => ({
  symbols: state.stocks.symbols,
  currentSymbol: state.stocks.currentSymbol,
  gettingStocksHistoricalData:
    state.ui.loading["GET_STOCK_HISTORICAL_DATA_HISTORICAL_DATA"],
  gettingStockSymbols: state.ui.loading["GET_STOCK_SYMBOLS"],
});

// Creates connection to state
const connector = connect(stateProps, dispatchProps);

// Evaluates the props derived from stateProps and dispatchProps
type PropsFromRedux = ConnectedProps<typeof connector>;

// Creates a union props

type StockActionsProps = PropsFromRedux & {};
const StockActions: FC<StockActionsProps> = (props) => {
  const {
    setCurrentSymbol,
    currentSymbol,
    getStocksHistoricalData,
    gettingStocksHistoricalData,
    getStockSymbols,
    gettingStockSymbols,
    symbols,
  } = props;
  const [period, setPeriod] = useState("none");
  const [transform, setTransform] = useState("none");
  const [duration, setDuration] = useState(undefined);

  const getStockPrices = (params = {}) => {
    const defaultParams = { collapse: period };
    getStocksHistoricalData(
      currentSymbol ?? "FB",
      Object.assign({}, defaultParams, params),
      "GET_STOCK_HISTORICAL_DATA_HISTORICAL_DATA"
    );
  };

  const getSymbols = (params = {}) => {
    getStockSymbols(params, "GET_STOCK_EXCHANGES");
  };

  const onPeriodChange = (period: string) => {
    setPeriod(period);
  };
  const onTransformChange = (period: string) => {
    setTransform(period);
  };
  const onSymbolChange = (value: string, option: any) => {
    setCurrentSymbol(option ?? value);
  };
  const onDurationChange = (duration: any) => {
    setDuration(duration);
  };
  const onGetStockData = () => {
    const start_date = Object.assign(
      {},
      !isEmpty(duration?.[0]) && moment(duration?.[0]).isValid()
        ? { start_date: moment(duration?.[0]).toDate() }
        : {}
    );
    const end_date = Object.assign(
      {},
      !isEmpty(duration?.[1]) && moment(duration?.[1]).isValid()
        ? { end_date: moment(duration?.[1]).toDate() }
        : {}
    );
    getStockPrices({ transform, ...end_date, ...start_date, collapse: period });
  };

  useEffect(() => {
    getStockPrices();
    getSymbols();
  }, []);

  return (
    <section className={"app-content-chart-actions"}>
      <div className={"app-content-chart-action"}>
        <div className={"app-content-chart-action-title-container"}>
          <span className={"anticon"} style={{ paddingRight: 10 }}>
            <i className={"ri-bank-line"} />
          </span>
          <span className={"app-content-chart-action-title"}>Company</span>
        </div>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select a company"
          value={currentSymbol}
          optionFilterProp="label"
          onChange={onSymbolChange}
          filterOption={(input, option: any) =>
            option?.label?.toLowerCase?.()?.indexOf?.(input?.toLowerCase?.()) >=
            0
          }
          disabled={gettingStocksHistoricalData || gettingStockSymbols}
          loading={gettingStockSymbols}
          options={symbols || []}
        />
      </div>
      <div className={"app-content-chart-action"}>
        <div className={"app-content-chart-action-title-container"}>
          <span className={"anticon"} style={{ paddingRight: 10 }}>
            <i className="ri-command-line" />
          </span>
          <span className={"app-content-chart-action-title"}>Transforms</span>
        </div>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select a transform"
          optionFilterProp="label"
          defaultValue={"none"}
          value={transform}
          onChange={onTransformChange}
          filterOption={(input, option: any) =>
            option?.label?.toLowerCase?.()?.indexOf?.(input?.toLowerCase?.()) >=
            0
          }
          disabled={gettingStocksHistoricalData}
          options={transforms}
        />
      </div>
      <div className={"app-content-chart-action"}>
        <div className={"app-content-chart-action-title-container"}>
          <span className={"anticon"} style={{ paddingRight: 10 }}>
            <i className="ri-time-line" />
          </span>
          <span className={"app-content-chart-action-title"}>Period</span>
        </div>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select a period"
          optionFilterProp="label"
          defaultValue={"yearly"}
          value={period}
          onChange={onPeriodChange}
          filterOption={(input, option: any) =>
            option?.label?.toLowerCase?.()?.indexOf?.(input?.toLowerCase?.()) >=
            0
          }
          disabled={gettingStocksHistoricalData}
        >
          <Option value="none">None</Option>
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="quarterly">Quarterly</Option>
          <Option value="annual">Annually</Option>
        </Select>
      </div>
      <div className={"app-content-chart-action"}>
        <div className={"app-content-chart-action-title-container"}>
          <span className={"anticon"} style={{ paddingRight: 10 }}>
            <i className="ri-calendar-2-line" />
          </span>
          <span className={"app-content-chart-action-title"}>Duration</span>
        </div>
        <RangePicker
          style={{ width: "100%" }}
          disabledDate={(date: Moment) => {
            return date.isAfter(new Date());
          }}
          value={duration}
          onChange={onDurationChange}
          disabled={gettingStocksHistoricalData}
        />
      </div>
      <div className={"app-content-chart-action"} style={{ marginTop: 20 }}>
        <Button
          block
          type={"primary"}
          icon={
            <span className="anticon">
              <i className="ri-stock-line" />
            </span>
          }
          onClick={() => onGetStockData()}
          disabled={gettingStocksHistoricalData}
          loading={gettingStocksHistoricalData}
        >
          Get stock prices
        </Button>
      </div>
    </section>
  );
};

export default connector(StockActions);
