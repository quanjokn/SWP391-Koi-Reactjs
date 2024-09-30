import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const expirationTime = localStorage.getItem('userExpiration');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing JSON from localStorage:", error);
            }
        }

        // Kiểm tra thời gian hết hạn
        if (storedUser && expirationTime) {
            const now = new Date().getTime();
            if (now < expirationTime) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Error parsing JSON from localStorage:", error);
                }
            } else {
                // Nếu hết hạn, xóa dữ liệu
                localStorage.removeItem('user');
                localStorage.removeItem('userExpiration');
            }
        }
    }, []);

    const saveUser = (userData) => {
        const now = new Date().getTime();
        const expirationTime = now + 5 * 60 * 1000; // 5 phút sau

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userExpiration', expirationTime);
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, saveUser }}>
            {children}
        </UserContext.Provider>
    );
};
