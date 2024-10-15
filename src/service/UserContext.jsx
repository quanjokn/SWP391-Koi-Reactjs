import React, { createContext, useState, useEffect } from 'react';
import api from '../config/axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        const expirationTime = localStorage.getItem('userExpiration');

        // Kiểm tra nếu JWT tồn tại và chưa hết hạn
        if (jwt && expirationTime) {
            const now = new Date().getTime();
            if (now < expirationTime) {
                api.get('/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                })
                    .then(response => {
                        setUser({ ...response.data, token: jwt });
                    })
                    .catch(error => {
                        console.error("Lỗi khi lấy thông tin người dùng:", error);
                        setUser(null);
                    })
                    .finally(() => setLoading(false));  // Hết quá trình tải
            } else {
                localStorage.removeItem('jwt');
                localStorage.removeItem('userExpiration');
                setUser(null);
                setLoading(false);  // Kết thúc quá trình tải
            }
        } else {
            setLoading(false);  // Kết thúc quá trình tải nếu không có jwt
        }
    }, []);

    const saveUser = (userData) => {
        const now = new Date().getTime();
        const expirationTime = now + 15 * 60 * 1000; // 15 phút sau

        // Lưu JWT nếu có
        if (userData.jwt) {
            localStorage.setItem('jwt', userData.jwt);
        }
        localStorage.setItem('userExpiration', expirationTime);
        // Lưu trữ cả jwt và thông tin người dùng
        setUser(userData);
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userExpiration');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, saveUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
