import { stringify } from "react-auth-wrapper/helpers"
import axios from "../axios"



const handleLogin = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}


const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('check data from message ', data)
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    // return axios.delete('/api/delete-user', { id: userId })
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}


const handleGoogleLogin = (accessToken) => {
    return axios.post('/api/auth/google', { accessToken })
}

const handleFacebookLogin = (accessToken, userId) => {
    return axios.post('/api/auth/facebook', { accessToken, userId })
}

export default { handleLogin, getAllUsers, createNewUserService, deleteUserService, editUserService, handleGoogleLogin, handleFacebookLogin }