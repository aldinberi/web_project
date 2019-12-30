
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Axios from 'axios';
import Config from 'config.js'
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { Card } from "components/Card/Card.jsx";
import Button from 'components/CustomButton/CustomButton';





class Products extends Component {
    state = {
        next: 0
    }

    imageFormatter = (cell, row) => {

        return (
            <span>
                <a href={cell}>Image</a>
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
        }, {
            dataField: 'barcode',
            text: 'Barcode',
        }, {
            dataField: 'image',
            text: 'Image',
            formatter: this.imageFormatter,
        }, {
            dataField: 'quantity',
            text: 'Quantity',
        }, {
            dataField: 'unit',
            text: 'Unit',
        }, {
            dataField: 'country_of_origin',
            text: 'County',
        }];
        return (
            <div className="content">

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
