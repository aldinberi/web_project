const initState = {
    products: [],
    next: 0,
    total_price: 0
}

const userCartReducer = (state = initState, action) => {

    if (action.type === 'LOAD_CART_PRODUCTS') {
        let products = [...state.products, ...action.products];
        return {
            ...state,
            products: products
        }
    }

    if (action.type === 'ADD_NEXT_CART_PRODUCT') {
        let next = state.next + action.next;
        return {
            ...state,
            next: next
        }
    }

    if (action.type === 'ADD_CART_PRODUCT') {
        let products = [...state.products, action.product];
        return {
            ...state,
            products: products
        }
    }

    if (action.type === 'REMOVE_ALL_CART_PRODUCT') {
        return {
            ...state,
            products: []
        }
    }

    if (action.type === 'UPDATE_CART_PRICE') {
        return {
            ...state,
            total_price: action.price
        }
    }

    if (action.type === 'DELETE_CART_PRODUCT') {
        let newProducts = state.products.filter(product => {
            return product._id !== action.id
        });
        return {
            ...state,
            products: newProducts
        }
    }

    if (action.type === 'UPDATE_CART_PRODUCT') {
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

export default userCartReducer