import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getOrganizationsAC,
  getRepositoriesByOrganizationAC,
  searchOrganizationAC,
  setSelectedOrganizationAC,
} from "../../store/home/action";
import { correctSuggestions } from "../../store/utils";
import "./index.scss";

const Autocomplete = ({ placeholder, organizations, loading }) => {
  const dispatch = useDispatch();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const onSearchInputChange = ({ target: { value } }) => {
    setSearchInput(value);
    setSuggestions(correctSuggestions(organizations, value, "name"));
    dispatch(searchOrganizationAC(value));
  };
  useEffect(() => {
    setSuggestions(organizations);
  }, [organizations]);
  useEffect(() => {
    dispatch(getOrganizationsAC());
  }, [dispatch]);

  const onSuggestionClick = (index) => {
    const name = suggestions[index].name;
    setSearchInput(name);
    setSuggestions(correctSuggestions(organizations, name, "name"));
    // Get repositories associated to ${name}
    dispatch(getRepositoriesByOrganizationAC({ name, page: 1 }));

    // Set selected organization globally
    dispatch(setSelectedOrganizationAC(suggestions[index]));
    setShowSuggestions(false);
  };
  return (
    <React.Fragment>
      <input
        onClick={() => setShowSuggestions(true)}
        value={searchInput}
        onChange={onSearchInputChange}
        className="autocomplete-input"
        placeholder={placeholder}
      />
      {showSuggestions && searchInput && (
        <SuggestionLIst
          searchInput={searchInput}
          loading={loading}
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
        />
      )}
    </React.Fragment>
  );
};

Autocomplete.propTypes = {
  loading: PropTypes.bool,
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.number,
    })
  ),
  placeholder: PropTypes.string,
};

const SuggestionLIst = ({
  suggestions,
  onSuggestionClick,
  loading,
  searchInput,
}) => (
  <ul className="suggestions">
    <LIContent
      suggestions={suggestions}
      loading={loading}
      onSuggestionClick={onSuggestionClick}
    />{" "}
    <LINoContent
      searchInput={searchInput}
      suggestions={suggestions}
      loading={loading}
    />
  </ul>
);
SuggestionLIst.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.any,
      map: PropTypes.func,
    })
  ),
  onSuggestionClick: PropTypes.func.isRequired,
};

const LIContent = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions.length) return null;
  return (
    <>
      {suggestions.map((suggestion, index) => (
        <li
          className="suggestion"
          key={suggestion.id}
          onClick={() => onSuggestionClick(index)}
        >
          {suggestion.name}
        </li>
      ))}
    </>
  );
};

LIContent.propTypes = {
  onSuggestionClick: PropTypes.func,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
};

const LINoContent = ({ suggestions, loading, searchInput }) => {
  if (loading)
    return (
      <li className="suggestion loading">
        {" "}
        <LoadingOutlined />
      </li>
    );
  if (suggestions.length) return null;
  return <li>No Organization match your search {searchInput}</li>;
};

LINoContent.propTypes = {
  loading: PropTypes.bool,
  searchInput: PropTypes.string,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
};

Autocomplete.defaultProps = {
  placeholder: "Search organizations",
};

export default Autocomplete;
