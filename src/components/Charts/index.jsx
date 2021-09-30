/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { Chart } from "react-google-charts";

const MONTHS = {
  0: "Jan",
  1: "FEB",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

export const TimeLineChart = ({ repositories }) => {
  const [data, setData] = useState([
    [
      { type: "string", id: "Month" },
      { type: "string", id: "Name" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
  ]);

  useEffect(() => {
    const value = repositories.map((value) => [
      MONTHS[new Date(value?.created_at).getMonth()],
      value.name,
      new Date(value?.created_at),
      new Date(value?.updated_at),
    ]);
    setData([...data, ...value]);
  }, [repositories]);
  return (
    <Chart
      width={"500px"}
      height={"375px"}
      chartType="Timeline"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        showRowNumber: true,
        timeline: {
          singleColor: "#0085FF",
        },
      }}
    />
  );
};

TimeLineChart.propTypes = {
  repositories: PropTypes.array,
};
export const ScatterChart = ({ repositories }) => {
  const [data, setData] = useState([["Closed Issues", "Open Issues"]]);
  const [maxValue, setMaxValue] = useState(50);
  useEffect(() => {
    const value = repositories.map((value) => [
      value?.closed_issues,
      value.open_issues,
    ]);
    const max = Math.max(
      ...repositories.reduce(
        (prev, cur) => [...prev, cur.closed_issues, cur.open_issues],
        []
      )
    );
    setMaxValue(max);
    setData([...data, ...value]);
  }, [repositories]);
  return (
    <Chart
      width={"500px"}
      height={"400px"}
      chartType="ScatterChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        hAxis: { title: "Closed Issues", minValue: 0, maxValue },
        vAxis: { title: "Open Issues", minValue: 0, maxValue },
        legend: "none",
      }}
    />
  );
};
ScatterChart.propTypes = {
  repositories: PropTypes.array,
};

export const Scatter = ({ repositories }) => {
  const options = {
    chart: {
      height: 350,
      type: "scatter",
      zoom: {
        enabled: true,
        type: "xy",
      },
    },
    xaxis: {
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1);
        },
      },
    },
    yaxis: {
      tickAmount: 7,
    },
  };
  const [series, setSeries] = useState([]);
  useEffect(() => {
    setSeries([
      {
        name: "OPEN | CLOSED",
        data: repositories.map((value) => [
          value?.closed_issues,
          value.open_issues,
        ]),
      },
    ]);
  }, [repositories]);
  return (
    <ApexChart options={options} series={series} type="scatter" width="500" />
  );
};

Scatter.propTypes = {
  repositories: PropTypes.array,
};

export const Timeline = ({ repositories }) => {
  const [series, setSeries] = useState([]);
  const options = {
    chart: {
      height: 350,
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function () {
        return "";
      },
      style: {
        colors: ["#f3f4f5", "#fff"],
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      show: false,
    },
    grid: {
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 1,
      },
    },
  };

  useEffect(() => {
    const data = repositories.map((value) => ({
      x: value.name,
      y: [
        new Date(value?.created_at).getTime(),
        new Date(value?.updated_at).getTime(),
      ],
      fillColor: "#0085FF",
    }));

    setSeries(data);
  }, [repositories]);
  return (
    <ApexChart
      options={options}
      series={[
        {
          data: series,
        },
      ]}
      type="rangeBar"
      width="500"
    />
  );
};

Timeline.propTypes = {
  repositories: PropTypes.array,
};
