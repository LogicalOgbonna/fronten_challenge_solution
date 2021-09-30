import React from "react";
import { useSelector } from "react-redux";
import { Empty, Content } from "../../components";

const Home = () => {
  const { repositoriesLoading, organization } = useSelector(
    ({ homeSlice }) => homeSlice
  );
  return (
    <div>
      <Empty loading={repositoriesLoading} organization={organization} />
      <Content loading={repositoriesLoading} />
    </div>
  );
};

export default Home;
