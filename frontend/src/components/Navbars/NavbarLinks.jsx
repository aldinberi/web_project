import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";
import { hasValidJwt } from "../../utils/jwtValidator"

class NavbarLinks extends Component {

  signIn = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      window.location = "http://localhost:3001/login"
    } else {
      window.location = "https://gran-app-react.herokuapp.com/login"
    }
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location = '/public/product';
  }

  render() {

    return (
      <div>
        <Nav pullRight>
          {hasValidJwt() && <NavItem eventKey={3} onClick={this.logout}> Log out </NavItem>}
          {!hasValidJwt() && <NavItem eventKey={3} onClick={this.signIn}>Log in</NavItem>}
        </Nav>
      </div>
    );
  }
}

export default NavbarLinks;
