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

class StoreProductsTableUser extends Component {

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

    getTotalPrice = async () => {
        let user = this.state.user;
        let res = await Axios.get('/customer/carts/price/' + user.id, { headers: { Authorization: localStorage.getItem('jwtToken') } });

        if (res.data[0] != null) {
            this.props.updateTotalPrice(res.data[0].total_price);
        }

    }

    getStoreProducts = async () => {
        let next = this.props.next;

        let res = await Axios.get('/stores/products?skip=' + next);

        next += 5;

        this.props.addNextStoreProduct(next);

        if (res.data.length !== 0) {

            this.props.loadStoreProducts(res.data);
        }
    }

    addToCart = async () => {
        let product = this.state.product;
        let user = this.state.user;
        try {
            let res = await Axios.post('/customer/carts', { store_products_id: product._id, user_id: user.id, quantity: parseInt(this.state.quantity), price: product.price, status: 0 }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.handleNotification('tr', 'success', 'Added product to cart');
            this.props.addCartProduct({
                _id: res.data._id,
                product_name: product.product_name,
                store_name: product.store_name,
                store_address: product.store_address,
                store_products_id: product._id,
                user_id: user.id,
                quantity: parseInt(this.state.quantity),
                price: product.price, status: 0, product_info: product.product_info
            })
            this.setState({ open: false });
            this.getTotalPrice();

        } catch (error) {
            this.handleNotification('tr', 'error', "Unable to add product to cart, you must be loged in for this operation");
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

    onAppyCoupon = async () => {
        let res;
        let found = false;
        let product = this.state.product;
        let coupon_code = this.state.coupon_code;
        try {
            res = await Axios.get('/customer/cupons/' + product._id, { headers: { Authorization: localStorage.getItem('jwtToken') } });
        } catch (error) {
            this.handleNotification('tr', 'error', "Unable to add product to cart, you must be loged in for this operation");
        }

        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].coupon_code === coupon_code) {
                product.price = res.data[i].new_price;
                found = true;
            }
        }

        if (found) {
            this.handleNotification('tr', 'success', 'Applied coupon');
        } else {
            this.handleNotification('tr', 'error', "Invalid coupon");
        }

        this.setState({
            product
        })

    }

    handleChangeCoupon = (event) => {
        this.setState({
            coupon_code: event.target.value
        });
    }

    handleChangeQuantity = (event) => {
        this.setState({
            quantity: event.target.value
        });
    }


    componentDidMount = () => {
        setTimeout(() => {
            this.setState(() => ({
                data_indicator: "No products available"
            }));
        }, 3000);
        let decoded;
        let token = localStorage.getItem('jwtToken');
        try {
            decoded = jwt_decode(token);
        } catch (e) {

        }
        if (this.props.products.length === 0) {
            this.getStoreProducts();
        }

        this.setState({ _notificationSystem: this.refs.notificationSystem, user: decoded })

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
                            <Row>
                                <br />
                                <ControlLabel>Coupon:</ControlLabel>
                            </Row>
                            <Row>
                                <Col xs={4}>
                                    <input className="form-control" type="text" onChange={this.handleChangeCoupon} placeholder="Enter coupon" name="coupon_code" />
                                </Col>
                                <Col xs={4}>
                                    <Button bsStyle="info" fill onClick={this.onAppyCoupon}>
                                        Apply coupon
                                    </Button>
                                </Col>
                            </Row>
                            <div className="clearfix" />
                        </Grid>

                    </Modal.Body>
                    <Modal.Footer>
                        <Grid fluid>
                            <Row>
                                <Col smPush={8} sm={2}>
                                    <input className="form-control" type="number" min="1" defaultValue="1" onChange={this.handleChangeQuantity} placeholder="Quantity" name="quantity" />
                                </Col>
                                <Col>
                                    <Button bsStyle="info" fill type="submit" onClick={this.addToCart}>
                                        Add to cart
                                    </Button>
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
                                title="Products in store"
                                ctAllIcons
                                category={
                                    <span>
                                        Table of product in the system
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
                                            <Button bsStyle="primary" onClick={() => { this.getStoreProducts() }} pullRight>More</Button>
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
        products: state.storeProductReducer.products,
        next: state.storeProductReducer.next
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStoreProducts: (products) => { dispatch({ type: 'LOAD_STORE_PRODUCTS', products: products }) },
        addNextStoreProduct: (next) => { dispatch({ type: 'ADD_NEXT_STORE_PRODUCT', next: next }) },
        addCartProduct: (product) => { dispatch({ type: 'ADD_CART_PRODUCT', product: product }) },
        updateTotalPrice: (price) => { dispatch({ type: 'UPDATE_CART_PRICE', price: price }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreProductsTableUser)
