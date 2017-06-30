import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

const Header = ({ onLogout, isLoggedIn }) => {
  const logoutBtn = isLoggedIn ?
    <FlatButton label="Logout" onClick={ onLogout } />
    : null;

  return (
    <AppBar
      title={ <span>Event Roulette</span> }
      iconElementRight={ logoutBtn } />
  );
};

Header.propTypes = {
  onLogout: PropTypes.func,
  isLoggedIn: PropTypes.bool
};

Header.defaultProps = {
  onLogout: () => false,
  isLoggedIn: false
}

export default Header;
