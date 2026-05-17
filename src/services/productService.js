import { stringify } from "react-auth-wrapper/helpers"
import axios from "../axios"


const getAllCategoriesService = (inputData) => {
    return axios.get(`/api/get-categories?id=${inputData}`)
}

const createNewProductService = (data) => {
    return axios.post(`/api/create-new-product`, data)
}

const uploadImage = (imageData) => {
    return axios.post('/api/upload-image', imageData, {
        headers: { 'Content-Type': 'multipart/form-data' } // ← thêm header
    });
}

const getAllProductService = (inputData) => {
    return axios.get(`/api/get-all-products?id=${inputData}`)
}


const editProductService = (data) => {
    return axios.put(`/api/edit-product`, data);
}

const deleteProductService = (id) => {
    return axios.delete(`/api/delete-product?id=${id}`);
}

export default { getAllCategoriesService, createNewProductService, uploadImage, getAllProductService, editProductService, deleteProductService }