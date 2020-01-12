const initState = {
    stores: [],
    next: 0
}

const storeReducer = (state = initState, action) => {

    if (action.type === 'ADD_STORE') {
        let stores = [...state.stores, action.store];
        return {
            ...state,
            stores: stores
        }
    }

    if (action.type === 'ADD_NEXT_STORE') {
        let next = state.next + action.next;
        return {
            ...state,
            next: next
        }
    }

    if (action.type === 'LOAD_STORES') {
        let stores = [...state.stores, ...action.stores];
        return {
            ...state,
            stores: stores
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
        let newStores = state.stores.map(store => {
            if (store._id === action.id)
                store = new_store
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