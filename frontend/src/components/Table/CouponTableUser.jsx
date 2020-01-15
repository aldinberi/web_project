import React, { Component } from 'react'
import { Grid, Row, Col } from "react-bootstrap";
import Axios from 'axios';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Card } from "components/Card/Card.jsx";
import Button from 'components/CustomButton/CustomButton';
import NotificationSystem from 'react-notification-system';
import { style } from "variables/Variables.jsx";

class CouponTableUser extends Component {

    state = {

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

    getCoupons = async () => {
        let next = this.props.next;

        let res = await Axios.get('/cupons?skip=' + next);

        next += 5;

        this.props.addNextCoupon(next);

        if (res.data.length !== 0) {
            this.props.loadCoupons(res.data);
        }
    }



    componentDidMount = () => {

        if (this.props.coupons.length === 0) {
            this.getCoupons();
        }

        this.setState({ _notificationSystem: this.refs.notificationSystem })

    }



    render() {
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
            dataField: 'coupon_code',
            text: 'Coupon code',
            sort: true
        }, {
            dataField: 'store_name',
            text: 'Store name',
            sort: true
        }, {
            dataField: 'store_address',
            text: 'Store address',
        }];
        return (
            <div>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Coupons"
                                ctAllIcons
                                category={
                                    <span>
                                        Table of coupons in the sistem
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
                                            <Button bsStyle="primary" onClick={() => { this.getCoupons() }} pullRight>More</Button>

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
        coupons: state.couponReducer.coupons,
        next: state.couponReducer.next
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadCoupons: (coupons) => { dispatch({ type: 'LOAD_COUPONS', coupons: coupons }) },
        addNextCoupon: (next) => { dispatch({ type: 'ADD_NEXT_COUPON', next: next }) },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(CouponTableUser)
