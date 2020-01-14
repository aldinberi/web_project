
import React, { Component } from "react";

import ProductTable from "components/Table/ProductTable.jsx"

class Products extends Component {

    render() {
        return (
            <div className="content">
                <ProductTable />
            </div>
        );
    }
}

export default Products;
