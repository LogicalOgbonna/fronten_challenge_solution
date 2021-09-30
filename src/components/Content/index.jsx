import PropTypes from "prop-types";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Pagination, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scatter, Timeline } from "..";
import { getRepositoriesByOrganizationAC } from "../../store/home/action";
import { correctSuggestions, filterByIssues } from "../../store/utils";
import { sort } from "../../store/utils/filter";
import "./index.scss";

const Content = ({ loading }) => {
  const dispatch = useDispatch();
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [issuesSort, setIssuesSort] = useState({
    min: "",
    max: "",
    minGreaterError: false,
  });
  const [sortTableData, setSortTableData] = useState({
    name: "descending",
    open_issues: "descending",
    stargazers_count: "descending",
  });
  const [selectedChart, setSelectedChart] = useState("");
  const { organization, repositories } = useSelector(
    ({ homeSlice }) => homeSlice
  );
  useEffect(() => {
    setFilteredRepos(repositories.data);
  }, [repositories.data]);
  if (!organization) return null;

  const onSearchInputChange = ({ target: { value } }) => {
    setFilteredRepos(correctSuggestions(repositories.data, value, "name"));
    setSearchInput(value);
  };
  const onMinMaxChange = ({ target: { value, name } }) => {
    let newIssuesSort = {
      ...issuesSort,
      [name]: value,
    };
    // Converting string to int
    // +newIssuesSort.min and +newIssuesSort.max would have worked fine here too
    if (
      parseInt(newIssuesSort.min, 10) > (parseInt(newIssuesSort.max, 10) || 0)
    )
      return setIssuesSort({ ...newIssuesSort, minGreaterError: true });
    setIssuesSort({ ...newIssuesSort, minGreaterError: false });

    /*
        This is not too clear either to search with the un-filtered array or the already filtered array to 
        preserve the user's search input.
    */

    /*   
        This is only filter the result of the filtered repositories by name
        setFilteredRepos(filterByIssues(filteredRepos, +newIssuesSort.min, +newIssuesSort.max))

        This will filter all the repositories by open_issues
     */
    setFilteredRepos(
      filterByIssues(repositories.data, +newIssuesSort.min, +newIssuesSort.max)
    );
  };

  const chartMap = (chart) => {
    switch (chart) {
      case "timeline":
        return <Timeline repositories={repositories.data} />;
      case "scattered":
        return <Scatter repositories={repositories.data} />;
      default:
        return <Timeline repositories={repositories.data} />;
    }
  };
  const sortIcons = {
    ascending: <CaretUpOutlined />,
    descending: <CaretDownOutlined />,
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
    dispatch(
      getRepositoriesByOrganizationAC({ name: organization.name, page })
    );
  };
  const onSelectChartChange = ({ target: { value } }) => {
    setSelectedChart(value);
  };
  const onClickSort = (type, sortBy) => {
    const sorted = sort({ array: repositories.data, type, sortBy });
    setFilteredRepos(sorted);
    setSortTableData((prev) => ({
      ...prev,
      [sortBy]: prev[sortBy] === "descending" ? "ascending" : "descending",
    }));
  };
  if (loading) return null;
  return (
    <div className="content">
      <div className="organization">
        <img className="img" src={organization.avatar} alt="avatar" />
        <div className="texts">
          <p className="name m-0">{organization.name}</p>
          <p className="description text-muted m-0">
            {organization.description}
          </p>
        </div>
      </div>

      <div className="table-graph_section">
        <div className="split">
          <div className="table-input_section">
            <div className="input_section">
              <div className="input">
                <label value={searchInput} className="label">
                  Filter repositories by name{" "}
                </label>
                <input
                  onChange={onSearchInputChange}
                  className="repository_name"
                  placeholder="Type to filter"
                />
              </div>
              <div className="input">
                <label className="label">
                  Filter by number of issues
                  {issuesSort.minGreaterError && (
                    <Tooltip
                      trigger="hover"
                      title="Conflicting min and max values"
                    >
                      <span className="error_ball">!</span>
                    </Tooltip>
                  )}
                </label>
                <div className="d-flex issues_range">
                  <input
                    name="min"
                    value={issuesSort.min}
                    onChange={onMinMaxChange}
                    type="number"
                    placeholder="Min"
                    className={`issues_range_input ${
                      issuesSort.minGreaterError ? "minGreaterError" : ""
                    }`}
                  />
                  <input
                    name="max"
                    value={issuesSort.max}
                    onChange={onMinMaxChange}
                    type="number"
                    placeholder="Max"
                    className={`issues_range_input ${
                      issuesSort.minGreaterError ? "minGreaterError" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="table_section">
              <table>
                <thead>
                  <tr>
                    <th
                      onClick={() => onClickSort(sortTableData.name, "name")}
                      className="first"
                    >
                      Repository
                      {sortIcons[sortTableData.name]}
                    </th>
                    <th
                      onClick={() =>
                        onClickSort(sortTableData.open_issues, "open_issues")
                      }
                    >
                      Open issues
                      {sortIcons[sortTableData.open_issues]}
                    </th>
                    <th
                      onClick={() =>
                        onClickSort(
                          sortTableData.stargazers_count,
                          "stargazers_count"
                        )
                      }
                    >
                      Stars
                      {sortIcons[sortTableData.stargazers_count]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepos.map((value) => (
                    <tr key={value.id}>
                      <td className="first" data-column="Repository">
                        {value.name}
                      </td>
                      <td data-column="Open issues">{value.open_issues}</td>
                      {/* <td data-column="Closed issues">{value.closed_issues}</td> */}
                      <td data-column="Stars">{value.stargazers_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredRepos.length && (
                <p className="text-center w-100 no-result">No Result</p>
              )}
            </div>
            {filteredRepos.length > 0 && (
              <div className="text-right my-2">
                <Pagination
                  showSizeChanger={false}
                  current={currentPage}
                  total={repositories?.totalCount || 1}
                  onChange={onPaginationChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className="split">
          <div className="graph_section">
            <div className="select">
              <select
                name="selectedChart"
                value={selectedChart}
                onChange={onSelectChartChange}
              >
                <option value="">Select Type</option>
                <option value="timeline">Time Line</option>
                <option value="scattered">Scattered Chart</option>
              </select>
            </div>

            <div className="graph">{chartMap(selectedChart)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Content.propTypes = {
  loading: PropTypes.bool,
};

export default Content;
