import "./styles.scss";
import Header from "./header";
import Content from "./content";

const Main = () => {
  return (
    <div className={"app-layout"}>
      <Header />
      <Content />
    </div>
  );
};

export default Main;
