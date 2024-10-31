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
    const [updateHistory, setUpdateHistory] = useState([]);

    const fetchUpdateHistory = async (koiId) => {
        try {
            const response = await api.get(`/caringManagement/getAllHealthUpdation/${koiId}`);
            setUpdateHistory(prevHistory => {
                // Filter out entries that already exist in the history
                const newEntries = response.data
                    .map(entry => ({ ...entry, caredKoiID: koiId }))
                    .filter(newEntry => !prevHistory.some(existingEntry => existingEntry.id === newEntry.id));

                return [...prevHistory, ...newEntries];
            });
            console.log(updateHistory)
        } catch (error) {
            console.error('Error fetching update history:', error);
        }
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await api.post(`/caringOrder/detail/${orderId}`);
            const caringOrder = response.data.caringOrder;
            const caredOrder = response.data;
            if (caredOrder) {
                setOrder2(caredOrder);
                setUpdateHistory([]); // Clear previous history to avoid duplicates
                if (caredOrder.caredKois.length > 0) {
                    caredOrder.caredKois.forEach((koi) => {
                        fetchUpdateHistory(koi.id); // Fetch history for each caredKoi ID
                    });
                }
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
    useEffect(() => {
        fetchOrderDetails();
        // fetchUpdateHistory();   
    }, [orderId, navigate]);

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
                return { text: 'Đã bị từ chối', className: styles.rejected };
            case "Pending_payment":
                return { text: 'Chờ thanh toán' };
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
                {updateHistory.length > 0 && (
                    <div className={styles.updateHistoryContainer}>
                        <h2>Lịch sử cập nhật</h2>
                        <table className={styles.historyTable}>
                            <thead>
                                <tr>
                                    <th>Ngày cập nhật</th>
                                    <th>Tên cá</th>
                                    <th>Hình ảnh cập nhật</th>
                                    <th>Tình trạng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {updateHistory.map((update, index) => (
                                    <tr key={index}>
                                        <td>{update.date}</td>
                                        <td>{update.caredKoi.name}</td>
                                        <td>
                                            <img
                                                src={update.photo}
                                                alt="Hình ảnh cập nhật"
                                                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{update.evaluation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderDetailConSignCare;
