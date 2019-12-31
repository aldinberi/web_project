
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Axios from 'axios';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { Card } from "components/Card/Card.jsx";
import Button from 'components/CustomButton/CustomButton';
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

import {
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';

class Products extends Component {
    state = {
        open: false,
        next: 0
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

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
                <Button bsStyle="info" onClick={this.onOpenModal}>Edit</Button>
            </span>

        );
    }

    deleteFormatter = (cell, row) => {

        return (
            <span>
                <Button bsStyle="danger" fill>Delete</Button>
            </span>

        );
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
        let res = await Axios.get('/products?skip=' + next);
        this.setState({
            next: next
        });
        this.props.addProducts(res.data);
    }
    componentDidMount = () => {
        console.log(this.props.products)
        if (this.props.products.length === 0) {
            this.getProducts();
        }
    }

    render() {
        console.log(this.props);
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
            <div className="content">
                <Modal open={this.state.open} onClose={this.onCloseModal} center>
                    <Grid fluid>
                        <h4>Edit profile</h4>
                        <form>
                            <FormInputs
                                ncols={["col-md-5", "col-md-3", "col-md-4"]}
                                properties={[
                                    {
                                        label: "Company (disabled)",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Company",
                                        defaultValue: "Creative Code Inc.",
                                        disabled: true
                                    },
                                    {
                                        label: "Username",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Username",
                                        defaultValue: "michael23"
                                    },
                                    {
                                        label: "Email address",
                                        type: "email",
                                        bsClass: "form-control",
                                        placeholder: "Email"
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-6", "col-md-6"]}
                                properties={[
                                    {
                                        label: "First name",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "First name",
                                        defaultValue: "Mike"
                                    },
                                    {
                                        label: "Last name",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Last name",
                                        defaultValue: "Andrew"
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        label: "Adress",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Home Adress",
                                        defaultValue:
                                            "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-4", "col-md-4", "col-md-4"]}
                                properties={[
                                    {
                                        label: "City",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "City",
                                        defaultValue: "Mike"
                                    },
                                    {
                                        label: "Country",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Country",
                                        defaultValue: "Andrew"
                                    },
                                    {
                                        label: "Postal Code",
                                        type: "number",
                                        bsClass: "form-control",
                                        placeholder: "ZIP Code"
                                    }
                                ]}
                            />

                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="formControlsTextarea">
                                        <ControlLabel>About Me</ControlLabel>
                                        <FormControl
                                            rows="5"
                                            componentClass="textarea"
                                            bsClass="form-control"
                                            placeholder="Here can be your description"
                                            defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button bsStyle="info" pullRight fill type="submit">
                                Update Profile
                                    </Button>
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
                                            <Button bsStyle="primary" onClick={() => { this.getProducts() }} pullRight>&gt;</Button>
                                            <Button bsStyle="primary" onClick={() => { this.getProducts(0) }} pullRight>&lt;</Button>

                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.productReducer.products
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addProducts: (products) => { dispatch({ type: 'ADD_PRODUCTS', products: products }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
