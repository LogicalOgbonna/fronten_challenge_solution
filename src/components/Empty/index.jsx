import PropTypes from "prop-types";
import React from "react";
import "./index.scss";
import { LoadingOutlined } from "@ant-design/icons";

const Empty = ({ loading, organization }) => {
  if (organization && !loading) return null;
  return (
    <div className="empty">
      {loading ? (
        <LoadingOutlined style={{ fontSize: 24 }} />
      ) : (
        "Search for an organization"
      )}
    </div>
  );
};

Empty.propTypes = {
  loading: PropTypes.bool,
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.number,
    })
  ),
};

export default Empty;
