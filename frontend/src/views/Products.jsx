
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import Axios from 'axios';
import Config from 'config.js'

import { Card } from "components/Card/Card.jsx";





class Dashboard extends Component {
    state = {

    }

    componentDidMount = () => {

    }

    render() {
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
                                        {/* <CardColumns>
                                    {
                                        this.state.products.map(product => (
                                            <Card style={{ width: '18rem', margin: '1rem' }}>
                                                <Card.Img variant="top" src={product.image} />
                                                <Card.Body>
                                                    <Card.Title>{product.name}</Card.Title>
                                                    <Card.Text>
                                                        {product.description}
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem><b>Category: </b>{product.category}</ListGroupItem>
                                                    <ListGroupItem><b>Subcategory: </b>{product.subcategory}</ListGroupItem>
                                                    <ListGroupItem><b>Producer: </b>{product.producer}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Footer>
                                                    <Button variant='primary' as={NavLink} exact to={'/products/' + product._id}>View product</Button>
                                                </Card.Footer>
                                            </Card>
                                        ))
                                    }
                                </CardColumns> */}
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

export default Dashboard;
