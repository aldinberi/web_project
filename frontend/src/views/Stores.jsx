
import React, { Component } from "react";

import StoreTable from "components/Table/StoreTable.jsx"

class Stores extends Component {

    render() {
        console.log(this.props);

        return (
            <div className="content">
                <StoreTable />
            </div>
        );
    }
}

export default Stores;
