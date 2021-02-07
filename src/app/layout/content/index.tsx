import "./styles.scss";
import StockChart from "./lib/StockChart";
import StockActions from "./lib/StockActions";

const Content = () => {
  return (
    <main className={"app-content"}>
      <StockChart />
      <StockActions />
    </main>
  );
};

export default Content;
