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
import Checkbox from 'components/CustomCheckbox/CustomCheckbox';

class StoreTable extends Component {

    state = {
        credit_card: false,
        cash: false,
        next: 0,
        open: false,
        product: {},
        store: {
            payment_method: {}
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

    // imageFormatter = (cell, row) => {

    //     return (
    //         <span>
    //             <a href={cell}>Image</a>
    //         </span>

    //     );
    // }

    // paymentFormatter = (cell, row) => {
    //     let string = ""
    //     if (cell.cash === 1) {
    //         string += ", cash"
    //     }
    //     if (cell.credit_card === 1) {
    //         string += ", credit card"
    //     }
    //     string = string.slice(2);
    //     return (
    //         string
    //     );
    // }

    // editFormatter = (cell, row) => {

    //     return (
    //         <span>
    //             <Button bsStyle="info" onClick={() => { this.onOpenEditModal(cell) }}>Edit</Button>
    //         </span>

    //     );
    // }

    // deleteFormatter = (cell, row) => {

    //     return (
    //         <span>
    //             <Button bsStyle="danger" onClick={() => { this.deleteStore(cell) }} fill>Delete</Button>
    //         </span>

    //     );
    // }

    imageFormatter = (cell, row) => {

        return (
            <span>
                <a href={cell}>Image</a>
            </span>

        );
    }

    editFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="info" onClick={() => { this.onOpenEditModal(cell) }}>Edit</Button>
            </span>

        );
    }

    deleteFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="danger" onClick={() => { this.deleteProduct(cell) }} fill>Delete</Button>
            </span>

        );
    }

    getStores = async (indicatior = 1) => {
        let next = this.state.next;
        if (indicatior) {
            if (this.props.stores.length === 5) {
                next += 5;
            }
        } else {
            next - 5 < 5 ? (next = 0) : (next -= 5)
        }

        let res = await Axios.get('/stores?skip=' + next);

        this.setState({
            next: next
        });
        this.props.loadStores(res.data);
    }

    getProducts = async (indicatior = 1) => {
        let next = this.state.next;
        if (indicatior) {
            if (this.props.products.length === 5) {
                next += 5;
            }
        } else {
            next - 5 < 5 ? (next = 0) : (next -= 5)
        }
        console.log(next);
        let res = await Axios.get('/stores?skip=' + next);
        this.setState({
            next: next
        });
        this.props.loadStores(res.data);
    }


    // componentDidMount = () => {
    //     if (this.props.stores.length === 0) {
    //         this.getStores();
    //     }
    //     this.setState({ _notificationSystem: this.refs.notificationSystem })

    // }

    componentDidMount = () => {
        console.log(this.props.products)
        if (this.props.products.length === 0) {
            this.getProducts();
        }
        this.setState({ _notificationSystem: this.refs.notificationSystem })
    }

    onSubmitUpdate = async (event) => {
        try {
            event.preventDefault();
            this.setState({ open: false });
            let product = this.state.product;
            let id = product._id;
            this.props.updateStore(id, product);
            // delete product._id;
            console.log(product);
            //await Axios.put('/admin/products/' + id, { ...product });
            this.handleNotification('tr', 'success', 'Successfully edited product');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }

    };

    // onOpenEditModal = (id) => {
    //     let stores = this.props.stores;
    //     let store = stores.filter(store => {
    //         return store._id === id
    //     });
    //     let button =
    //         <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitUpdate}>
    //             Update
    //         </Button>;


    //     this.setState({
    //         store: store[0],
    //         open: true,
    //         modalButton: button
    //     })

    // };

    onOpenEditModal = (id) => {
        let products = this.props.products;
        let product = products.filter(product => {
            return product._id === id
        });
        let button =
            <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitUpdate}>
                Update
            </Button>;


        console.log(product);
        this.setState({
            product: product[0],
            open: true,
            modalButton: button
        })

    };

    // onOpenAddtModal = () => {

    //     let button =
    //         <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitAdd}>
    //             Add
    //         </Button>;

    //     this.setState({
    //         store: {},
    //         open: true,
    //         modalButton: button
    //     })

    // };

    // onSubmitAdd = async (event) => {
    //     try {
    //         event.preventDefault();
    //         this.setState({ open: false });
    //         let product = this.state.product;
    //         product.date_added = new Date();
    //         product.quantity = parseInt(product.quantity);
    //         product.barcode = parseInt(product.barcode);
    //         console.log(product);
    //         let res = await Axios.post('/admin/products', { ...product });

    //         this.props.addProduct(res.data);
    //         this.handleNotification('tr', 'success', 'Successfully added product');

    //     } catch (error) {
    //         console.log(error);
    //         this.handleNotification('tr', 'error', "Validation went wrong");
    //     }

    // };

    // onCloseModal = () => {
    //     this.setState({ open: false });
    // };

    // onSubmitUpdate = async (event) => {
    //     try {
    //         event.preventDefault();
    //         this.setState({ open: false });
    //         let store = this.state.store;
    //         let id = store._id;
    //         this.props.updateStore(id, store);
    //         //console.log(this.props.stores);
    //         // delete product._id;
    //         // console.log(product);
    //         // await Axios.put('/admin/products/' + id, { ...product });
    //         this.handleNotification('tr', 'success', 'Successfully edited store');
    //     } catch (error) {
    //         this.handleNotification('tr', 'error', 'Something went wrong');
    //     }

    // };


    // handleChange = (event) => {
    //     let store = this.state.store
    //     store[event.target.name] = event.target.value
    //     this.setState({
    //         store
    //     });

    // }

    handleChange = (event) => {
        let product = this.state.product
        product[event.target.name] = event.target.value
        this.setState({
            product
        });

    }

    deleteStore = async (id) => {
        try {
            this.props.deleteStore(id);
            // await Axios.delete('/admin/products/' + id);
            this.handleNotification('tr', 'success', 'Successfully deleted store');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }

    deleteProduct = async (id) => {
        try {
            this.props.deleteStore(id);
            //await Axios.delete('/admin/products/' + id);
            this.handleNotification('tr', 'success', 'Successfully deleted product');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }

    render() {
        console.log(this.props.products);
        const { SearchBar } = Search;
        const columns = [{
            dataField: 'name',
            text: 'Name',
            sort: true
        }, {
            dataField: '_id',
            text: 'Edit',
            formatter: this.editFormatter
        }, {
            dataField: '_id',
            text: 'Delete',
            formatter: this.deleteFormatter
        }];
        // const columns = [{
        //     dataField: 'name',
        //     text: 'Name',
        //     sort: true
        // }, {
        //     dataField: 'description',
        //     text: 'Description',
        //     sort: true,
        // }, {
        //     dataField: 'category',
        //     text: 'Category',
        //     sort: true,
        // }, {
        //     dataField: 'subcategory',
        //     text: 'Subcategory',
        // }, {
        //     dataField: 'producer',
        //     text: 'Producer',
        //     sort: true,
        // }, {
        //     dataField: 'barcode',
        //     text: 'Barcode',
        // }, {
        //     dataField: 'image',
        //     text: 'Image',
        //     formatter: this.imageFormatter
        // }, {
        //     dataField: 'quantity',
        //     text: 'Quantity',
        // }, {
        //     dataField: 'unit',
        //     text: 'Unit',
        // }, {
        //     dataField: 'country_of_origin',
        //     text: 'County',
        // }, {
        //     dataField: '_id',
        //     text: 'Edit',
        //     formatter: this.editFormatter
        // }, {
        //     dataField: '_id',
        //     text: 'Delete',
        //     formatter: this.deleteFormatter
        // }];
        return (
            <div>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Modal open={this.state.open} onClose={this.onCloseModal} center>
                    <Grid fluid>
                        <h4>Store</h4>
                        <hr />
                        <form>
                            <FormInputs
                                ncols={["col-md-5", "col-md-3", "col-md-4"]}
                                properties={[
                                    {
                                        name: "name",
                                        label: "Store",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter store name",
                                        value: this.state.product.name,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "address",
                                        label: "Address",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter address",
                                        value: this.state.store.address,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "city",
                                        label: "City",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter city",
                                        value: this.state.store.city,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-6", "col-md-6"]}
                                properties={[
                                    {
                                        name: "latitude",
                                        label: "Latitude",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: " Enter latitude",
                                        value: this.state.store.latitude,
                                        onChange: this.handleChange
                                    },
                                    {
                                        name: "longitude",
                                        label: "Longitude",
                                        type: "number",
                                        bsClass: "form-control",
                                        placeholder: "Enter barcode",
                                        value: this.state.store.longitude,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <FormGroup >
                                <Col sm>
                                    <ControlLabel>Payment method</ControlLabel>
                                </Col>
                                <Col md={5}>
                                    <Checkbox
                                        number="1"
                                        isChecked={this.state.store.payment_method.cash}
                                        onClick={this.testCheck}
                                        label="Cash"
                                    />
                                </Col>
                                <Col md={5}>
                                    <Checkbox
                                        number="2"
                                        isChecked={this.state.store.payment_method.credit_card}
                                        label="Credit card"
                                    />

                                </Col>
                            </FormGroup>

                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        name: "working_hours",
                                        label: "Working hours",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter working hours",
                                        value: this.state.store.working_hours,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
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
                                title="202 Awesome Stroke Icons"
                                ctAllIcons
                                category={
                                    <span>
                                        Handcrafted by our friends from{" "}
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="http://themes-pixeden.com/font-demos/7-stroke/index.html"
                                        >
                                            Pixeden
                                        </a>
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
                                            <Button bsStyle="primary" onClick={() => { this.getStores() }} pullRight>&gt;</Button>
                                            <Button bsStyle="primary" onClick={() => { this.getStores(0) }} pullRight>&lt;</Button>
                                            <Button bsStyle="info" onClick={() => { this.onOpenAddtModal() }}>Add store</Button>

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
        // stores: state.storeReducer.stores,
        products: state.storeReducer.stores
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStores: (stores) => { dispatch({ type: 'LOAD_STORES', stores: stores }) },
        updateStore: (id, store) => { dispatch({ type: 'UPDATE_STORE', id: id, store: store }) },
        deleteStore: (id) => { dispatch({ type: 'DELETE_STORE', id: id }) },
        loadProducts: (products) => { dispatch({ type: 'LOAD_PRODUCTS', products: products }) },
        deleteProduct: (id) => { dispatch({ type: 'DELETE_PRODUCT', id: id }) },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(StoreTable)
