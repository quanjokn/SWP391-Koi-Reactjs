import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../../config/axios";
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from "../../component/tagbar";
import Masthead from "../../component/masthead";
import styles from "./orders.module.css"; // CSS Module
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../service/UserContext";

const Orders = () => {

    const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là thanh toán khi nhận hàng
    const location = useLocation();
    const cart = location.state?.cart;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handlePlaceOrder = () => {
        if (cart && cart.cartItems.length > 0) {
            const userId = user ? user.id : null;
            if (!userId) {
                alert("Bạn cần đăng nhập trước khi đặt hàng.");
                return navigate(`/login`);
            }

            // Gửi yêu cầu POST đến API để đặt hàng
            api.post(`/orderDetail/placeOrder/${userId}`)
                .then((response) => {
                    return navigate("/thank-you");

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
            <Header />
            <Tagbar />
            <Masthead title={"Đơn hàng của tôi"} />

            <div className={styles["orders-page"]}>
                <div className={styles["orders"]}>
                    <h2 className={styles["orders-title"]}>Tiến hành thanh toán</h2>
                    {cart && cart.cartItems.length > 0 ? (
                        <>
                            <table className={styles["order-table"]}>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.cartItems.map((item) => (
                                        <tr key={item.fishId}>
                                            <td>
                                                <img
                                                    src={item.photo}
                                                    alt={item.fishName}
                                                    className={styles["product-image"]}
                                                />
                                                <h3>{item.fishName}</h3>
                                            </td>
                                            <td>{item.unitPrice.toLocaleString()} VND</td>
                                            <td>{item.quantity}</td>
                                            <td>{(item.unitPrice * item.quantity).toLocaleString()} VND</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles["payment-section"]}>
                                <h3>Chọn phương thức thanh toán</h3>
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
                                    <br />
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
                                <hr />
                                <div className={styles["order-total"]}>
                                    <h3>Tổng thanh toán: {cart.totalPrice.toLocaleString()} VND</h3>
                                    <button onClick={handlePlaceOrder}>Đặt hàng</button>
                                </div>

                            </div>
                        </>
                    ) : (
                        <p>Không tìm thấy đơn hàng nào.</p>
                    )}
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Orders;
