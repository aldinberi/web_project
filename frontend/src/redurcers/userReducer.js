const initState = {
    routes: [],


}


const userReducer = (state = initState, action) => {

    if (action.type === 'ADD_ROUTES') {
        return {
            ...state,
            routes: action.routes
        }
    }

    return state;
}

export default userReducer