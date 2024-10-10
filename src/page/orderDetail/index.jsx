import React, { useState, useEffect, useRef } from 'react';
import api from '../../config/axios';
import OrderStatus from '../../component/orderStatus/index';
import './orderDetail.module.css';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';

const OrderDetail = () => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const containerRef = useRef(null); // Tạo ref cho container

    useEffect(() => {
        const orderId = 1; // Thay thế bằng ID đơn hàng thực tế
        api.post(`/orderDetail/${orderId}`)
            .then(response => {
                const orderDTO = response.data;
                if (orderDTO) {
                    setOrder(orderDTO);
                    setOrderItems(orderDTO.orderDetailsDTO);
                } else {
                    console.error('No order data received from backend API');
                }
            })
            .catch(error => {
                console.error(error);
            });

        // Cập nhật marginBottom cho container
        if (containerRef.current) {
            containerRef.current.style.marginBottom = "48px";
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.style.marginBottom = "";
            }
        };
    }, []);

    if (!order || !orderItems.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5" ref={containerRef}>
                <OrderStatus orderId={order.orderId} date={order.date} status={order.status} /> {/* Thêm OrderStatus */}

                {/* Bảng thông tin khách hàng và tổng quan đơn hàng */}
                <table className="table table-striped table-bordered mt-4">
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
                            <td>{order.users?.name}</td>
                            <td>{order.users?.phone}</td>
                            <td>{order.users?.address || 'N/A'}</td> {/* Kiểm tra nếu không có address */}
                            <td>{order.totalQuantity}</td>
                            <td>{order.totalOrderPrice ? order.totalOrderPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} đồng</td>
                        </tr>
                    </tbody>
                </table>

                {/* Bảng chi tiết các sản phẩm trong đơn hàng */}
                <h3>Order Items</h3>
                <table className="table table-striped table-bordered">
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
                                <td>{item.fishName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unitPrice ? item.unitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} đồng</td>
                                <td>{item.totalPrice ? item.totalPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} đồng</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetail;
