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
                console.log('Full API Response:', response);
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

    if (!order || !orderItems) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5" ref={containerRef}>

                <OrderStatus orderId={order.id} date={order.date} status={order.status} /> {/* Thêm OrderStatus */}
                <table className="table table-striped table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Total Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{order.customerName}</td>
                            <td>{order.totalQuantity}</td>
                            <td>${order.totalOrderPrice ? order.totalOrderPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                        </tr>
                    </tbody>
                </table>
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
                                <td>${item.unitPrice ? item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                                <td>${item.totalPrice ? item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
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
