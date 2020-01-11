import { combineReducers } from 'redux';
import couponReducer from './couponReducer';
import storeReducer from './storeReducer';
import storeProductReducer from './storeProductReducer'
import userCartReducer from './userCartReducer'
import userReducer from './userReducer';
import productReducer from './productsReducer';

export default combineReducers({
    couponReducer,
    storeReducer,
    userCartReducer,
    userReducer,
    productReducer,
    storeProductReducer
})
