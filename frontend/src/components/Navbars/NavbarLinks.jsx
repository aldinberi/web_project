import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";


class NavbarLinks extends Component {

  render() {
    let link;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      link = "http://localhost:3001/login"
    } else {
      link = "https://gran-app-react.herokuapp.com/login"
    }
    console.log(link);
    return (
      <div>
        <Nav pullRight>
          <NavDropdown
            eventKey={2}
            title="My Cart"
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1}>Action</MenuItem>
            <MenuItem eventKey={2.2}>Another action</MenuItem>
            <MenuItem eventKey={2.3}>Something</MenuItem>
            <MenuItem eventKey={2.4}>Another action</MenuItem>
            <MenuItem eventKey={2.5}>Something</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={2.5}>Separated link</MenuItem>
          </NavDropdown>
          <NavItem eventKey={3} href={link}>
            Log in
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default NavbarLinks;
