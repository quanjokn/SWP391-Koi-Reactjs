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
            const userId = user ? user.id : null;   
            if (!userId) {
                alert("Bạn cần đăng nhập trước khi đặt hàng.");
                return navigate(`/login`);
            }
    
            // Gửi yêu cầu POST đến API để đặt hàng
            api.post(`http://localhost:8080/orderDetail/placeOrder/${userId}`)
                .then((response) => {
                    // Nhận được OrderID từ phản hồi
                    const orderId = response.data.id;
                    
                    // Chuyển hướng sang trang chi tiết đơn hàng và truyền orderId
                    navigate(`/orders/${orderId}`);
                    
                })
                .catch((error) => {
                    console.error("Error placing order:", error);
                    alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
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
