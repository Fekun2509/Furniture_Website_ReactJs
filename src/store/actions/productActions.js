import actionTypes from './actionTypes';
import productService from '../../services/productService';

//Fetch Categories

export const fetchCategoryStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await productService.getAllCategoriesService("ALL")
            // console.log(res)
            if (res && res.errCode === 0) {
                dispatch(fetchCategorySuccess(res.categories))
            } else {
                dispatch(fetchCategoryFailed())
            }
        } catch (e) {
            dispatch(fetchCategoryFailed())
            console.log('fetchCategoryStart error', e)
        }
    }
}

export const fetchCategorySuccess = (categoryData) => ({
    type: actionTypes.FETCH_CATEGORY_SUCCESS,
    categories: categoryData
})

export const fetchCategoryFailed = () => ({
    type: actionTypes.FETCH_CATEGORY_FAILED
})


//Fetch Products
export const fetchAllProductStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await productService.getAllProductService("ALL")
            if (res && res.errCode === 0) {
                dispatch(fetchAllProductSuccess(res.products))
            } else {
                dispatch(fetchAllProductFailed())
            }
        } catch (e) {
            dispatch(fetchAllProductFailed())
            console.log('fetchCategoryStart error', e)
        }
    }
}

export const fetchAllProductSuccess = (productData) => ({
    type: 'FETCH_ALL_PRODUCT_SUCCESS',
    products: productData
})

export const fetchAllProductFailed = () => ({
    type: 'FETCH_ALL_PRODUCT_FAILED'
})

//Create new product

export const createNewProduct = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log('check data', data)
            let res = await productService.createNewProductService(data)
            if (res && res.errCode === 0) {
                dispatch(saveProductSuccess())
            } else {
                dispatch(saveProductFailed())
            }
        } catch (e) {
            dispatch(saveProductFailed())
            console.log('creatNewProduct error', e)
        }
    }
}


export const saveProductSuccess = (data) => ({
    type: 'SAVE_PRODUCT_SUCCESS',
    products: data
})

export const saveProductFailed = () => ({
    type: 'SAVE_PRODUCT_FAILED'
})

export const editProduct = (data) => {
    return async (dispatch) => {
        try {
            let res = await productService.editProductService(data);
            return res;
        } catch (e) {
            console.log('editProduct error', e);
        }
    }
}

export const deleteProduct = (id) => {
    return async (dispatch) => {
        try {
            let res = await productService.deleteProductService(id);
            return res;
        } catch (e) {
            console.log('deleteProduct error', e);
        }
    }
}