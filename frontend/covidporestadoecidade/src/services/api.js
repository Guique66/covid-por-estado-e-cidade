import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/public/',
    timeout: 6000000,

});

export default api