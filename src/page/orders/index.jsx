import React, { useEffect, useState, useContext } from "react";
import api from "../../config/axios";
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from "../../component/tagbar";
import Masthead from "../../component/masthead";
import styles from "./orders.module.css";  // CSS Module
import { UserContext } from "../../service/UserContext";
import { useParams } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(UserContext);
    const userId = user ? user.id : null;
    const { orderId } = useParams();


    useEffect(() => {
        if (orderId) { // Kiểm tra nếu orderIdFromState không phải là null
            // Gọi API để lấy chi tiết đơn hàng bằng orderId được truyền từ state
            api.post(`/orderDetail/${orderId}`)
                .then(response => {
                    setOrders([response.data]); // Đặt đơn hàng vào state
                })
                .catch(error => {
                    console.error("Error fetching order details:", error);
                });
        } else {
            console.warn("No orderId provided in state.");
        }
    }, [orderId]);

    const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là thanh toán khi nhận hàng

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handlePlaceOrder = () => {
        // Xử lý đặt hàng và bao gồm paymentMethod trong dữ liệu gửi lên server
        
        
    };

    return (
        <>
            <Header />
            <Tagbar />
            <Masthead title={"Đơn hàng của tôi"} />

            <div className={styles["orders-page"]}>
                <h2 className={styles["orders-title"]}>Đơn hàng của bạn</h2>

                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.orderId} className={styles["order-item"]}>
                            <h3>Đơn hàng #{order.orderId}</h3>
                            <p><strong>Ngày mua:</strong> {new Date(order.date).toLocaleDateString()}</p>
                            <p><strong>Trạng thái:</strong> {order.status}</p>

                            <div className={styles["order-products"]}>
                                {order.orderDetailsDTO.map(item => (
                                    <div key={item.fishId} className={styles["product-item"]}>
                                        <img src={item.photo} alt={item.fishName} className={styles["product-image"]} />
                                        <div className={styles["product-details"]}>
                                            <h4>{item.fishName}</h4>
                                            <p>Số lượng: {item.quantity}</p>
                                            <p>Đơn giá: {item.unitPrice.toLocaleString()} VND</p>
                                            <p>Tổng: {item.totalPrice.toLocaleString()} VND</p>
                                            <div>
                                                <h2>Chọn phương thức thanh toán</h2>
                                                <div>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value="COD"
                                                            checked={paymentMethod === "COD"}
                                                            onChange={handlePaymentChange}
                                                        />
                                                        Thanh toán khi nhận hàng
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value="BankTransfer"
                                                            checked={paymentMethod === "BankTransfer"}
                                                            onChange={handlePaymentChange}
                                                        />
                                                        Chuyển khoản
                                                    </label>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles["order-total"]}>
                                <strong>Tổng tiền đơn hàng:</strong> {order.totalOrderPrice.toLocaleString()} VND
                                <button onClick={handlePlaceOrder}>Đặt hàng</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Bạn chưa có đơn hàng nào.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Orders;
