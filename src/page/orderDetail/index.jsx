import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import OrderStatus from '../../component/orderStatus/index';
import './orderDetail.module.css';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams để lấy orderId từ URL

const OrderDetail = () => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({}); // State để quản lý style cho container
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
                    navigate('/error'); // Điều hướng nếu không có dữ liệu
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/error'); // Điều hướng nếu có lỗi
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

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
                <h3>Hóa đơn</h3>
                <div className="order-summary">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Tên khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Tổng số lượng</th>
                                <th>Thành tiền VND</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.users?.name || 'N/A'}</td>
                                <td>{order.users?.phone || 'N/A'}</td>
                                <td>{order.users?.address || 'N/A'}</td>
                                <td>{order.totalQuantity || 0}</td>
                                <td>{order.totalOrderPrice ? order.totalOrderPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bảng thông tin các sản phẩm */}
                <h3>Thông tin chi tiết</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Tên cá</th>
                                <th>Số lượng</th>
                                <th>Giá tiền VND</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item.fishId}>
                                    <td>{item.fishName || 'N/A'}</td>
                                    <td>{item.quantity || 0}</td>
                                    <td>{item.unitPrice ? item.unitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetail;
