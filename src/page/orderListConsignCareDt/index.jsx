import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import ConsignCareStatus from '../../component/consignCareStatus';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import styles from './orderListConsignCareDt.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';

const OrderDetailConSignCare = () => {
    const [order, setOrder] = useState(null);
    const [order2, setOrder2] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({});
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.post(`/caringOrder/detail/${orderId}`);
                const caringOrder = response.data.caringOrder;
                const caredOrder = response.data;
                if (caredOrder) {
                    setOrder2(caredOrder);
                }
                if (caringOrder) {
                    console.log(caringOrder);
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

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return { text: 'Đợi xác nhận' };
            case 'Accepted_caring':
                return { text: 'Đang chăm sóc' };        
            case 'Done':
                return { text: 'Đã hoàn thành', className: styles.done };
            case 'Rejected':
                return { text: 'Đã bị từ chối', className: styles.rejected};
            default:
                return { text: status, className: '' };
        }
    };


    const handleCompleteOrder = async () => {
        const userId = user ? user.id : null;
        try {
            const response = await api.post(`/staff/generateOrderId`, {});
            const type = 'caringOrder';
            navigate(`/vnpay/onlinePayment/${type}/${userId}/${orderId}/${response.data}/${order.totalPrice}`);

        } catch (error) {
            console.error('Error updating order status to Completed:', error);

        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5" style={containerStyle}>
                <ConsignCareStatus
                    orderId={order.id || 'N/A'}
                    startDate={new Date(order.startDate).toLocaleDateString() || 'N/A'}
                    endDate={new Date(order.endDate).toLocaleDateString() || 'N/A'}
                    status={order.status || 'N/A'}
                    price={order.totalPrice || 'N/A'}
                />

                {(order.status === 'Responded') && (
                    <div className={`${styles.ten}`} >
                        <button
                            className={order.status === 'Done' ? styles.buttonDisabled : `btn btn-success ${styles.submitButton}`}
                            onClick={order.status !== 'Done' ? handleCompleteOrder : undefined}
                            disabled={order.status === 'Done'}
                        >
                            Thanh toán
                        </button>
                    </div>
                )}

                {/* Thông tin cá ký gửi */}
                <h3 className="mt-4">Thông tin cá ký gửi</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Hình ảnh</th>
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
                            {(order2?.caredKois || []).map((koi) => (
                                <tr key={koi.id}>
                                    <td className={styles.textLeft}>
                                        {<img
                                            src={koi.photo}
                                            alt={koi.name || 'Hình ảnh'}
                                            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                        />}
                                    </td>
                                    <td className={styles.textLeft}>{koi.name || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.sex || 'N/A'}</td>
                                    <td className={styles.textRight}>{koi.age || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.size || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.healthStatus || 'N/A'}</td>
                                    <td className={styles.textLeft}>{koi.ration || 'N/A'}</td>
                                    <td className={styles.textLeft}>{translateStatus(koi.status).text || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tình trạng sức khỏe */}
                <h3 className="mt-4">Cập nhật tình trạng sức khỏe</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Hình ảnh</th>
                                <th className={styles.textLeft}>Tình trạng sức khỏe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order2?.caredKois || []).map((koi) => (
                                <tr key={koi.id}>
                                    <td className={styles.textLeft}>
                                        {<img
                                            src={koi.photo}
                                            alt={koi.name || 'Hình ảnh'}
                                            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                        />}
                                    </td>       
                                    <td className={styles.textLeft}>{koi.healthStatus || 'N/A'}</td>
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

export default OrderDetailConSignCare;
