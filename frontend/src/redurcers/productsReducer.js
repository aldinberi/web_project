const initState = {
    products: [],


}


const productReducer = (state = initState, action) => {

    if (action.type === 'LOAD_PRODUCTS') {
        let products = [...state.products, ...action.products];
        return {
            ...state,
            products: products
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
        let newProducts = state.products.filter(product => {
            return product._id !== action.id
        });
        return {
            ...state,
            products: newProducts
        }
    }

    if (action.type === 'UPDATE_PRODUCT') {
        action.product._id = action.id;
        let new_pro = JSON.parse(JSON.stringify(action.product));
        let newProducts = state.products.map(product => {
            if (product._id === action.id) {
                product = new_pro
            }
            return (product)

        });
        console.log("REc");
        console.log(newProducts);
        return {
            ...state,
            products: newProducts
        }
    }

    return state;
}

export default productReducer