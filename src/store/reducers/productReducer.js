import actionTypes from '../actions/actionTypes';

const initialState = {
    categories: [],
    products: [],

}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_CATEGORY_SUCCESS:
            state.categories = action.categories
            return {
                ...state,
            }
        case actionTypes.FETCH_CATEGORY_FAILED:
            state.categories = []

            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_SUCCESS:
            state.products = action.products
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_FAILED:
            state.products = []
            return {
                ...state
            }
        default:
            return state;
    }
}

export default productReducer;