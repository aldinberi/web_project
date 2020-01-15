const initState = {
    products: [],
    next: 0,
}

const userCartHistoryReducer = (state = initState, action) => {

    if (action.type === 'LOAD_CART_ORDERED_PRODUCTS') {
        let products = [...state.products, ...action.products];
        return {
            ...state,
            products: products
        }
    }


    if (action.type === 'ADD_NEXT_CART_ORDERED_PRODUCT') {
        let next = state.next + action.next;
        return {
            ...state,
            next: next
        }
    }


    return state;
}

export default userCartHistoryReducer