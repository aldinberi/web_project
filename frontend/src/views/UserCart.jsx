
import React, { Component } from "react";

import UserCartTable from "components/Table/UserCartTable"

class UserCart extends Component {

    render() {
        console.log(this.props);

        return (
            <div className="content">
                <UserCartTable />
            </div>
        );
    }
}

export default UserCart;
