import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotificationSystem from 'react-notification-system';
import { style } from "variables/Variables.jsx";

import MainNavbar from "components/Navbars/MainNavbar";
import Sidebar from "components/Sidebar/Sidebar";

import Auth from "components/Login/Auth";

import routes from "routes.js";

import image from "assets/img/sidebar-3.jpg";

import jwt_decode from "jwt-decode";

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open",
      routes: routes,
      user: {}
    };
  }

  handleNotification(position, level, message) {
    //var level = 'success'; // 'success', 'warning', 'error' or 'info'
    let title;
    if (level === 'success') {
      title = <span data-notify="icon" className="pe-7s-check"></span>;
    } else if (level === 'error') {
      title = <span data-notify="icon" className="pe-7s-close"></span>;
    }
    this.state._notificationSystem.addNotification({
      title: (title),
      message: (
        <div>
          {message}
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15,
    });
  }

  getRoutes = routes => {
    let finalRoutes;

    finalRoutes = routes.map((prop, key) => {
      return (
        <Route
          path={prop.layout + prop.path}
          render={props => (
            <prop.component
              {...props}
            />
          )}
          key={key}
        />
      );
    });

    console.log(finalRoutes);

    return (finalRoutes);

  };

  redirectByUser = () => {
    if (this.state.user != null) {
      if (this.state.user.type === "admin") {
        return <Redirect exact from="/" to="/admin/dashboard" />;
      }
    } else {
      return <Redirect exact from="/" to="/public/products" />;
    }
  }


  componentDidMount() {
    let filteredRoutes;
    let decoded;
    let token = localStorage.getItem('jwtToken');
    try {
      decoded = jwt_decode(token);
    } catch (e) {

    }

    console.log(decoded);

    if (decoded != null) {
      if (decoded.type === "admin") {
        filteredRoutes = routes.filter(route => {
          return route.layout === "/admin"
        });
      }

    } else {
      filteredRoutes = routes.filter(route => {
        return route.layout === "/public"
      });
    }

    this.setState({
      routes: filteredRoutes,
      user: decoded
    })

  }
  componentDidUpdate(e) {
  }
  render() {
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar {...this.props} routes={this.state.routes} image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage} />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <MainNavbar
            {...this.props}
          />
          <Switch>
            <Route exact path='/auth' component={Auth} />
            {this.redirectByUser()}
            {this.getRoutes(this.state.routes)}
          </Switch>
        </div>
      </div>
    );
  }
}

export default MainLayout;
