import { combineReducers } from 'redux';
import cuponReducer from './cuponReducer';
import storeReducer from './storeReducer';
import userCartReducer from './userCartReducer'
import userReducer from './userReducer';
import productReducer from './productsReducer';

export default combineReducers({
    cuponReducer,
    storeReducer,
    userCartReducer,
    userReducer,
    productReducer
})
