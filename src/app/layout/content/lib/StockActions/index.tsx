import { Button, DatePicker, Select, Tooltip } from "antd";
import { RootState } from "../../../../../redux/types";
import {
  getStockSymbols,
  setCurrentSymbol,
  getStocksHistoricalData,
  setDisplaySMA,
  setDisplayEMA,
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
  setDisplayEMA,
  setDisplaySMA,
};
// state derived props.
const stateProps = (state: RootState) => ({
  symbols: state.stocks.symbols,
  showSMA: state.stocks.displaySMA,
  showEMA: state.stocks.displayEMA,
  currentSymbol: state.stocks.currentSymbol,
  gettingStocksHistoricalData:
    state.ui.loading["GET_STOCK_HISTORICAL_DATA_HISTORICAL_DATA"],
  gettingStockSymbols: state.ui.loading["GET_STOCK_SYMBOLS"],
  newest_available_date:
    state.stocks.historicalData?.newest_available_date ?? new Date(),
  oldest_available_date:
    state.stocks.historicalData?.oldest_available_date ??
    moment().subtract(1, "day").toDate(),
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
    oldest_available_date,
    newest_available_date,
    setDisplaySMA,
    setDisplayEMA,
    showSMA,
    showEMA,
  } = props;
  const [period, setPeriod] = useState("none");
  const [transform, setTransform] = useState("none");
  const [duration, setDuration] = useState<Moment[] | undefined>(undefined);

  const getStockPrices = (params = {}) => {
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
    const defaultParams = {
      transform,
      ...end_date,
      ...start_date,
      collapse: period,
    };
    getStocksHistoricalData(
      currentSymbol ?? "ADBE",
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
            return (
              date.isAfter(new Date(newest_available_date)) ||
              date.isBefore(new Date(oldest_available_date))
            );
          }}
          //@ts-ignore
          value={duration}
          onChange={onDurationChange}
          disabled={gettingStocksHistoricalData}
          allowClear
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
          onClick={() => getStockPrices()}
          disabled={gettingStocksHistoricalData}
          loading={gettingStocksHistoricalData}
        >
          Get stock prices
        </Button>
      </div>
      <div
        className={"app-content-chart-action"}
        style={{
          marginTop: 30,
          marginBottom: 20,
          borderTop: "1.3px solid #2e2e2e",
          borderBottom: "1.3px solid #2e2e2e",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <span style={{ opacity: 0.7, fontSize: 15, fontWeight: 500 }}>
          30 days moving averages
        </span>
      </div>
      <div className={"app-content-chart-action"}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // width: "100%",
          }}
        >
          <Tooltip
            title={
              "A simple moving average is a technical indicator that can aid in determining if an asset price will continue or if it will reverse a bull or bear trend"
            }
          >
            <Button
              icon={
                <span className="anticon">
                  {/*<i className="ri-stock-line" />*/}
                </span>
              }
              onClick={() => setDisplaySMA(true)}
              disabled={gettingStocksHistoricalData || showSMA}
            >
              Simple moving average
            </Button>
          </Tooltip>
          <Tooltip title={"Clear"}>
            <Button
              icon={
                <span className="anticon">
                  <i className="ri-close-line" />
                </span>
              }
              onClick={() => setDisplaySMA(false)}
              disabled={gettingStocksHistoricalData || showSMA === false}
            />
          </Tooltip>
        </div>
      </div>
      <div className={"app-content-chart-action"}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // width: "100%",
          }}
        >
          <Tooltip
            title={
              "The exponential moving average (EMA) is a technical chart indicator that tracks the price of an investment (like a stock or commodity) over time. "
            }
          >
            <Button
              icon={
                <span className="anticon">
                  {/*<i className="ri-stock-line" />*/}
                </span>
              }
              onClick={() => setDisplayEMA(true)}
              disabled={gettingStocksHistoricalData || showEMA}
            >
              Exponential moving average
            </Button>
          </Tooltip>
          <Tooltip title={"Clear"}>
            <Button
              icon={
                <span className="anticon">
                  <i className="ri-close-line" />
                </span>
              }
              onClick={() => setDisplayEMA(false)}
              disabled={gettingStocksHistoricalData || showEMA === false}
            />
          </Tooltip>
        </div>
      </div>
    </section>
  );
};

export default connector(StockActions);
