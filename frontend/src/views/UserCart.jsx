
import React, { Component } from "react";

import CouponTable from "components/Table/CouponTable.jsx"

class UserCart extends Component {

    render() {
        console.log(this.props);

        return (
            <div className="content">
                <CouponTable />
            </div>
        );
    }
}

export default UserCart;
