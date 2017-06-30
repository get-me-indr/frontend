import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import Logo from '../../indr-logo.png';

const Header = ({ onLogin, onLogout, isLoggedIn }) => {
  const logoutBtn = isLoggedIn ?
    <FlatButton label="Logout" onClick={ onLogout } />
    : <FlatButton label="Login" onClick={ onLogin } />;

  return (
    <AppBar
      title={ <img src={ Logo } className="logoImg" /> }
      iconElementRight={ logoutBtn } />
  );
};

Header.propTypes = {
  onLogout: PropTypes.func,
  onLogin: PropTypes.func,
  isLoggedIn: PropTypes.bool
};

Header.defaultProps = {
  onLogin: () => false,
  onLogout: () => false,
  isLoggedIn: false
}

export default Header;
