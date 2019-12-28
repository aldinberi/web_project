const initState = {
    products: [],


}


const productReducer = (state = initState, action) => {
    if (action.type === 'ADD_PRODUCTS') {
        return {
            ...state,
            products: action.products
        }
    }
    return state;
}

export default productReducer