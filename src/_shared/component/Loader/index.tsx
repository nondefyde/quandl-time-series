import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./styles.scss";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

export default () => (
  <div className={"app-loader"}>
    <Spin indicator={antIcon} />
    <span className={"app-loader-text"}>Retrieving stock data</span>
  </div>
);
