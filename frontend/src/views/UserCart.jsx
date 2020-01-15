
import React, { Component } from "react";

import UserCartTable from "components/Table/UserCartTable";

import OrderHistoryTable from "components/Table/OrderHistoryTable";

class UserCart extends Component {

    render() {

        return (
            <div className="content">
                <UserCartTable />
                <OrderHistoryTable />
            </div>
        );
    }
}

export default UserCart;
