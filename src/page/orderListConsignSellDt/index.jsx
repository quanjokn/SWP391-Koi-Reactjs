import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import ConsignSellStatus from '../../component/consignSellStatus';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetailConSignSell = () => {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({});
    const navigate = useNavigate();
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.post(`/consignOrder/detail/${orderId}`);
                const orderData = response.data; // Lưu dữ liệu trả về
                setOrder(orderData); // Cập nhật order với dữ liệu trả về
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    useEffect(() => {
        setContainerStyle({
            marginBottom: '48px',
        });

        return () => {
            setContainerStyle({});
        };
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5" style={containerStyle}>
                <ConsignSellStatus
                    orderId={order?.orderID || 'N/A'} // Kiểm tra order trước khi truy cập id
                    date={order ? new Date(order.date).toLocaleDateString() : 'N/A'}
                    status={order?.status || 'N/A'}
                />

                {/* Bảng thông tin khách hàng */}
                <div className="order-summary">
                    <h3>Customer Information</h3>
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.customer?.name || 'N/A'}</td>
                                <td>{order.customer?.phone || 'N/A'}</td>
                                <td>{order.customer?.address || 'N/A'}</td>
                                <td>{order.customer?.email || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Thông tin tổng quan đơn hàng */}
                <div className="order-summary mt-4">
                    <h3>Order Information</h3>
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.orderID || 'N/A'}</td>
                                <td>{new Date(order.request.date).toLocaleDateString() || 'N/A'}</td>
                                <td>{order.request.totalPrice ? order.request.totalPrice.toLocaleString('vi-VN') : '0'} đồng</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bảng thông tin các cá Koi được chăm sóc */}
                <h3 className="mt-4">Cared Kois</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Koi Name</th>
                                <th>Sex</th>
                                <th>Age</th>
                                <th>Size</th>
                                <th>Health Status</th>
                                <th>Ration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.request?.ConsignList || []).map((koi) => (
                                <tr key={koi.fishID}>
                                    <td>{koi.name || 'N/A'}</td>
                                    <td>{koi.sex || 'N/A'}</td>
                                    <td>{koi.age || 'N/A'}</td>
                                    <td>{koi.size || 'N/A'}</td>
                                    <td>{koi.healthStatus || 'N/A'}</td>
                                    <td>{koi.ration || 'N/A'}</td>
                                </tr>
                            ))}

                            {(!order.request?.ConsignList || order.request.ConsignList.length === 0) && (
                                <tr>
                                    <td colSpan="6">Không có cá Koi được chăm sóc</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default OrderDetailConSignSell;
