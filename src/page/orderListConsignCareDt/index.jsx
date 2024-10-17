import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import ConsignCareStatus from '../../component/consignCareStatus';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetailConSignCare = () => {
    const [order, setOrder] = useState(null);
    const [order2, setOrder2] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({});
    const navigate = useNavigate();
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.post(`/caringOrder/detail/${orderId}`);
                const caringOrder = response.data.caringOrder;
                const caredOrder = response.data;
                console.log(response);
                if (caredOrder) {
                    setOrder2(caredOrder);
                }
                if (caringOrder) {
                    setOrder(caringOrder);
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
                <ConsignCareStatus
                    orderId={order.id || 'N/A'}
                    date={new Date(order.date).toLocaleDateString()}
                    status={order.status || 'N/A'}
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
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.id || 'N/A'}</td>
                                <td>{new Date(order.startDate).toLocaleDateString() || 'N/A'}</td>
                                <td>{new Date(order.endDate).toLocaleDateString() || 'N/A'}</td>
                                <td>{order.totalPrice ? order.totalPrice.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'} đồng</td>
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
                            {(order2?.caredKois || []).map((koi) => (
                                <tr key={koi.id}>
                                    <td>{koi.name || 'N/A'}</td>
                                    <td>{koi.sex || 'N/A'}</td>
                                    <td>{koi.age || 'N/A'}</td>
                                    <td>{koi.size || 'N/A'}</td>
                                    <td>{koi.healthStatus || 'N/A'}</td>
                                    <td>{koi.ration || 'N/A'}</td>
                                </tr>
                            ))}

                            {(!order2?.caredKois || order2.caredKois.length === 0) && (
                                <tr>
                                    <td colSpan="7">Không có cá Koi được chăm sóc</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Thông tin nhân viên phụ trách */}
                <h3 className="mt-4">Staff Information</h3>
                <div className="staff-info">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Staff Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.staff?.name || 'N/A'}</td>
                                <td>{order.staff?.phone || 'N/A'}</td>
                                <td>{order.staff?.address || 'N/A'}</td>
                                <td>{order.staff?.email || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetailConSignCare;
