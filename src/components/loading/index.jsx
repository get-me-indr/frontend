import React, { PropTypes } from 'react';

const Loading = ({ text }) => (
  <div className="loading mt-5">
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
    <div className="loadingText">
      { text }
    </div>
  </div>
);

Loading.propTypes = {
  text: PropTypes.any
};

Loading.defaultProps = {
  text: null
}

export default Loading;
