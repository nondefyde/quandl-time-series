import { Radio } from "antd";
import ApexChart from "react-apexcharts";
import { formatNumber } from "../../../../../_shared/utils";
import { getStockSymbols } from "../../../../../redux/actions/stocks";
import { RootState } from "../../../../../redux/types";
import { connect, ConnectedProps } from "react-redux";
import { FC, useState } from "react";
import { RadioChangeEvent } from "antd/es/radio";
import Loader from "../../../../../_shared/component/Loader";
import { upperFirst, get, first, last } from "lodash";

const dispatchProps = {
  getStockSymbols,
};
// state derived props.
const stateProps = (state: RootState) => ({
  historicalData: get(state.stocks.historicalData, "data", []),
  gettingStocksHistoricalData:
    state.ui.loading["GET_STOCK_HISTORICAL_DATA_HISTORICAL_DATA"],
  companyName: state.stocks.currentSymbolName,
});

// Creates connection to state
const connector = connect(stateProps, dispatchProps);

// Evaluates the props derived from stateProps and dispatchProps
type PropsFromRedux = ConnectedProps<typeof connector>;

// Creates a union props

type StockChartProps = PropsFromRedux & {};
const StockChart: FC<StockChartProps> = (props) => {
  const { gettingStocksHistoricalData, companyName, historicalData } = props;

  const min = first(last(historicalData)) as Date | undefined;
  const max = first(first(historicalData)) as Date | undefined;

  const chartSeries = [
    {
      name: companyName,
      data: historicalData,
    },
  ];
  const brushSeries = [
    {
      data: historicalData,
    },
  ];
  const chartOptions = {
    chart: {
      id: "quandl-time-series",
      type: "line",
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      height: 230,
      background: "transparent",
      toolbar: {
        autoSelected: "zoom",
        show: false,
      },
      zoom: {
        type: "x",
        enabled: true,
      },
    },
    theme: {
      mode: "dark",
    },
    title: {
      text: `${upperFirst(companyName)}(closing price)`,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 500,
        fontFamily: "Poppins, Helvetica, Arial, sans-serif",
        colors: "#ffffff",
      },
    },
    colors: ["#3e82ff", "#06f17b", "#f9d900"],
    legend: {
      showForSingleSeries: true,
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      fontFamily: "Poppins, Helvetica, Arial, sans-serif",
      labels: {
        colors: "#ffffff",
        useSeriesColors: true,
      },
    },
    stroke: {
      width: 2,
      curve: "straight",
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
    },
    yaxis: {
      labels: {
        formatter: (value: number) =>
          formatNumber(value, {
            style: "currency",
            locale: "en-US",
            maximumSignificantDigits: 2,
          }),
      },
      style: {
        colors: ["red"],
        fontSize: "12px",
        fontFamily: "Poppins, Helvetica, Arial, sans-serif",
        fontWeight: 400,
        cssClass: "apexcharts-xaxis-label",
      },
    },

    tooltip: {
      shared: false,
      theme: "dark",
      followCursor: true,
      x: {
        show: true,
        format: "dd MMM yyyy",
      },
      style: {
        fontSize: "12px",
        fontFamily: "Poppins, Helvetica, Arial, sans-serif",
        // color: '#ffffff'
      },
      y: {
        formatter: (value: number) =>
          formatNumber(value, {
            style: "currency",
            locale: "en-US",
            maximumSignificantDigits: 2,
          }),
      },
    },
    xaxis: {
      type: "datetime",
      borderColor: "red",
      format: "dd MM YYYY",
      tickAmount: 6,
      style: {
        colors: ["red"],
        fontSize: "12px",
        fontFamily: "Poppins, Helvetica, Arial, sans-serif",
        fontWeight: 400,
        cssClass: "apexcharts-xaxis-label",
      },
    },
    grid: {
      show: true,
      borderColor: "#2e2e2e",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const brushOptions = {
    chart: {
      id: "quandl-time-series-brush",
      height: 130,
      type: "area",
      background: "transparent",
      brush: {
        target: "quandl-time-series",
        enabled: true,
      },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      selection: {
        enabled: true,
        xaxis: {
          min: min ? new Date(min).getTime() : min,
          max: max ? new Date(max).getTime() : max,
        },
      },
    },
    theme: {
      mode: "dark",
    },
    colors: ["#3e82ff", "#06f17b", "#f9d900"],
    stroke: {
      curve: "straight",
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },

    yaxis: {
      tickAmount: 2,
      labels: {
        formatter: (value: number) =>
          formatNumber(value, {
            style: "currency",
            locale: "en-US",
            maximumSignificantDigits: 2,
          }),
      },
    },
  };

  const [timeline, setTimeline] = useState<string>("all");

  const onTimelineChange = (event: RadioChangeEvent) => {
    const timeline = event?.target?.value ?? "all";
    setTimeline(timeline);
  };
  return (
    <section className={"app-content-chart-section"}>
      {gettingStocksHistoricalData && (
        <div className={"app-content-chart-section-loader"}>
          <Loader />
        </div>
      )}
      {!gettingStocksHistoricalData && (
        <>
          <div className={"app-content-chart-section-controls"}>
            <Radio.Group
              onChange={onTimelineChange}
              value={timeline}
              defaultValue="all"
              optionType="button"
            >
              <Radio.Button value="5d">5D</Radio.Button>
              <Radio.Button value="1m">1M</Radio.Button>
              <Radio.Button value="3m">3M</Radio.Button>
              <Radio.Button value="6m">6M</Radio.Button>
              <Radio.Button value="1y">1Y</Radio.Button>
              <Radio.Button value="3y">3Y</Radio.Button>
              <Radio.Button value="5y">5Y</Radio.Button>
              <Radio.Button value="all">All</Radio.Button>
            </Radio.Group>
          </div>
          <div className={"charts"}>
            <div className={"chart"}>
              <ApexChart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={450}
              />
            </div>
            <div className={"chart"}>
              <ApexChart
                options={brushOptions}
                series={brushSeries}
                type="area"
                height={130}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};
export default connector(StockChart);
