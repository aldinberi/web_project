
import React, { Component } from "react";

import StoreTable from "components/Table/StoreTable.jsx"
import StoreProductsTable from "components/Table/StoreProductsTable.jsx"

class Stores extends Component {

    render() {
        return (
            <div className="content">
                <StoreTable />
                <StoreProductsTable />
            </div>
        );
    }
}

export default Stores;
