import { stringify } from "react-auth-wrapper/helpers"
import axios from "../axios"



const handleLogin = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}


export default { handleLogin }