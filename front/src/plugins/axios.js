import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.NODE_ENV === "production" ? "" : 'http://localhost:3000/api/',
});

export default axios;