import React, { Component } from 'react'
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import Axios from 'axios';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Card } from "components/Card/Card.jsx";
import Button from 'components/CustomButton/CustomButton';
import NotificationSystem from 'react-notification-system';
import { style } from "variables/Variables.jsx";
import { Modal } from "react-bootstrap";
import jwt_decode from "jwt-decode";

import image from "assets/img/spinner.gif";

class OrderHistoryTable extends Component {

    state = {
        open: false,
        product: {
            product_info: {}
        },

        coupon_code: "",
        quantity: 1,
        _notificationSystem: null,
        user: {},
        data_indicator: <img alt="Loading...." style={{ maxHeight: 30 }} src={image} />
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

    viewFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="success" onClick={() => { this.onOpenProductModal(cell) }}>View</Button>
            </span>

        );
    }


    getCartProducts = async () => {
        let next = this.props.next;
        let user = this.state.user;

        let res = await Axios.get('/customer/carts/completed/' + user.id + '?skip=' + next, { headers: { Authorization: localStorage.getItem('jwtToken') } });

        next += 5;

        this.props.addNextCartProduct(next);

        if (res.data.length !== 0) {
            this.props.loadCartProducts(res.data);
        }
    }


    onCloseModal = () => {
        this.setState({ open: false });
    };

    onOpenProductModal = (id) => {
        let products = this.props.products;
        let product = products.filter(product => {
            return product._id === id
        });



        this.setState({
            product: product[0],
            open: true,
        })

    };

    componentDidMount = () => {
        setTimeout(() => {
            this.setState(() => ({
                data_indicator: "No ordered products available"
            }));
        }, 3000);
        let decoded;
        let token = localStorage.getItem('jwtToken');
        try {
            decoded = jwt_decode(token);
        } catch (e) {

        }

        this.setState({ _notificationSystem: this.refs.notificationSystem, user: decoded }, () => {
            if (this.props.products.length === 0) {
                this.getCartProducts();
            }
        })

    }




    render() {
        const { SearchBar } = Search;
        const columns = [{
            dataField: 'product_name',
            text: 'Product',
            sort: true
        }, {
            dataField: 'price',
            text: 'Price',
            sort: true
        }, {
            dataField: 'store_name',
            text: 'Store name',
        }, {
            dataField: 'store_address',
            text: 'Store address',
        }, {
            dataField: 'quantity',
            text: 'Quantity',
        }, {
            dataField: '_id',
            text: 'Edit',
            formatter: this.viewFormatter
        }];

        return (
            <div>
                <Modal show={this.state.open} onHide={this.onCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.product.product_info.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <img alt="imeage" style={{ maxHeight: 250, maxWidth: 250 }} src={this.state.product.product_info.image} />
                        </div>
                        <Grid fluid>
                            <Row>
                                <Col>
                                    <ControlLabel>Description:</ControlLabel>
                                    <br />
                                    {this.state.product.product_info.description}
                                    <br />
                                    <br />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <ControlLabel>Price:</ControlLabel>
                                    <br />
                                    {this.state.product.price}
                                </Col>
                                <Col md={4}>
                                    <ControlLabel>Category:</ControlLabel>
                                    <br />
                                    {this.state.product.product_info.category}
                                </Col>
                                <Col md={4}>
                                    <ControlLabel>Subcategory:</ControlLabel>
                                    <br />
                                    {this.state.product.product_info.subcategory}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <ControlLabel>Producer:</ControlLabel>
                                    <br />
                                    {this.state.product.product_info.producer}
                                </Col>
                                <Col md={4}>
                                    <ControlLabel>Quantity:</ControlLabel>
                                    <br />
                                    {this.state.product.product_info.quantity}
                                    {this.state.product.product_info.unit}
                                </Col>
                                <Col md={4}>
                                    <ControlLabel>Country of origin:</ControlLabel>
                                    <br />
                                    {this.state.product.product_info.country_of_origin}
                                </Col>
                            </Row>
                            <div className="clearfix" />
                        </Grid>

                    </Modal.Body>
                    <Modal.Footer>
                        <Grid fluid>
                            <Row>
                                <Col>
                                    <Button bsStyle="info" onClick={() => { this.onCloseModal() }} >Close modal</Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Footer>
                </Modal>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Order history"
                                ctAllIcons
                                category={
                                    <span>
                                        Table of ordered products
                                    </span>
                                }
                                content={
                                    <Row>
                                        <Col sm={12}>
                                            <ToolkitProvider
                                                keyField="_id"
                                                data={this.props.products}
                                                columns={columns}
                                                search
                                            >
                                                {
                                                    toolProps => (
                                                        < div >
                                                            <SearchBar {...toolProps.searchProps} />
                                                            <BootstrapTable
                                                                {...toolProps.baseProps}
                                                                striped
                                                                hover
                                                                wrapperClasses="table-responsive"
                                                                noDataIndication={this.state.data_indicator}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </ToolkitProvider>
                                            <Button bsStyle="primary" onClick={() => { this.getCartProducts() }} pullRight>More</Button>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.userCartHistoryReducer.products,
        next: state.userCartHistoryReducer.next,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadCartProducts: (products) => { dispatch({ type: 'LOAD_CART_ORDERED_PRODUCTS', products: products }) },
        addNextCartProduct: (next) => { dispatch({ type: 'ADD_NEXT_CART_ORDERED_PRODUCT', next: next }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryTable)
