import React, { createContext, useState, useEffect } from 'react';
import api from '../config/axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

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
                        // Lưu thông tin người dùng vào state
                        setUser({ ...response.data, token: jwt });
                    })
                    .catch(error => {
                        console.error("Lỗi khi lấy thông tin người dùng:", error);
                        setUser(null);
                    });
            } else {
                // Hết hạn, xóa JWT
                localStorage.removeItem('jwt');
                localStorage.removeItem('userExpiration');
                setUser(null);
            }
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
        <UserContext.Provider value={{ user, setUser, saveUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
