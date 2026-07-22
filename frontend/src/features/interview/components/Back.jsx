import React, { Fragment } from "react";
import { useNavigate } from "react-router";
import "../style/back.scss"

const Back = () => {
  const navigate = useNavigate();

  const backClickHandler = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <Fragment>
      <button
        onClick={backClickHandler}
        className="button back-btn"
      >
        Back
      </button>
    </Fragment>
  );
};

export default Back;
