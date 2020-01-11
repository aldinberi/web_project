const initState = {
    products: [],
    storeNames: [],
    productNames: []
}

const storeProductReducer = (state = initState, action) => {

    if (action.type === 'LOAD_STORE_NAMES') {
        return {
            ...state,
            storeNames: action.storeNames
        }
    }

    if (action.type === 'LOAD_PRODUCT_NAMES') {
        return {
            ...state,
            productNames: action.productNames
        }
    }

    if (action.type === 'LOAD_STORE_PRODUCTS') {
        let products = [...state.products, ...action.products];
        return {
            ...state,
            products: products
        }
    }

    if (action.type === 'ADD_STORE_PRODUCT') {
        let products = [...state.products, action.product];
        return {
            ...state,
            products: products
        }
    }

    if (action.type === 'DELETE_STORE_PRODUCT') {
        let newProducts = state.products.filter(product => {
            return product._id !== action.id
        });
        return {
            ...state,
            products: newProducts
        }
    }

    if (action.type === 'UPDATE_STORE_PRODUCT') {
        action.product._id = action.id;
        let new_pro = JSON.parse(JSON.stringify(action.product));
        let newProducts = state.products.map(product => {
            if (product._id === action.id) {
                product = new_pro
            }
            return (product)

        });
        return {
            ...state,
            products: newProducts
        }
    }

    return state;
}

export default storeProductReducer