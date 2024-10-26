import React, { useState, useContext } from "react";
import { redirect, useLocation } from "react-router-dom";
import api from "../../config/axios";
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from "../../component/tagbar";
import Masthead from "../../component/masthead";
import styles from "./orders.module.css"; // CSS Module
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../service/UserContext";
import { CartContext } from "../../service/CartContext";

const Orders = () => {

    const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là thanh toán khi nhận hàng
    const location = useLocation();
    const [generateId, setGenerateId] = useState('');
    const cart = location.state?.cart;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { resetCart } = useContext(CartContext);
    console.log(cart)

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleVnpayClick = async () => {
        try {
            const response = await api.post(`/staff/generateOrderId`, {});
            setGenerateId(response.data);
        } catch (error) {
            alert("Có lỗi xảy ra khi lấy đường dẫn thanh toán. Vui lòng thử lại.");
            return null; // Trả về null nếu có lỗi
        }
    }

    const handlePlaceOrder = () => {
        if (cart && cart.cartItems.length > 0) {
            const userId = user ? user.id : null;
            if (!userId) {
                alert("Bạn cần đăng nhập trước khi đặt hàng.");
                return navigate(`/login`);
            }
            if (user.address != null) {
                if (user.address != "") {
                    if (paymentMethod == "VNPAY") {
                        const type = 'order';
                        const orderId = '0';
                        return navigate(`/vnpay/onlinePayment/${type}/${userId}/${orderId}/${generateId}/${user.point >= 200 ? (cart.totalPrice * 0.9).toFixed(0) : cart.totalPrice}`);
                    } else {
                        // Gửi yêu cầu POST đến API để đặt hàng
                        api.post(`/order/placeOrder`, {
                            userId: userId,
                            paymentMethod: paymentMethod,
                        })
                            .then((response) => {
                                alert("Đặt hàng thành công!");;
                                resetCart();
                                return navigate("/thank-you");
                            })
                            .catch((error) => {
                                console.error("Error placing order:", error);
                                alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
                            });
                    }
                } else {
                    navigate('/tai-khoan');
                    alert("Vui lòng thêm địa chỉ !");
                    }
                }     
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

                        </>
                    ) : (
                        <p>Không tìm thấy đơn hàng nào.</p>
                    )}

                    <div className={styles["info-pay"]}>
                        <div className={styles["payment-section"]}>
                            {user ? (
                                <>
                                    <strong>Thông tin khách hàng</strong>
                                    <p className={styles.textLeft}>Tên: {user.name}</p>
                                    <p className={styles.textLeft}>Số điện thoại: {user.phone}</p>
                                    <p className={styles.textLeft}>
                                        Địa chỉ: {user.address ? user.address : <span className={styles.error}>Bạn cần thêm địa chỉ để hoàn thành đơn hàng</span>}
                                    </p>
                                </>
                            ) : (
                                <p>Không tìm thấy đơn hàng nào.</p>
                            )}
                        </div>


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
                                <label onClick={handleVnpayClick}>
                                    <input
                                        type="radio"
                                        value="VNPAY"
                                        checked={paymentMethod === "VNPAY"}
                                        onChange={handlePaymentChange}
                                    />
                                    Chuyển khoản
                                </label>
                            </div>
                            <hr />
                            <div className={styles["order-total"]}>
                                <h3>
                                    Tổng thanh toán:{" "}
                                    {user.point >= 200
                                        ? (cart.totalPrice * 0.9).toLocaleString('vi-VN')
                                        : cart.totalPrice.toLocaleString('vi-VN')
                                    } VND
                                </h3>
                                <button onClick={handlePlaceOrder}>Đặt hàng</button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
            <Footer />
        </>
    );
};

export default Orders;
