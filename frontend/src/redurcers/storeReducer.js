const initState = {
    stores: [],


}

const storeReducer = (state = initState, action) => {

    if (action.type === 'LOAD_STORES') {
        return {
            ...state,
            stores: action.stores
        }
    }

    if (action.type === 'DELETE_STORE') {
        let newStores = state.stores.filter(store => {
            return store._id !== action.id
        });

        return {
            ...state,
            stores: newStores
        }
    }

    if (action.type === 'UPDATE_STORE') {
        action.store._id = action.id;
        let new_store = JSON.parse(JSON.stringify(action.store));
        console.log(action.store);
        let newStores = state.stores.map(store => {
            if (store._id === action.id)
                store = new_store
            return (store)
        });
        //console.log(newStores);
        return {
            ...state,
            stores: newStores
        }
    }

    return state;
}

export default storeReducer