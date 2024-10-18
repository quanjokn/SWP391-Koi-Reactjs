import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import ConsignSellStatus from '../../component/consignSellStatus';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import styles from './orderListConsignSellDt.module.css';
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
                    <h3>Thông tin khách hàng</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Tên khách hàng</th>
                                <th className={styles.textLeft}>Số điện thoại</th>
                                <th className={styles.textLeft}>Địa chỉ</th>
                                <th className={styles.textLeft}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.textLeft}>{order.customer?.name || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.customer?.phone || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.customer?.address || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.customer?.email || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Thông tin đơn ký gửi để bán */}
                <div className="order-summary mt-4">
                    <h3>Thông tin đơn ký gửi để bán</h3>
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>ID đơn ký gửi</th>
                                <th className={styles.textLeft}>Ngày ký gửi</th>
                                <th className={styles.textLeft}>Định giá VND</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.textLeft}>{order.orderID || 'N/A'}</td>
                                <td className={styles.textLeft}>{new Date(order.request.date).toLocaleDateString() || 'N/A'}</td>
                                <td className={styles.textRight}>{order.request.totalPrice ? order.request.totalPrice.toLocaleString('vi-VN') : '0'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bảng thông tin cá Koi được bán */}
                <h3 className="mt-4">Thông tin cá Koi được bán</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Tên cá</th>
                                <th className={styles.textLeft}>Giới tính</th>
                                <th className={styles.textLeft}>Tuổi</th>
                                <th className={styles.textLeft}>Kích cỡ</th>
                                <th className={styles.textLeft}>Tình trạng sức khỏe</th>
                                <th className={styles.textLeft}>Chế độ ăn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.request?.ConsignList || []).map((koi) => (
                                <tr key={koi.fishID}>
                                    <td className={styles.textLeft}>{koi.name || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.sex || 'N/A'}</td>
                                    <td className={styles.textRight}>{koi.age || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.size || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.healthStatus || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.ration || 'N/A'}</td>
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
