import axios from "axios";

// Đảm bảo đúng cổng của API backend
const baseURL = "http://localhost:8080";

// Tạo instance axios với baseURL
const api = axios.create({
    baseURL: baseURL,
});

// Hàm xử lý trước khi gọi API (interceptor)
const handleBefore = (config) => {
    // Lấy token từ localStorage và đính kèm vào headers nếu có
    const token = localStorage.getItem("jwt"); // Loại bỏ dấu ngoặc kép
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

// Interceptor để đính kèm token vào tất cả các request
api.interceptors.request.use(handleBefore, (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
});

export default api;
