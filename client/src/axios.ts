import axios from "axios";

const api = axios.create({
    baseURL: "https://fouramood.onrender.com",
   });

api.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

export default api;