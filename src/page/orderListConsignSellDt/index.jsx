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
                console.log(orderData);
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

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return { text: 'Đợi xác nhận' };
            case 'Accepted_Selling':
                return { text: 'Đang bán' };
            case "Sold":
                return { text: 'Đã bán' };
            case 'Done':
                return { text: 'Đã hoàn thành', className: styles.done };
            case 'Rejected':
                return { text: 'Đã bị từ chối', className: styles.rejected };
            default:
                return { text: status, className: '' };
        }
    };

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
                    date={new Date(order.request.date).toLocaleDateString() || 'N/A'}
                    status={order?.status || 'N/A'}
                    price={order.request.totalPrice.toLocaleString('vi-VN') || 'N/A'}
                    requestDate={order.consignDateStatus.requestDate}
                    pendingDate={order.consignDateStatus.pendingDate}
                    responseDate={order.consignDateStatus.responseDate} 
                    completeDate={order.consignDateStatus.completedDate}
                    paymentDate={order.consignDateStatus.paymentDate}
                />

                {/* Bảng thông tin cá Koi được bán */}
                <h3 className="mt-4">Thông tin cá Koi được bán</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Hình ảnh</th>
                                <th className={styles.textLeft}>Giấy chứng nhận</th>
                                <th className={styles.textLeft}>Tên cá</th>
                                <th className={styles.textLeft}>Giới tính</th>
                                <th className={styles.textRight}>Tuổi</th>
                                <th className={styles.textLeft}>Kích cỡ</th>
                                <th className={styles.textLeft}>Tình trạng sức khỏe</th>
                                <th className={styles.textLeft}>Chế độ ăn</th>
                                <th className={styles.textLeft}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.request?.ConsignList || []).map((koi) => (
                                <tr key={koi.fishID}>
                                    <td className={styles.textLeft}>
                                        {<img
                                            src={koi.photo}
                                            alt={koi.name || 'Hình ảnh'}
                                            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                        />}
                                    </td>
                                    <td className={styles.textLeft}>
                                        {<img
                                            src={koi.certificate}
                                            alt={koi.name || 'Giấy chứng nhận'}
                                            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                        />}
                                    </td>
                                    <td className={styles.textLeft}>{koi.name || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.sex || 'N/A'}</td>
                                    <td className={styles.textRight}>{koi.age || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.size || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.healthStatus || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.ration || 'N/A'}</td>
                                    <td className={styles.textLeft} >{translateStatus(koi.status).text}</td>
                                </tr>
                            ))}

                            {(!order.request?.ConsignList || order.request.ConsignList.length === 0) && (
                                <tr>
                                    <td colSpan="6">Không có cá Koi được bán</td>
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
