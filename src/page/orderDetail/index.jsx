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

    if (isLoading) {
        return <Loading />;
    }

    if (!order || orderItems.length === 0) {
        return <div className="alert alert-danger">Không tìm thấy đơn hàng</div>;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5">
                <OrderStatus orderId={order.orderId} date={order.date} status={order.status} />

                {/* Bảng thông tin khách hàng và tổng quan đơn hàng */}
                <div className="order-summary">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Total Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.users?.name || 'N/A'}</td>
                                <td>{order.users?.phone || 'N/A'}</td>
                                <td>{order.users?.address || 'N/A'}</td>
                                <td>{order.totalQuantity || 0}</td>
                                <td>{order.totalOrderPrice ? order.totalOrderPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} đồng</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bảng thông tin các sản phẩm */}
                <h3>Order Items</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item.fishId}>
                                    <td>{item.fishName || 'N/A'}</td>
                                    <td>{item.quantity || 0}</td>
                                    <td>{item.unitPrice ? item.unitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} đồng</td>
                                    <td>{item.totalPrice ? item.totalPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} đồng</td>
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
