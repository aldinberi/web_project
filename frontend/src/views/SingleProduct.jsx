import React, { Component } from 'react'
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

export class SingleProduct extends Component {

    render() {
        const CustomMap = withScriptjs(
            withGoogleMap(props => (
                <GoogleMap
                    defaultZoom={13}
                    defaultCenter={{ lat: 40.748817, lng: -73.985428 }}
                    defaultOptions={{
                        scrollwheel: false,
                        zoomControl: true
                    }}
                >
                    <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
                </GoogleMap>
            ))
        );
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                id="productInfo"
                                title="Product"
                                content={
                                    <div>
                                        <Grid fluid>
                                            <Col md={6}>
                                                <span>
                                                    "Lamborghini Mercy
                                                <br />
                                                    Your chick she so thirsty
                                                <br />
                                                    I'm in that two seat Lambo"
                                            </span>
                                            </Col>
                                            <Col md={6}>
                                                <div >
                                                    <img alt="imeage" style={{ maxHeight: 250, maxWidth: 250 }} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                                                </div>
                                            </Col>
                                        </Grid>
                                    </div>
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <Card
                                title="Store Map"
                                content={
                                    <div></div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default SingleProduct
