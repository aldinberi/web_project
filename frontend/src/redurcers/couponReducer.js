const initState = {
    coupons: []
}


const couponReducer = (state = initState, action) => {
    if (action.type === 'LOAD_COUPONS') {
        return {
            ...state,
            coupons: action.coupons
        }
    }

    if (action.type === 'ADD_COUPON') {
        let coupons = [...state.coupons, action.coupon];
        return {
            ...state,
            coupons: coupons
        }
    }

    if (action.type === 'DELETE_COUPON') {
        console.log(action.id);
        let newCoupons = state.coupons.filter(coupon => {
            return coupon._id !== action.id
        });
        return {
            ...state,
            coupons: newCoupons
        }
    }

    if (action.type === 'UPDATE_COUPON') {
        console.log("U reduceru " + action.coupon);
        let newCoupons = state.coupons.map(coupon => {
            if (coupon._id === action.id)
                coupon = action.coupon
            return (coupon)
        });
        console.log(newCoupons);

        return {
            ...state,
            coupons: newCoupons
        }
    }

    return state;
}

export default couponReducer