import React, { Component } from 'react'
import { Grid, Row, Col, ControlLabel, FormGroup } from "react-bootstrap";
import Axios from 'axios';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Card } from "components/Card/Card.jsx";
import Button from 'components/CustomButton/CustomButton';
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Modal from 'react-responsive-modal';
import NotificationSystem from 'react-notification-system';
import { style } from "variables/Variables.jsx";

import image from "assets/img/spinner.gif";


class StoreProductsTable extends Component {

    state = {
        credit_card: false,
        cash: false,
        open: false,
        openCoupon: false,
        coupon: {},
        product: {},
        single_store: "",
        select_store: [],
        select_product: [],
        modalButton: "",
        _notificationSystem: null,
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


    editFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="info" onClick={() => { this.onOpenEditModal(cell) }}>Edit</Button>
            </span>

        );
    }

    createCouponFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="success" onClick={() => { this.onOpenAddCouponModal(cell) }}>Create coupon</Button>
            </span>

        );
    }

    deleteFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="danger" onClick={() => { this.deleteStoreProduct(cell) }} fill>Delete</Button>
            </span>

        );
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

    getStoresNames = async () => {
        let res = await Axios.get('/admin/stores/names', { headers: { Authorization: localStorage.getItem('jwtToken') } });
        const storeList = res.data.length ? (
            res.data.map(store => {
                return (
                    <option value={store._id}>{store.name}</option>
                )
            })
        ) : (
                <option value="">No stores available</option>
            )
        let placeholder = <option value="" selected hidden>Please select a store</option>;
        let final_list = [placeholder, ...storeList];
        this.props.loadStoreNames(final_list);
    }

    getProductsNames = async () => {
        let res = await Axios.get('/admin/products/names', { headers: { Authorization: localStorage.getItem('jwtToken') } });
        const productList = res.data.length ? (
            res.data.map(product => {
                return (
                    <option value={product._id}>{product.name}</option>
                )
            })
        ) : (
                <option value="">No products available</option>
            )
        let placeholder = <option value="" selected hidden>Please select a product</option>;
        let final_list = [placeholder, ...productList];
        this.props.loadProductNames(final_list);
    }



    componentDidMount = () => {
        setTimeout(() => {
            this.setState(() => ({
                data_indicator: "No products available"
            }));
        }, 3000);
        if (this.props.products.length === 0) {
            this.getStoreProducts();
        }
        this.getStoresNames();
        this.getProductsNames();


        this.setState({ _notificationSystem: this.refs.notificationSystem })

    }


    onOpenEditModal = (id) => {
        let products = this.props.products;
        let product = products.filter(product => {
            return product._id === id
        });
        let button =
            <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitUpdate}>
                Update
            </Button>;

        let select_product = <option value={product[0].product_id}>{product[0].product_name}</option>;
        let select_store = <option value={product[0].store_id}>{product[0].store_name}</option>;


        this.setState({

            product: product[0],
            select_store,
            select_product,
            open: true,
            modalButton: button
        })

    };



    onOpenAddtModal = () => {

        let button =
            <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitAdd}>
                Add
            </Button>;

        this.setState({
            select_product: this.props.productNames,
            select_store: this.props.storeNames,
            product: [],
            open: true,
            modalButton: button
        })
    };

    onOpenAddCouponModal = (id) => {
        let coupon = {
            store_product_id: id
        }
        this.setState({
            openCoupon: true,
            coupon
        })
    };

    onSubmitAddCoupon = async (event) => {
        try {
            event.preventDefault();
            this.setState({ openCoupon: false });
            let coupon = this.state.coupon;
            coupon.new_price = parseFloat(coupon.new_price);
            await Axios.post('/admin/cupons', { ...coupon }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.handleNotification('tr', 'success', 'Successfully added coupon');

        } catch (error) {
            console.log(error);
            this.handleNotification('tr', 'error', "Validation went wrong");
        }

    };

    onSubmitAdd = async (event) => {
        try {
            event.preventDefault();
            this.setState({ open: false });
            let product = this.state.product;
            product.price = parseFloat(product.price);
            let res = await Axios.post('/admin/stores/product', { ...product }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            let res_product = await Axios.get('/stores/products/' + res.data._id);
            this.props.addStoreProduct(res_product.data[0]);
            this.handleNotification('tr', 'success', 'Successfully added product');

        } catch (error) {
            console.log(error);
            this.handleNotification('tr', 'error', "Validation went wrong");
        }

    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    onCloseCouponModal = () => {
        this.setState({ openCoupon: false });
    };

    onSubmitUpdate = async (event) => {
        try {
            event.preventDefault();
            let product = this.state.product;
            let id = product._id;
            this.props.updateStoreProducts(id, product);
            this.setState({ open: false });
            delete product._id;
            await Axios.put('/admin/stores/product/' + id, { product_id: product.product_id, store_id: product.store_id, price: parseFloat(product.price) }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.setState({
                product: product
            })
            this.handleNotification('tr', 'success', 'Successfully edited store');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }

    };


    handleChange = (event) => {
        let product = this.state.product
        product[event.target.name] = event.target.value
        this.setState({
            product
        });
    }

    handleCouponChange = (event) => {
        let coupon = this.state.coupon
        coupon[event.target.name] = event.target.value
        this.setState({
            coupon
        });
    }


    deleteStoreProduct = async (id) => {
        try {
            this.props.deleteStoreProduct(id);
            await Axios.delete('/admin/stores/product/' + id, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.handleNotification('tr', 'success', 'Successfully deleted store');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
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
            dataField: '_id',
            text: 'Coupon',
            formatter: this.createCouponFormatter
        }, {
            dataField: '_id',
            text: 'Edit',
            formatter: this.editFormatter,

        }, {
            dataField: '_id',
            text: 'Delete',
            formatter: this.deleteFormatter,

        }];

        return (
            <div>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Modal open={this.state.open} onClose={this.onCloseModal} center>
                    <Grid fluid>
                        <h4>Store</h4>
                        <hr />
                        <form>
                            <FormGroup>
                                <Col>
                                    <ControlLabel>Product</ControlLabel>
                                </Col>

                                <Col md={6}>
                                    <select name="store_id" className="form-control" onChange={this.handleChange}>
                                        {this.state.select_store}
                                    </select>
                                </Col>
                                <Col md={6}>
                                    <select name="product_id" className="form-control" onChange={this.handleChange}>
                                        {this.state.select_product}
                                    </select>
                                </Col>

                            </FormGroup>
                            <FormGroup>
                                <br />
                                <br />
                                <FormInputs
                                    ncols={["col-md-12"]}
                                    properties={[
                                        {
                                            name: "price",
                                            label: "Product price",
                                            type: "text",
                                            bsClass: "form-control",
                                            placeholder: "Enter product price",
                                            value: this.state.product.price,
                                            onChange: this.handleChange
                                        }
                                    ]}
                                />
                            </FormGroup>
                            <hr />
                            {this.state.modalButton}
                            <div className="clearfix" />
                        </form>
                    </Grid>
                </Modal>
                <Modal open={this.state.openCoupon} onClose={this.onCloseCouponModal} center>
                    <Grid fluid>
                        <h4>Cerate coupon</h4>
                        <hr />
                        <form>
                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        name: "coupon_code",
                                        label: "Coupon code",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter coupon code",
                                        value: this.state.coupon.coupon_code,
                                        onChange: this.handleCouponChange
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        name: "new_price",
                                        label: "New price",
                                        type: "number",
                                        bsClass: "form-control",
                                        placeholder: "Enter new price",
                                        value: this.state.coupon.new_price,
                                        onChange: this.handleCouponChange
                                    }
                                ]}
                            />

                            <hr />
                            <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitAddCoupon}>
                                Create
                            </Button>
                            <div className="clearfix" />
                        </form>
                    </Grid>
                </Modal>
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
                                            <Button bsStyle="info" onClick={() => { this.onOpenAddtModal() }}>Add product to store</Button>

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
        storeNames: state.storeProductReducer.storeNames,
        productNames: state.storeProductReducer.productNames,
        next: state.storeProductReducer.next
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStoreProducts: (products) => { dispatch({ type: 'LOAD_STORE_PRODUCTS', products: products }) },
        updateStoreProducts: (id, product) => { dispatch({ type: 'UPDATE_STORE_PRODUCT', id: id, product: product }) },
        deleteStoreProduct: (id) => { dispatch({ type: 'DELETE_STORE_PRODUCT', id: id }) },
        addStoreProduct: (product) => { dispatch({ type: 'ADD_STORE_PRODUCT', product: product }) },
        loadStoreNames: (storeNames) => { dispatch({ type: 'LOAD_STORE_NAMES', storeNames: storeNames }) },
        loadProductNames: (productNames) => { dispatch({ type: 'LOAD_PRODUCT_NAMES', productNames: productNames }) },
        addNextStoreProduct: (next) => { dispatch({ type: 'ADD_NEXT_STORE_PRODUCT', next: next }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreProductsTable)
