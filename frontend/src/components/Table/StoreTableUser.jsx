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


class StoreTableUser extends Component {

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


    paymentFormatter = (cell, row) => {
        let string = ""
        if (cell.cash === 1) {
            string += ", cash"
        }
        if (cell.credit_card === 1) {
            string += ", credit card"
        }
        string = string.slice(2);
        return (
            string
        );
    }


    getStores = async () => {

        let next = this.props.next;

        let res = await Axios.get('/stores?skip=' + next);

        next += 5;

        this.props.addNextStore(next)

        console.log("Duzima");
        console.log(res.data.length);
        if (res.data.length !== 0 && res.data.length !== null) {
            this.props.loadStores(res.data);
        }
    }



    componentDidMount = () => {
        if (this.props.stores.length === 0) {
            this.getStores();
        }
        this.setState({ _notificationSystem: this.refs.notificationSystem })

    }


    render() {
        console.log(this.props.stores);
        const { SearchBar } = Search;
        const columns = [{
            dataField: 'name',
            text: 'Name',
            sort: true
        }, {
            dataField: 'address',
            text: 'Edit',
        }, {
            dataField: 'city',
            text: 'City',
        }, {
            dataField: 'working_hours',
            text: 'Working Hours',
        }, {
            dataField: 'payment_method',
            text: 'Payment methods',
            formatter: this.paymentFormatter
        }];

        return (
            <div>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Stores"
                                ctAllIcons
                                category={
                                    <span>
                                        Table of stores in the system
                                    </span>
                                }
                                content={
                                    <Row>
                                        <Col sm={12}>
                                            <ToolkitProvider
                                                keyField="_id"
                                                data={this.props.stores}
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
                                            <Button bsStyle="primary" onClick={() => { this.getStores() }} pullRight>More</Button>
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
        next: state.storeReducer.next
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStores: (stores) => { dispatch({ type: 'LOAD_STORES', stores: stores }) },
        addNextStore: (next) => { dispatch({ type: 'ADD_NEXT_STORE', next: next }) },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(StoreTableUser)
