import React, { Component } from 'react'
import { Grid, Row, Col } from "react-bootstrap";
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

class CouponTable extends Component {

    state = {
        next: 0,
        open: false,
        product: {},
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
                <Button bsStyle="danger" onClick={() => { this.deleteCoupon(cell) }} fill>Delete</Button>
            </span>

        );
    }

    getCoupons = async (indicatior = 1) => {
        let next = this.state.next;
        if (indicatior) {
            if (this.props.coupons.length === 5) {
                next += 5;
            }
        } else {
            next - 5 < 5 ? (next = 0) : (next -= 5)
        }

        let res = await Axios.get('/cupons?skip=' + next);

        this.setState({
            next: next
        });
        this.props.loadCoupons(res.data);
    }

    getStores = async () => {
        let res = await Axios.get('/stores');
        this.props.loadStores(res.data);
    }

    componentDidMount = () => {

        if (this.props.coupons.length === 0) {
            this.getCoupons();
        }

        if (this.props.stores.length === 0) {
            this.getStores();
        }
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


        console.log(product);
        this.setState({
            product: product[0],
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
            coupon: {},
            open: true,
            modalButton: button
        })

    };

    onSubmitAdd = async (event) => {
        try {
            event.preventDefault();
            this.setState({ open: false });
            let product = this.state.product;
            product.date_added = new Date();
            product.quantity = parseInt(product.quantity);
            product.barcode = parseInt(product.barcode);
            console.log(product);
            let res = await Axios.post('/admin/products', { ...product });

            this.props.addProduct(res.data);
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
            this.setState({ open: false });
            let product = this.state.product;
            let id = product._id;
            this.props.updateProduct(id, product);
            delete product._id;
            console.log(product);
            await Axios.put('/admin/products/' + id, { ...product });
            this.handleNotification('tr', 'success', 'Successfully edited product');
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

    deleteCoupon = async (id) => {
        try {
            this.props.deleteCoupon(id);
            // await Axios.delete('/admin/products/' + id);
            this.handleNotification('tr', 'success', 'Successfully deleted product');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }


    render() {
        console.log(this.props);
        console.log(this.props.stores)
        const { SearchBar } = Search;
        const columns = [{
            dataField: 'product_name',
            text: 'Product name',
            sort: true
        }, {
            dataField: 'new_price',
            text: 'New price',
            sort: true
        }, {
            dataField: 'cupon_code',
            text: 'Coupon code',
            sort: true
        }, {
            dataField: 'store_name',
            text: 'Store name',
            sort: true
        }, {
            dataField: 'store_address',
            text: 'Store address',
        }, {
            dataField: '_id',
            text: 'Edit',
            formatter: this.editFormatter
        }, {
            dataField: '_id',
            text: 'Delete',
            formatter: this.deleteFormatter
        }];
        return (
            <div>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Modal open={this.state.open} onClose={this.onCloseModal} center>
                    <Grid fluid>
                        <h4>Edit product</h4>
                        <hr />
                        <form>
                            <FormInputs
                                ncols={["col-md-5", "col-md-3", "col-md-4"]}
                                properties={[
                                    {
                                        name: "name",
                                        label: "Product",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter product name",
                                        value: this.state.product.name,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "category",
                                        label: "Category",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter category",
                                        value: this.state.product.category,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "subcategory",
                                        label: "Subcategory",
                                        type: "email",
                                        bsClass: "form-control",
                                        placeholder: "Enter subcategory",
                                        value: this.state.product.subcategory,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-6", "col-md-6"]}
                                properties={[
                                    {
                                        name: "producer",
                                        label: "Producer",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: " Enter producer",
                                        value: this.state.product.producer,
                                        onChange: this.handleChange
                                    },
                                    {
                                        name: "barcode",
                                        label: "Barcode",
                                        type: "number",
                                        bsClass: "form-control",
                                        placeholder: "Enter barcode",
                                        value: this.state.product.barcode,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        name: "image",
                                        label: "Image link",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter image link",
                                        value: this.state.product.image,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-4", "col-md-4", "col-md-4"]}
                                properties={[
                                    {
                                        name: "quantity",
                                        label: "Quantity",
                                        type: "number",
                                        bsClass: "form-control",
                                        placeholder: "Enter quantity",
                                        value: this.state.product.quantity,
                                        onChange: this.handleChange
                                    },
                                    {
                                        name: "unit",
                                        label: "Unit",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter unit",
                                        value: this.state.product.unit,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "country_of_origin",
                                        label: "County",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter country name",
                                        value: this.state.product.country_of_origin,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />

                            <Row>
                                <FormInputs
                                    ncols={["col-md-12"]}
                                    properties={[
                                        {
                                            name: "description",
                                            label: "Description",
                                            componentClass: "textarea",
                                            bsClass: "form-control",
                                            placeholder: "Enter quantity",
                                            value: this.state.product.description,
                                            onChange: this.handleChange
                                        }
                                    ]}
                                />
                            </Row>
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
                                                data={this.props.coupons}
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
                                            <Button bsStyle="primary" onClick={() => { this.getCoupons() }} pullRight>&gt;</Button>
                                            <Button bsStyle="primary" onClick={() => { this.getCoupons(0) }} pullRight>&lt;</Button>
                                            <Button bsStyle="info" onClick={() => { this.onOpenAddtModal() }}>Add coupon</Button>

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
        stores: state.storeReducer.stores,
        coupons: state.couponReducer.coupons,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCoupon: (coupon) => { dispatch({ type: 'ADD_COUPON', coupons: coupon }) },
        loadCoupons: (coupons) => { dispatch({ type: 'LOAD_COUPONS', coupons: coupons }) },
        deleteCoupon: (id) => { dispatch({ type: 'DELETE_COUPON', id: id }) },
        updateCoupon: (id, coupon) => { dispatch({ type: 'UPDATE_COUPON', id: id, coupons: coupon }) },
        loadStores: (stores) => { dispatch({ type: 'LOAD_STORES', stores: stores }) }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(CouponTable)
