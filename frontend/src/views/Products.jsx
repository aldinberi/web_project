
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Axios from 'axios';
import Config from 'config.js'
import { connect } from 'react-redux';

import { Card } from "components/Card/Card.jsx";
import Button from 'components/CustomButton/CustomButton';





class Products extends Component {
    state = {
        next: 0
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
        let res = await Axios.get(Config.BASE_URL + 'products?skip=' + next);
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
                                            <div className="table-responsive-md">
                                                <Table responsive>
                                                    <thead>
                                                        <tr>
                                                            <td>Name</td>
                                                            <td>Description</td>
                                                            <td>Category</td>
                                                            <td>Subcategory</td>
                                                            <td>Producer</td>
                                                            <td>Barcode</td>
                                                            <td>Image</td>
                                                            <td>Quantity</td>
                                                            <td>Unit</td>
                                                            <td>County</td>
                                                        </tr>

                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.props.products.map(product => {
                                                                return (
                                                                    <tr key={product._id}>
                                                                        <td>{product.name}</td>
                                                                        <td>{product.description}</td>
                                                                        <td>{product.category}</td>
                                                                        <td>{product.subcategory}</td>
                                                                        <td>{product.producer}</td>
                                                                        <td>{product.barcode}</td>
                                                                        <td><a href={product.image}>Image</a></td>
                                                                        <td>{product.quantity}</td>
                                                                        <td>{product.unit}</td>
                                                                        <td>{product.country_of_origin}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                                <Button bsStyle="primary" onClick={() => { this.getProducts() }} pullRight>&gt;</Button>
                                                <Button bsStyle="primary" onClick={() => { this.getProducts(0) }} pullRight>&lt;</Button>
                                            </div>
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
