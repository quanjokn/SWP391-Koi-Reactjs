import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/axios';
import { UserContext } from './UserContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const userId = user ? user.id : null;

    useEffect(() => {
        if (userId) {
            api.post(`/cart/${userId}`)
                .then(response => {
                    setCart(response.data);
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                    } else {
                        console.error("Error fetching cart:", error.message);
                    }
                });
        }
    }, [userId]);

    const updateCart = (newCart) => {
        setCart(newCart);
    };

    const resetCart = () => {
        setCart({ cartItems: [], totalPrice: 0 });
    };

    // Thêm phương thức để cập nhật giỏ hàng
    const fetchCart = () => {
        if (userId) {
            api.post(`/cart/${userId}`)
                .then(response => {
                    setCart(response.data);
                })
                .catch(error => {
                    console.error("Error fetching cart:", error);
                });
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart: updateCart, fetchCart, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};
