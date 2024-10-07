import React, { useState, useEffect, useContext } from "react";
import api from "../../config/axios";
import Header from "../../component/header";   // Reused Header
import Footer from "../../component/footer";   // Reused Footer
import Tagbar from "../../component/tagbar";   // Reused Tagbar
import styles from "./cart.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../service/UserContext";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const { user } = useContext(UserContext);
    const userId = user ? user.id : null;
    const navigate = useNavigate();

    useEffect(() => {
        api.post(`/cart/${userId}`)
            .then(response => {
                setCart(response.data);
            })
            .catch(error => {
                console.error("Error fetching cart:", error);
            });
    }, [userId]);

    const handleRemoveFromCart = (fishId) => {
        api.delete(`/cart/remove/${fishId}?userId=${userId}`)
            .then(response => {
                setCart(response.data);
            })
            .catch(error => {
                console.error("Error removing item from cart:", error);
            });
    };

    const handleQuantityChange = (fishId, quantity) => {
        if (quantity < 1) {
            alert("Số lượng phải lớn hơn 0");
            return;
        }
        api.put(`/cart/update?userId=${userId}`, {
            fishId: fishId,
            quantity: quantity
        })
            .then(response => {
                setCart(response.data);
            })
            .catch(error => {
                console.error("Error updating quantity:", error);
            });
    };

    const handlePlaceOrder = () => {
        if (cart && cart.cartItems.length > 0) {
            // Chuyển hướng sang trang xác nhận đơn hàng và truyền dữ liệu giỏ hàng
            navigate('/order', {
                state: {
                    cartItems: cart.cartItems,  // Truyền sản phẩm trong giỏ hàng
                    totalPrice: cart.totalPrice // Truyền tổng giá
                }
            });
        } else {
            alert("Giỏ hàng của bạn trống.");
        }
    };

    return (
        <>
            <Header /> {/* Included Header */}
            <Tagbar /> {/* Included Tagbar */}

            <div className={styles["cart-page"]}>
                <h2 className={styles["cart-title"]}>Giỏ hàng của bạn</h2>

                <div className={styles["cart-container"]}>
                    {cart && cart.cartItems.length > 0 ? (
                        cart.cartItems.map(item => (
                            <div key={item.fishId} className={styles["cart-item"]}>
                                <img src={item.photo} alt={item.fishName} />
                                <h3>{item.fishName}</h3>
                                <p>Đơn giá: {item.unitPrice} VND</p>
                                <p>
                                    Số lượng:
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.fishId, e.target.value)}
                                    />
                                </p>
                                <p>Tổng giá: {item.totalPrice} VND</p>
                                <button
                                    className={styles["remove-button"]}
                                    onClick={() => handleRemoveFromCart(item.fishId)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Giỏ hàng của bạn trống.</p>
                    )}
                </div>

                {cart && cart.cartItems.length > 0 && (
                    <div className={styles["cart-total"]}>
                        <h3>Tổng tiền: {cart.totalPrice} VND</h3>
                        <button
                            className={styles["place-order-button"]}
                            onClick={handlePlaceOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                )}
            </div>

            <Footer /> {/* Included Footer */}
        </>
    );
};

export default Cart;
