import React, { useEffect, useState,useContext } from "react";
import api from "../../config/axios";
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from "../../component/tagbar";
import Masthead from "../../component/masthead";
import styles from "./orders.module.css";  // CSS Module
import { UserContext } from "../../service/UserContext";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    const { user } = useContext(UserContext);
    const userId = user ? user.id : null; 

    useEffect(() => {
        api.get(`/order/${userId}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
            });
    }, [userId]);

    return (
        <>
            <Header />
            <Tagbar/>
            <Masthead title={"Đơn hàng của tôi"}/>

            <div className={styles["orders-page"]}>
                <h2 className={styles["orders-title"]}>Đơn hàng của bạn</h2>

                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.orderId} className={styles["order-item"]}>
                            <h3>Đơn hàng #{order.orderId}</h3>
                            <p><strong>Ngày mua:</strong> {order.orderDate}</p>
                            <p><strong>Trạng thái:</strong> {order.status}</p>

                            <div className={styles["order-products"]}>
                                {order.items.map(item => (
                                    <div key={item.fishId} className={styles["product-item"]}>
                                        <img src={item.photo} alt={item.fishName} className={styles["product-image"]} />
                                        <div className={styles["product-details"]}>
                                            <h4>{item.fishName}</h4>
                                            <p>Số lượng: {item.quantity}</p>
                                            <p>Đơn giá: {item.unitPrice.toLocaleString()} VND</p>
                                            <p>Tổng: {item.totalPrice.toLocaleString()} VND</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles["order-total"]}>
                                <strong>Tổng tiền đơn hàng:</strong> {order.totalPrice.toLocaleString()} VND
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
