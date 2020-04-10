import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.BASE_URL | 'http://localhost:3000/api/',
});

export default axios;