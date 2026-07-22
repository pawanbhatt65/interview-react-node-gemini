import React, { Fragment } from "react";
import "../style/logout.scss";
import { logout } from "../../auth/services/auth.api";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  const logoutClickHandler = () => {
    logout();
    navigate("/login");
  };
  return (
    <Fragment>
      <button
        onClick={logoutClickHandler}
        className="button primary-button logout-btn"
      >
        Logout
      </button>
    </Fragment>
  );
};

export default Logout;
