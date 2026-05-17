import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import productReducer from './productReducer'
import appReducer from "./appReducer";
import userReducer from "./userReducer";
import cartReducer from "./cartReducer";

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: 'user',
    whitelist: ['isLoggedIn', 'userInfo']
};

const appPersistConfig = {
    ...persistCommonConfig,
    key: 'app',
    whitelist: ['language']
};

const cartPersistConfig = {
    ...persistCommonConfig,
    key: 'cart',
    whitelist: ['items'],
};

export default (history) => combineReducers({
    router: connectRouter(history),
    user: persistReducer(userPersistConfig, userReducer),
    app: persistReducer(appPersistConfig, appReducer),
    product: productReducer,
    cart: persistReducer(cartPersistConfig, cartReducer),
})