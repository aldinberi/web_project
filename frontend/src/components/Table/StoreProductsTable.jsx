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


class StoreProductsTable extends Component {

    state = {
        credit_card: false,
        cash: false,
        next: 0,
        open: false,
        product: {},
        single_store: "",
        select_store: [],
        select_product: [],
        store: {
            payment_method: {
                cash: 0,
                credit_card: 0
            }
        },
        modalButton: "",
        _notificationSystem: null
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
                <Button bsStyle="success" onClick={() => { this.onOpenEditModal(cell) }}>Create coupon</Button>
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
        let next = this.state.next;

        let res = await Axios.get('/stores/products?skip=' + next);

        next += 5;

        this.setState({
            next: next
        });
        if (res.data.length !== 0) {
            this.props.loadStoreProducts(res.data);
        }
    }

    getStoresNames = async () => {
        let res = await Axios.get('/admin/stores/names');
        console.log(res.data);
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
        let res = await Axios.get('/admin/products/names');
        console.log(res.data);
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


        console.log(product)
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

    onSubmitAdd = async (event) => {
        try {
            event.preventDefault();
            this.setState({ open: false });
            let product = this.state.product;
            product.price = parseFloat(product.price);
            let res = await Axios.post('/admin/stores/product', { ...product });
            let res_product = await Axios.get('/stores/products/' + res.data._id);
            console.log('Novi');
            console.log(res_product.data[0]);
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

    onSubmitUpdate = async (event) => {
        try {
            event.preventDefault();
            let product = this.state.product;
            let id = product._id;
            this.props.updateStoreProducts(id, product);
            this.setState({ open: false });
            console.log(id);
            console.log()
            delete product._id;
            await Axios.put('/admin/stores/product/' + id, { product_id: product.product_id, store_id: product.store_id, price: parseFloat(product.price) });
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


    deleteStoreProduct = async (id) => {
        try {
            this.props.deleteStoreProduct(id);
            await Axios.delete('/admin/stores/product/' + id);
            this.handleNotification('tr', 'success', 'Successfully deleted store');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }


    render() {
        console.log(this.props.storeNames);
        console.log(this.props.productNames);
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
        productNames: state.storeProductReducer.productNames
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStoreProducts: (products) => { dispatch({ type: 'LOAD_STORE_PRODUCTS', products: products }) },
        updateStoreProducts: (id, product) => { dispatch({ type: 'UPDATE_STORE_PRODUCT', id: id, product: product }) },
        deleteStoreProduct: (id) => { dispatch({ type: 'DELETE_STORE_PRODUCT', id: id }) },
        addStoreProduct: (product) => { dispatch({ type: 'ADD_STORE_PRODUCT', product: product }) },
        loadStoreNames: (storeNames) => { dispatch({ type: 'LOAD_STORE_NAMES', storeNames: storeNames }) },
        loadProductNames: (productNames) => { dispatch({ type: 'LOAD_PRODUCT_NAMES', productNames: productNames }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreProductsTable)
