const initState = {
    stores: [],


}

const storeReducer = (state = initState, action) => {

    if (action.type === 'LOAD_STORES') {
        console.log(action.stores)
        return {
            ...state,
            stores: action.stores
        }
    }

    if (action.type === 'DELETE_STORE') {
        console.log('Tu sam');
        let newStores = state.stores.filter(store => {
            return store._id !== action.id
        });
        console.log(newStores);
        return {
            ...state,
            stores: newStores
        }
    }

    if (action.type === 'UPDATE_STORE') {
        let newStores = state.stores.map(store => {
            if (store._id === action.id)
                store = action.store
            return (store)
        });
        return {
            ...state,
            stores: newStores
        }
    }

    return state;
}

export default storeReducer