import { Radio, Empty } from "antd";
import ApexChart from "react-apexcharts";
import { formatNumber } from "../../../../../_shared/utils";
import { getStockSymbols } from "../../../../../redux/actions/stocks";
import { RootState } from "../../../../../redux/types";
import { connect, ConnectedProps } from "react-redux";
import { FC, useEffect, useState } from "react";
import { RadioChangeEvent } from "antd/es/radio";
import Loader from "../../../../../_shared/component/Loader";
import { upperFirst, get, first, last, isEmpty } from "lodash";
import moment from "moment";

const dispatchProps = {
  getStockSymbols,
};
// state derived props.
const stateProps = (state: RootState) => ({
  historicalData: get(state.stocks.historicalData, "data", []),
  gettingStocksHistoricalData:
    state.ui.loading["GET_STOCK_HISTORICAL_DATA_HISTORICAL_DATA"],
  companyName: state.stocks.currentSymbolName,
  showSMA: state.stocks.displaySMA,
  sma: state.stocks.sma,
  showEMA: state.stocks.displayEMA,
  ema: state.stocks.ema,
});

// Creates connection to state
const connector = connect(stateProps, dispatchProps);

// Evaluates the props derived from stateProps and dispatchProps
type PropsFromRedux = ConnectedProps<typeof connector>;

// Creates a union props
type StockChartProps = PropsFromRedux & {};
const StockChart: FC<StockChartProps> = (props) => {
  const {
    gettingStocksHistoricalData,
    companyName,
    historicalData,
    sma,
    showSMA,
    showEMA,
    ema,
  } = props;

  const [minMax, setZoomMinMax] = useState({
    min: first(last(historicalData)) as Date | undefined,
    newMin: first(last(historicalData)) as Date | undefined,
    max: first(first(historicalData)) as Date | undefined,
  });

  const { min, max, newMin } = minMax;

  useEffect(() => {
    if (!isEmpty(historicalData)) {
      setZoomMinMax({
        min: first(last(historicalData)) as Date | undefined,
        newMin: first(last(historicalData)) as Date | undefined,
        max: first(first(historicalData)) as Date | undefined,
      });
    }
  }, [historicalData]);

  const fiveDays = moment(max).subtract(5, "days");
  const oneMonth = moment(max).subtract(1, "month");
  const threeMonth = moment(max).subtract(3, "month");
  const sixMonth = moment(max).subtract(6, "month");
  const oneYear = moment(max).subtract(1, "year");
  const threeYear = moment(max).subtract(3, "year");
  const fiveYear = moment(max).subtract(5, "year");

  const chartSeries = [
    {
      name: companyName,
      data: historicalData,
    },
    ...(showSMA ? [{ name: companyName + " (SMA)", data: sma }] : []),
    ...(showEMA ? [{ name: companyName + " (EMA)", data: ema }] : []),
  ];
  const brushSeries = [
    { name: companyName, data: historicalData },
    ...(showSMA ? [{ name: companyName + " (SMA)", data: sma }] : []),
    ...(showEMA ? [{ name: companyName + " (EMA)", data: ema }] : []),
  ];
  const chartOptions = {
    chart: {
      id: "quandl-time-series",
      type: "line",
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      height: 230,
      stacked: false,
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
      text: `${upperFirst(companyName)} (closing price)`,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 500,
        fontFamily: "Poppins, Helvetica, Arial, sans-serif",
        colors: "#ffffff",
      },
    },
    colors: showSMA
      ? ["#3e82ff", "#f9d900", "#FF4560"]
      : ["#3e82ff", "#FF4560"],
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
      width: [2, 1, 1],
      curve: ["straight", "smooth", "smooth"],
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: [0, 0, 0],
      strokeColors: "transparent",
    },
    annotations: {
      position: "front",
      points: [
        {
          x: new Date(first(first(historicalData)) as Date).getTime(),
          y: last(first(historicalData)),
          seriesIndex: 0,
          marker: {
            size: 2,
            fillColor: "#fff",
            strokeColor: "#3e82ff",
            radius: 2,
            cssClass: "apexcharts-custom-class",
          },
          label: {
            borderColor: "#3e82ff",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#3e82ff",
            },
            text: formatNumber(last(first(historicalData)) ?? 0, {
              style: "currency",
              locale: "en-US",
              maximumSignificantDigits: 2,
            }),
          },
        },
        showSMA && {
          seriesIndex: 1,
          x: new Date(first(first(sma)) as Date).getTime(),
          y: last(first(sma)),
          marker: {
            size: 2,
            fillColor: "#fff",
            strokeColor: "#f9d900",
            radius: 2,
            cssClass: "apexcharts-custom-class",
          },
          label: {
            borderColor: "#f9d900",
            offsetY: 0,
            style: {
              color: "#555",
              background: "#f9d900",
            },
            text: formatNumber(last(first(sma)) ?? 0, {
              style: "currency",
              locale: "en-US",
              maximumSignificantDigits: 2,
            }),
          },
        },
        showEMA && {
          seriesIndex: showSMA ? 2 : 1,
          x: new Date(first(first(ema) as any[]) as Date).getTime(),
          y: last(first(ema) as any[]) as number,
          marker: {
            size: 2,
            fillColor: "#fff",
            strokeColor: "#FF4560",
            radius: 2,
            cssClass: "apexcharts-custom-class",
          },
          label: {
            borderColor: "#FF4560",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            text: formatNumber((last(first(ema) as any[]) as string) ?? 0, {
              style: "currency",
              locale: "en-US",
              maximumSignificantDigits: 2,
            }),
          },
        },
      ],
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
      opposite: true,
      axisBorder: {
        color: "#f2f2f2",
        show: true,
        offsetY: -1,
      },
    },

    tooltip: {
      shared: true,
      theme: "dark",
      followCursor: true,
      enabledOnSeries: true,
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
        show: true,
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      selection: {
        enabled: true,
        xaxis: {
          min: newMin ? new Date(newMin).getTime() : min,
          max: max ? new Date(max).getTime() : max,
        },
      },
    },
    theme: {
      mode: "dark",
    },
    colors: showSMA
      ? ["#3e82ff", "#f9d900", "#FF4560"]
      : ["#3e82ff", "#FF4560"],
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

    switch (timeline) {
      case "5d":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: fiveDays.toDate() };
        });
        break;
      case "1m":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: oneMonth.toDate() };
        });
        break;
      case "3m":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: threeMonth.toDate() };
        });
        break;
      case "6m":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: sixMonth.toDate() };
        });
        break;
      case "1y":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: oneYear.toDate() };
        });
        break;
      case "3y":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: threeYear.toDate() };
        });
        break;
      case "5y":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: fiveYear.toDate() };
        });
        break;
      case "all":
        setZoomMinMax((prev) => {
          return { ...prev, newMin: prev.min };
        });
        break;
      default:
    }
  };

  return (
    <section className={"app-content-chart-section"}>
      {gettingStocksHistoricalData && (
        <div className={"app-content-chart-section-loader"}>
          <Loader />
        </div>
      )}
      {!gettingStocksHistoricalData && isEmpty(historicalData) && (
        <div className={"app-content-chart-section-empty"}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
      {!gettingStocksHistoricalData && !isEmpty(historicalData) && (
        <>
          <div className={"app-content-chart-section-controls"}>
            <Radio.Group
              onChange={onTimelineChange}
              value={timeline}
              defaultValue="all"
              optionType="button"
            >
              <Radio.Button value="5d" disabled={fiveDays.isBefore(min)}>
                5D
              </Radio.Button>
              <Radio.Button value="1m" disabled={oneMonth.isBefore(min)}>
                1M
              </Radio.Button>
              <Radio.Button value="3m" disabled={threeMonth.isBefore(min)}>
                3M
              </Radio.Button>
              <Radio.Button value="6m" disabled={sixMonth.isBefore(min)}>
                6M
              </Radio.Button>
              <Radio.Button value="1y" disabled={oneYear.isBefore(min)}>
                1Y
              </Radio.Button>
              <Radio.Button value="3y" disabled={threeYear.isBefore(min)}>
                3Y
              </Radio.Button>
              <Radio.Button value="5y" disabled={fiveYear.isBefore(min)}>
                5Y
              </Radio.Button>
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
