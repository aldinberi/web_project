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

class ProductTable extends Component {

    state = {
        open: false,
        product: {
            id: 1
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

    getProducts = async () => {
        let next = this.props.next;
        let res = await Axios.get('/products?skip=' + next);
        next += 5;

        this.props.addNextProduct(next);

        if (res.data.length !== 0) {
            this.props.loadProducts(res.data);
        }
    }

    componentDidMount = () => {
        console.log(this.props.products)
        if (this.props.products.length === 0) {
            this.getProducts();
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
            product: { id: 1 },
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
            let res = await Axios.post('/admin/products', { ...product }, { headers: { Authorization: localStorage.getItem('jwtToken') } });

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
            let product = this.state.product;
            this.props.updateProduct(product._id, product);
            this.setState({ open: false });
            let id = product._id;
            delete product._id;
            await Axios.put('/admin/products/' + id, { ...product }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.setState({
                product: product
            })
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

    deleteProduct = async (id) => {
        try {
            this.props.deleteProduct(id);
            await Axios.delete('/admin/products/' + id, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.handleNotification('tr', 'success', 'Successfully deleted product');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }


    render() {
        console.log("prop")
        console.log(this.props.products);
        const { SearchBar } = Search;
        const columns = [{
            dataField: 'name',
            text: 'Name',
            sort: true
        }, {
            dataField: 'description',
            text: 'Description',
            sort: true,
        }, {
            dataField: 'category',
            text: 'Category',
            sort: true,
        }, {
            dataField: 'subcategory',
            text: 'Subcategory',
        }, {
            dataField: 'producer',
            text: 'Producer',
            sort: true,
        }, {
            dataField: 'barcode',
            text: 'Barcode',
        }, {
            dataField: 'image',
            text: 'Image',
            formatter: this.imageFormatter
        }, {
            dataField: 'quantity',
            text: 'Quantity',
        }, {
            dataField: 'unit',
            text: 'Unit',
        }, {
            dataField: 'country_of_origin',
            text: 'County',
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
                                        type: "text",
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
                                            <Button bsStyle="primary" onClick={() => { this.getProducts() }} pullRight>More</Button>
                                            <Button bsStyle="info" onClick={() => { this.onOpenAddtModal() }}>Add product</Button>

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
        products: state.productReducer.products,
        next: state.productReducer.next,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addProduct: (product) => { dispatch({ type: 'ADD_PRODUCT', product: product }) },
        loadProducts: (products) => { dispatch({ type: 'LOAD_PRODUCTS', products: products }) },
        deleteProduct: (id) => { dispatch({ type: 'DELETE_PRODUCT', id: id }) },
        updateProduct: (id, product) => { dispatch({ type: 'UPDATE_PRODUCT', id: id, product: product }) },
        addNextProduct: (next) => { dispatch({ type: 'ADD_NEXT_PRODUCT', next: next }) },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(ProductTable)
