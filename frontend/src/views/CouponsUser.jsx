
import React, { Component } from "react";

import CouponTableUser from "components/Table/CouponTableUser.jsx"

class CouponsUser extends Component {

    render() {
        console.log(this.props);

        return (
            <div className="content">
                <CouponTableUser />
            </div>
        );
    }
}

export default CouponsUser;
