const initState = {
    products: [],


}


const productReducer = (state = initState, action) => {

    if (action.type === 'LOAD_PRODUCTS') {
        return {
            ...state,
            products: action.products
        }
    }

    if (action.type === 'ADD_PRODUCT') {
        let products = [...state.products, action.product];
        return {
            ...state,
            products: products
        }
    }

    if (action.type === 'DELETE_PRODUCT') {
        console.log(action.id);
        let newProducts = state.products.filter(product => {
            return product._id !== action.id
        });
        return {
            ...state,
            products: newProducts
        }
    }

    if (action.type === 'UPDATE_PRODUCT') {
        console.log("U reduceru " + action.product);
        let newProducts = state.products.map(product => {
            if (product._id === action.id)
                product = action.product
            return (product)
        });
        console.log(newProducts);

        return {
            ...state,
            products: newProducts
        }
    }

    return state;
}

export default productReducer