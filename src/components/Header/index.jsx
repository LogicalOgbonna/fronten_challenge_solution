import "./style.scss";
import React from "react";
import { Autocomplete } from "..";
import { useSelector } from "react-redux";

const Header = () => {
  const { organizations, organizationsLoading } = useSelector(
    ({ homeSlice }) => homeSlice
  );
  return (
    <div className="tool-bar">
      <div className="row h-40 align-items-center">
        <div className="col-12 col-sm-12 col-md-4 col-lg-6 ml-4 ">
          <Autocomplete
            loading={organizationsLoading}
            organizations={organizations}
            placeholder="Search organizations"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
