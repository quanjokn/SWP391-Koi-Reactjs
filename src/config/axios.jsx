import axios from "axios";
const baseUrl = "http://localhost:8080"; // Đảm bảo đúng cổng

const config = {
    baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

// handle before call API
const handleBefore = (config) => {
    // lấy ra cái token và đính kèm vào headers
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

api.interceptors.request.use(handleBefore, null);

export default api;
