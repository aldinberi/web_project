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
        open: false,
        coupon: {},
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

    getCoupons = async () => {
        let next = this.props.next;

        let res = await Axios.get('/cupons?skip=' + next);

        next += 5;

        this.props.addNextCoupon(next);

        if (res.data.length !== 0) {
            this.props.loadCoupons(res.data);
        }
    }

    getStores = async () => {
        let res = await Axios.get('/stores');
        this.props.loadStores(res.data);
    }

    componentDidMount = () => {

        if (this.props.coupons.length === 0) {
            this.getCoupons();
        }

        this.setState({ _notificationSystem: this.refs.notificationSystem })

    }

    onOpenEditModal = (id) => {
        let coupons = this.props.coupons;
        let coupon = coupons.filter(coupon => {
            return coupon._id === id
        });

        this.setState({
            coupon: coupon[0],
            open: true
        })

    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    onSubmitUpdate = async (event) => {
        try {
            event.preventDefault();
            let coupon = this.state.coupon;
            let id = coupon._id;
            this.props.updateCoupon(id, coupon);
            this.setState({ open: false });

            delete coupon._id;

            await Axios.put('/admin/cupons/' + id, { store_product_id: coupon.store_product_id, coupon_code: coupon.coupon_code, new_price: parseFloat(coupon.new_price) }, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.setState({
                coupon
            })
            this.handleNotification('tr', 'success', 'Successfully edited store');
        } catch (error) {
            console.log(error);
            this.handleNotification('tr', 'error', 'Something went wrong');
        }

    };


    handleChange = (event) => {
        let coupon = this.state.coupon
        coupon[event.target.name] = event.target.value
        this.setState({
            coupon
        });
    }

    deleteCoupon = async (id) => {
        try {
            this.props.deleteCoupon(id);
            await Axios.delete('/admin/cupons/' + id, { headers: { Authorization: localStorage.getItem('jwtToken') } });
            this.handleNotification('tr', 'success', 'Successfully deleted product');
        } catch (error) {
            this.handleNotification('tr', 'error', 'Something went wrong');
        }
    }

    render() {
        console.log(this.props);
        console.log(this.props.coupon);
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
                        <h4>Coupon</h4>
                        <hr />
                        <form>
                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        name: "coupon_code",
                                        label: "Coupon code",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Enter coupon code",
                                        value: this.state.coupon.coupon_code,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <FormInputs
                                ncols={["col-md-12"]}
                                properties={[
                                    {
                                        name: "new_price",
                                        label: "New price",
                                        type: "number",
                                        bsClass: "form-control",
                                        placeholder: "Enter new price",
                                        value: this.state.coupon.new_price,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />
                            <hr />
                            <Button bsStyle="info" pullRight fill type="submit" onClick={this.onSubmitUpdate}>
                                Update
                            </Button>
                            <div className="clearfix" />
                        </form>
                    </Grid>
                </Modal>
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
        addCoupon: (coupon) => { dispatch({ type: 'ADD_COUPON', coupons: coupon }) },
        loadCoupons: (coupons) => { dispatch({ type: 'LOAD_COUPONS', coupons: coupons }) },
        deleteCoupon: (id) => { dispatch({ type: 'DELETE_COUPON', id: id }) },
        updateCoupon: (id, coupon) => { dispatch({ type: 'UPDATE_COUPON', id: id, coupon: coupon }) },
        addNextCoupon: (next) => { dispatch({ type: 'ADD_NEXT_COUPON', next: next }) },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(CouponTable)
