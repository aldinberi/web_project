/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import Axios from 'axios';
import config from '../config.js';

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import {
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

const url = process.env.BASE_URL || config.BASE_URL;

class Dashboard extends Component {
  state = {
    users: null,
    products: null,
    stores: null,
    orders: null,
    legend: null,
    dataPie: null
  }

  getBarData = async () => {
    let res = await Axios.get(url + 'admin/users');
    for (let i = 0; i < res.data.length; i++) {
      let signup_time = new Date(res.data[i].signup_time)
      console.log(signup_time.getMonth());
      dataBar.series[0][signup_time.getMonth() - 1]++;
    }
  }

  getProducts = () => {
    Axios.get(url + 'admin/products/count'
    ).then(response => {
      this.setState({
        products: response.data[0].count
      })
    }).catch(error => {
      console.log(error.response);
    }).finally(() => {
      console.log(`${this.state.products} number retrived`);
    });
  }

  getUsers = () => {
    Axios.get(url + 'admin/users/count'
    ).then(response => {
      this.setState({
        users: response.data[0].count
      })
    }).catch(error => {
      console.log(error.response);
    }).finally(() => {
      console.log(`${this.state.users} number retrived`);
    });
  }

  getStores = () => {
    Axios.get(url + 'admin/stores/count'
    ).then(response => {
      this.setState({
        stores: response.data[0].count
      })
    }).catch(error => {
      console.log(error.response);
    }).finally(() => {
      console.log(`${this.state.products} number retrived`);
    });
  }

  getOrders = () => {
    Axios.get(url + 'admin/products/count/completed'
    ).then(response => {
      this.setState({
        orders: response.data[0].count
      })
    }).catch(error => {
      console.log(error.response);
    }).finally(() => {
      console.log(`${this.state.orders} number retrived`);
    });
  }

  createBarLegend = (json) => {
    let legend = [];
    for (let i = 0; i < json["names"].length; i++) {
      let type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  createPieLegend = async () => {
    let res = await Axios.get(url + 'admin/stores/numberOfProducts');

    let json = {
      names: [],
      types: ["info", "danger", "warning", "success"]
    };

    let dataPie = {
      labels: [],
      series: []
    };

    for (let i = 0; i < res.data.length; i++) {
      json.names.unshift(res.data[i].name);
      let procent = (this.state.products / res.data[i].count) * 100;
      dataPie.series.unshift(procent);
      dataPie.labels.unshift(procent + "%");
    }

    let legend = [];
    for (let i = 0; i < json["names"].length; i++) {
      let type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    this.setState({
      legend: legend,
      dataPie: dataPie
    })
  }

  componentDidMount = () => {
    this.getProducts();
    this.getUsers();
    this.getStores();
    this.getOrders();
    this.createPieLegend();
    this.getBarData();
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-users text-success" />}
                statsText="Users"
                statsValue={this.state.users}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-drawer text-warning" />}
                statsText="Total Products"
                statsValue={this.state.products}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-shopbag text-danger" />}
                statsText="Total stores"
                statsValue={this.state.stores}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-cart text-info" />}
                statsText="Total orders"
                statsValue={this.state.orders}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                id="chartActivity"
                title="Signed up users"
                category="Number of sign ups per month"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createBarLegend(legendBar)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Store Statistics"
                category="Precentage of products per store"
                stats="Updated now"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={this.state.dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.state.legend}</div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
