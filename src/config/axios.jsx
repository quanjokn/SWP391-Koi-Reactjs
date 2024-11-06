import axios from "axios";

// Đảm bảo đúng cổng của API backend
const baseURL = "http://localhost:8080";

// Tạo instance axios với baseURL
const api = axios.create({
    baseURL: baseURL,
    timeout: 15000
});

// Hàm xử lý trước khi gọi API (interceptor)
const handleBefore = (config) => {
    // Lấy token từ localStorage và đính kèm vào headers nếu có
    const token = localStorage.getItem("jwt");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

// Interceptor để đính kèm token vào tất cả các request
api.interceptors.request.use(handleBefore, (error) => {
    if (error.code === 'ECONNABORTED') {
        // Xử lý lỗi timeout
        console.warn("Request timeout, please reset the page.");
    }
    // Yêu cầu người dùng reset lại trang
    alert("Đã xảy ra lỗi, vui lòng tải lại trang.");

    // Có thể thêm logic để reload trang nếu cần
    window.location.reload();
    return Promise.reject(error);
});

export default api;
