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
            if (!userId) {
                alert("Bạn cần đăng nhập trước khi đặt hàng.");
                return navigate(`/login`);
            }

            // Chuyển hướng sang trang Order và truyền dữ liệu giỏ hàng qua state
            navigate('/orders', { state: { cart: cart } });
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
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Tổng tiền</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart && cart.cartItems.length > 0 ? (
                                cart.cartItems.map(item => (
                                    <tr key={item.fishId}>
                                        <td>
                                            <img src={item.photo} alt={item.fishName} />
                                            <h3>{item.fishName}</h3>
                                        </td>
                                        <td>{item.unitPrice.toLocaleString()} VND</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.fishId, e.target.value)}
                                            />
                                        </td>
                                        <td>{(item.unitPrice * item.quantity).toLocaleString()} VND</td>
                                        <td>
                                            <button
                                                className={styles["remove-button"]}
                                                onClick={() => handleRemoveFromCart(item.fishId)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className={`${styles.textLeft} ${styles.ifEmpty}`}>Giỏ hàng của bạn trống</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>

                {cart && cart.cartItems.length > 0 && (
                    <div className={styles["cart-total"]}>
                        <h3>Tổng thanh toán: {cart.totalPrice.toLocaleString()} VND</h3>
                        <button
                            className={styles["place-order-button"]}
                            onClick={handlePlaceOrder}
                        >
                            Đi đến thanh toán
                        </button>
                    </div>
                )}
            </div>

            <Footer /> {/* Included Footer */}
        </>
    );
};

export default Cart;
