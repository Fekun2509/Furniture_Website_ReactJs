import actionTypes from './actionTypes';

export const cartAddItem = (product, quantity = 1) => ({
    type: actionTypes.CART_ADD_ITEM,
    payload: { product, quantity },
});

export const cartRemoveItem = (id) => ({
    type: actionTypes.CART_REMOVE_ITEM,
    payload: { id },
});

export const cartUpdateQuantity = (id, quantity) => ({
    type: actionTypes.CART_UPDATE_QUANTITY,
    payload: { id, quantity },
});

export const cartClear = () => ({
    type: actionTypes.CART_CLEAR,
});

export const cartToggleDrawer = () => ({
    type: actionTypes.CART_TOGGLE_DRAWER,
});
