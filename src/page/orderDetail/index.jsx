import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import OrderStatus from '../../component/orderStatus/index';
import styles from './orderDetail.module.css';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams để lấy orderId từ URL

const OrderDetail = () => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({});
    const [feedbacks, setFeedbacks] = useState({});
    const navigate = useNavigate();
    const { orderId } = useParams(); // Lấy orderId từ URL

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.post(`/order/orderDetail/${orderId}`);
                const orderDTO = response.data;
                if (orderDTO) {
                    setOrder(orderDTO);
                    setOrderItems(orderDTO.orderDetailsDTO);
                } else {
                    console.error('No order data received from backend API');
                    navigate('/error');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    // useEffect(() => {
    //     if (orderItems.length > 0) {
    //         const fetchFeedbacks = async () => {
    //             try {
    //                 // Thay đổi để kiểm tra feedback theo orderId
    //                 const feedbackResponse = await api.get(`/feedback/order/${orderId}`);
    //                 if (feedbackResponse.data) {
    //                     setFeedbacks(feedbackResponse.data); // Lưu feedback cho toàn bộ order
    //                 } else {
    //                     setFeedbacks(null); // Nếu không có feedback
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching feedbacks:', error);
    //             }
    //         };
    //         fetchFeedbacks();
    //     }
    // }, [orderId, orderItems]);

    useEffect(() => {
        // Thiết lập khoảng cách giữa container và footer
        setContainerStyle({
            marginBottom: '48px', // Cách footer 48px
        });

        // Cleanup function để phục hồi trạng thái khi rời khỏi trang
        return () => {
            setContainerStyle({}); // Phục hồi trạng thái ban đầu
        };
    }, []);

    const handleReviewClick = () => {
        navigate(`/review/${orderId}/${orderItems[0]?.fishId}`);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5" style={containerStyle}> {/* Áp dụng style cho container */}
                <OrderStatus orderId={order.orderId} date={order.date} status={order.status} />

                {/* Bảng hóa đơn */}
                <h3 className={styles.orderDetailH3}>Hóa đơn</h3>
                <div className="order-summary">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Tên khách hàng</th>
                                <th className={styles.textLeft}>Số điện thoại</th>
                                <th className={styles.textLeft}>Địa chỉ</th>
                                <th className={styles.textLeft}>Tổng số lượng</th>
                                <th className={styles.textLeft}>Thành tiền VND</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.textLeft}>{order.users?.name || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.users?.phone || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.users?.address || 'N/A'}</td>
                                <td className={styles.textRight}>{order.totalQuantity || 0}</td>
                                <td className={styles.textRight}>{order.totalOrderPrice ? order.totalOrderPrice.toLocaleString('vi-VN') : 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bảng thông tin các sản phẩm */}
                <h3 className={styles.orderDetailH3}>Thông tin chi tiết</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Tên cá</th>
                                <th className={styles.textLeft}>Số lượng</th>
                                <th className={styles.textLeft}>Giá tiền VND</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item.fishId}>
                                    <td className={styles.textLeft}>{item.fishName || 'N/A'}</td>
                                    <td className={styles.textRight}>{item.quantity || 0}</td>
                                    <td className={styles.textRight}>{item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Nút Nhận xét ở giữa trang */}
                {order.status === 'Completed' && (
                    <div className={styles.ReviewButton}>
                        <div className="text-center mt-4">
                            <button className="btn btn-primary" onClick={handleReviewClick}>
                                Nhận xét đơn hàng
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderDetail;
