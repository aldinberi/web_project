const initState = {
    coupons: []
}


const couponReducer = (state = initState, action) => {
    if (action.type === 'LOAD_COUPONS') {
        let coupons = [...state.coupons, ...action.coupons];
        return {
            ...state,
            coupons: coupons
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
        action.coupon._id = action.id;
        let new_coup = JSON.parse(JSON.stringify(action.coupon));
        let newCoupons = state.coupons.map(coupon => {
            if (coupon._id === action.id)
                coupon = new_coup
            return (coupon)
        });

        return {
            ...state,
            coupons: newCoupons
        }
    }

    return state;
}

export default couponReducer