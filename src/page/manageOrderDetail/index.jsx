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
    const [reason, setReason] = useState('');
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
            console.log(response.data); // Kiểm tra dữ liệu nhận được
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
            await api.post(`/staff/updateStatus`, { orderId, status: 'Rejected', reason });
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
            await api.post(`/staff/updateStatus`, { orderId, status: 'Accepted' });
            alert('Đơn hàng đã được chấp nhận thành công!');
            setIsOrderProcessed(true);
            fetchOrderDetail();
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Đã xảy ra lỗi khi chấp nhận đơn hàng.');
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
                    {order.users ? ( // Kiểm tra sự tồn tại của thông tin người dùng
                        <>
                            <p>Tên: {order.users.name}</p>
                            <p>Số điện thoại: {order.users.phone}</p>
                            <p>Địa chỉ: {order.users.address}</p>
                        </>
                    ) : (
                        <p>Không có thông tin khách hàng</p>
                    )}
                </div>
                <h2>Sản phẩm:</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderDetailsDTO.map((item) => (
                            <tr key={item.id}>
                                <td>{item.fishName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price} VND</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="2">Tổng giá trị</td>
                            <td>{totalPrice} VND</td>
                        </tr>
                    </tbody>
                </table>
                <OrderStatus
                    orderId={orderId}
                    date={new Date(order.date).toLocaleDateString()}
                    status={status}
                />
                {!isOrderProcessed && (
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
