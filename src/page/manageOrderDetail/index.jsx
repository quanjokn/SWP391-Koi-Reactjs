import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import styles from './manageOrderDetail.module.css';
import Loading from '../../component/loading';
import OrderStatus from '../../component/orderStatus';
import ReasonModal from '../../component/reasonNote';

const ManageOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [tempReason, setTempReason] = useState('');
    const [isOrderProcessed, setIsOrderProcessed] = useState(false);

    useEffect(() => {
        const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
        if (tokenExpiryTime && Date.now() > tokenExpiryTime) {
            setUser(null);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    }, [navigate, setUser]);

    const fetchOrderDetail = async () => {
        try {
            const response = await api.post(`/staff/orderDetail/${orderId}`);
            if (response.data) {
                // Cập nhật order với thông tin nhận được từ API
                setOrder(response.data); // Cập nhật với đối tượng order
                setStatus(response.data.status); // Cập nhật trạng thái
            } else {
                throw new Error('No order data found');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching order detail:', error);
            navigate('/error');
        }
    };

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'Staff')) {
            navigate('/error');
            return;
        } else {
            fetchOrderDetail();
        }
    }, [user, orderId, navigate]);

    const handlePrepareOrder = async (reason) => {
        if (!reason) {
            alert('Vui lòng nhập lý do từ chối!');
            return;
        }

        try {
            await api.post(`/staff/updateStatus`, { orderId, status: 'Rejected', note: reason });
            alert('Đơn hàng đã bị từ chối');
            setIsOrderProcessed(true);
            fetchOrderDetail();
            setShowModal(false);
            setTempReason('');
        } catch (error) {
            console.error('Error preparing order:', error);
            alert('Đã xảy ra lỗi');
        }
    };

    const handleAcceptOrder = async () => {
        try {
            const response = await api.post(`/staff/updateStatus`, { orderId, status: 'Preparing' });
            if (response.status === 200) {
                setIsOrderProcessed(true); // Đánh dấu đơn hàng đã được xử lý
                fetchOrderDetail(); // Lấy lại dữ liệu mới từ API
            }
            alert('Đơn hàng đã được chấp nhận thành công!');
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Đã xảy ra lỗi khi chấp nhận đơn hàng.');
        }
    };

    const handleShippingOrder = async () => {
        try {
            await api.post(`/staff/updateStatus`, { orderId, status: 'Shipping' });
            alert('Đơn hàng đang được giao!');
            fetchOrderDetail();
        } catch (error) {
            console.error('Error updating order status to Shipping:', error);
            alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.');
        }
    };

    const handleCompleteOrder = async () => {
        try {
            await api.post(`/staff/updateStatus`, { orderId, status: 'Completed' });
            alert('Đơn hàng đã hoàn thành!');
            fetchOrderDetail();
        } catch (error) {
            console.error('Error updating order status to Completed:', error);
            alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.');
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    // Sử dụng order đã cập nhật từ API
    const totalPrice = order.totalOrderPrice; // Giá trị tổng từ API

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Đơn hàng #{order.orderId}</h1>
                <h2>Ngày đặt hàng: {new Date(order.date).toLocaleDateString()}</h2>
                <div className={styles.customerInfo}>
                    <h2>Thông tin khách hàng:</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Tên khách hàng</th>
                                <th className={styles.textLeft}>Số điện thoại</th>
                                <th className={styles.textLeft}>Địa chỉ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.textLeft}>{order.users.name}</td>
                                <td className={styles.textLeft}>{order.users.phone}</td>
                                <td className={styles.textLeft}>{order.users.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <h2>Sản phẩm:</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.textLeft}>Hình ảnh</th>
                            <th className={styles.textLeft}>Tên sản phẩm</th>
                            <th className={`${styles.textRight} ${styles.quantityColumn}`}>Số lượng</th>
                            <th className={styles.textRight}>Giá VND</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderDetailsDTO.map((item, index) => (
                            <tr key={`${item.id}-${index}`}>
                                <td className={`${styles.textCenter} ${styles.pictureColum}`}>
                                        <img
                                            src={item.photo}
                                            alt={item.fishName || 'Hình ảnh sản phẩm'}
                                            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                    </td>
                                <td className={styles.textLeft}>{item.fishName}</td>
                                <td className={`${styles.textRight} ${styles.quantityColumn}`}>{item.quantity}</td>
                                <td className={styles.textRight}>{item.totalPrice.toLocaleString('vi-VN')}</td>
                            </tr>
                        ))}

                        <tr>
                            <td className={styles.textLeft} colSpan="3">Tổng giá trị</td>
                            <td className={styles.textRight}>{totalPrice.toLocaleString('vi-VN')}</td>
                        </tr>
                    </tbody>
                </table>
                <OrderStatus
                    orderId={orderId}
                    date={new Date(order.date).toLocaleDateString()}
                    status={status}
                />

                {/* Kiểm duyệt */}
                {!isOrderProcessed && status === 'Pending_confirmation' && (
                    <div className={styles.buttonStatus}>
                        <h2>Kiểm duyệt</h2>
                        <button className={styles.buttonReject} onClick={() => setShowModal(true)}>
                            Từ chối đơn hàng
                        </button>
                        <button className={styles.buttonAccept} onClick={handleAcceptOrder}>
                            Chấp nhận đơn hàng
                        </button>
                    </div>
                )}

                {/* Bảng cập nhật trạng thái */}
                {(status === 'Preparing' || status === 'Shipping') && !isOrderProcessed && status !== 'Completed' && (
                    <div className={styles.updateStatus}>
                        <h2>Cập nhật trạng thái</h2>
                        <button
                            className={status === 'Shipping' ? styles.buttonDisabled : styles.buttonShipping}
                            onClick={status !== 'Shipping' ? handleShippingOrder : undefined}
                            disabled={status === 'Shipping'}
                        >
                            Vận chuyển
                        </button>
                        <button
                            className={status === 'Completed' ? styles.buttonDisabled : styles.buttonCompleted}
                            onClick={status !== 'Completed' ? handleCompleteOrder : undefined}
                            disabled={status === 'Completed'}
                        >
                            Hoàn thành
                        </button>
                    </div>
                )}

                {showModal && (
                    <ReasonModal
                        reason={tempReason}
                        setReason={setTempReason}
                        setShowModal={setShowModal}
                        handlePrepareOrder={handlePrepareOrder}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default ManageOrderDetail;
