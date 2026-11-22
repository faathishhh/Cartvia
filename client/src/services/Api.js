import axios from "axios";
import API_URL from "./api";

const API = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default API;