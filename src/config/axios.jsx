import axios from "axios";

// Đảm bảo đúng cổng của API backend
const baseURL = "http://localhost:8080";

// Tạo instance axios với baseURL
const api = axios.create({
    baseURL: baseURL
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

    return Promise.reject(error);
});

// Interceptor phản hồi
api.interceptors.response.use(
    (response) => {
        // Xử lý phản hồi thành công
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
            return;
        }

        if (error.code === 'ECONNABORTED') {
            console.error("Request timeout:", error);
            alert("Đã xảy ra lỗi, vui lòng tải lại trang.");
        } else {
            console.error("Response error:", error);
        }
        return Promise.reject(error);
    }
);

export default api;
