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

class UserCartTable extends Component {

    state = {
        open: false,
        product: {
            product_info: {}
        },

        coupon_code: "",
        quantity: 1,
        _notificationSystem: null,
        user: {},
        data_indicator: <img alt="Loading..." style={{ maxHeight: 30 }} src={image} />
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

    removeFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="danger" onClick={() => { this.deleteCartProduct(cell) }} fill>Remove</Button>
            </span>

        );
    }

    deleteCartProduct = async (id) => {
        try {
            this.props.deleteCartProduct(id);
            await Axios.delete('/customer/carts/' + id, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.handleNotification('tr', 'success', 'Successfully removed product');
            this.setState({ open: false });
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }

    getTotalPrice = async () => {
        let user = this.state.user;
        let res = await Axios.get('/customer/carts/price/' + user.id, { headers: { Authorization: localStorage.getItem('jwtToken') } });

        if (res.data[0] != null) {
            this.props.updateTotalPrice(res.data[0].total_price);
        }

    }

    orderProducts = async () => {
        let user = this.state.user;
        console.log(localStorage.getItem('jwtToken'));
        await Axios.put('/customer/carts/order/' + user.id, { message: 1 }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
        this.props.loadCartOrderedProducts(this.props.products);
        this.props.removeAllProducts();
        this.props.updateTotalPrice(0);
        this.handleNotification('tr', 'success', 'Successfully orderd products');
    }

    getCartProducts = async () => {
        let next = this.props.next;
        let user = this.state.user;

        let res = await Axios.get('/customer/carts/' + user.id + '?skip=' + next, { headers: { Authorization: localStorage.getItem('jwtToken') } });

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


    onAppyCoupon = async () => {
        let product = this.state.product;

        let res;
        let found = false;

        let coupon_code = this.state.coupon_code;
        try {
            res = await Axios.get('/customer/cupons/' + product.store_products_id, { headers: { Authorization: localStorage.getItem('jwtToken') } });
        } catch (error) {
            this.handleNotification('tr', 'error', "Unable to apply coupon, you must be loged in for this operation");
        }





        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].coupon_code === coupon_code) {
                product.price = res.data[i].new_price;
                found = true;
            }
        }



        if (found) {
            try {
                let id = product._id;
                await Axios.put('/customer/carts/' + id, { "price": product.price, "user_id": this.state.user.id, "store_products_id": product.store_products_id }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
                this.getTotalPrice();
                this.props.updateCartProduct(id, product);
                delete product._id;
                this.setState({
                    product
                });
            } catch (error) {
                console.log(error);
                this.handleNotification('tr', 'error', "Coupon failed");

            }

            this.handleNotification('tr', 'success', 'Applied coupon');
        } else {
            this.handleNotification('tr', 'error', "Invalid coupon");
        }


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
                data_indicator: "No products in cart"
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
            this.getTotalPrice();
        })

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.products.length !== this.props.products.length) {
            this.getTotalPrice();
        }
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
        }, {
            dataField: '_id',
            text: 'Edit',
            formatter: this.removeFormatter
        }];

        return (
            < div >
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
                                <Col>
                                    <Button bsStyle="danger" onClick={() => { this.deleteCartProduct(this.state.product._id) }} fill>Remove from cart</Button>

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
                                title="Products in cart"
                                ctAllIcons
                                category={
                                    <span>
                                        Table of product in the cart
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
                                            <span>Total price: {parseFloat(this.props.total_price).toFixed(2)}</span>
                                            <br />
                                            <br />
                                            <Button bsStyle="primary" onClick={() => { this.getCartProducts() }} pullRight>More</Button>
                                            <Button bsStyle="info" onClick={() => { this.orderProducts() }} fill>Order products</Button>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.userCartReducer.products,
        next: state.userCartReducer.next,
        total_price: state.userCartReducer.total_price
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadCartProducts: (products) => { dispatch({ type: 'LOAD_CART_PRODUCTS', products: products }) },
        deleteCartProduct: (id) => { dispatch({ type: 'DELETE_CART_PRODUCT', id: id }) },
        updateCartProduct: (id, product) => { dispatch({ type: 'UPDATE_CART_PRODUCT', id: id, product: product }) },
        addNextCartProduct: (next) => { dispatch({ type: 'ADD_NEXT_CART_PRODUCT', next: next }) },
        updateTotalPrice: (price) => { dispatch({ type: 'UPDATE_CART_PRICE', price: price }) },
        removeAllProducts: () => { dispatch({ type: 'REMOVE_ALL_CART_PRODUCT' }) },
        loadCartOrderedProducts: (products) => { dispatch({ type: 'LOAD_CART_ORDERED_PRODUCTS', products: products }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCartTable)
