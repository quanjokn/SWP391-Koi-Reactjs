import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import styles from './manageConsignCareDetail.module.css';
import ConsignCareStatus from '../../component/consignCareStatus';
import ReasonModal from '../../component/reasonNote';

const ManageConsignCareDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tempReason, setTempReason] = useState('');
    const [isOrderProcessed, setIsOrderProcessed] = useState(false);
    const [decision, setDecision] = useState({});

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
        if (!orderId) {
            throw new Error('No orderId found');
        }
        try {
            const response = await api.post(`/caringManagement/detail/${orderId}`);
            console.log(response.data.caringOrder); // Kiểm tra dữ liệu nhận được
            if (response.data) {
                // Cập nhật order với thông tin nhận được từ API
                setOrder(response.data); // Cập nhật với đối tượng order
                setStatus(response.data.caringOrder.status); // Cập nhật trạng thái
            } else {
                throw new Error('No order data found');
            }
        } catch (error) {
            console.error('Error fetching order detail:', error);
            navigate('/error');
        }
    };

    useEffect(() => {
        if ((!user || user.role !== 'Staff')) {
            navigate('/error');
            return;
        } else {
            fetchOrderDetail();
        }
    }, [user, orderId, navigate]);

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return 'Đợi xác nhận';
            case 'Accepted_caring':
                return 'Đang chăm sóc';
            case "Done":
                return "Đã hoàn thành";
            case "Paid":
                return "Đã thanh toán";
            case "Rejected":
                return "Đã bị từ chối";
            default:
                return status;
        }
    };

    const handleDecision = (koiId, value) => {
        setDecision((prevState) => {
            const newState = {
                ...prevState,
                [koiId]: value,  // Update decision for the specific fish ID
            };
            console.log(newState);  // In ra trạng thái mới
            return newState;
        });
    }

    const handleAcceptOrder = async () => {
        const staffId = user ? user.id : null;
        const approveReq = {
            staffID: staffId,
            orderID: orderId,
            decision,
            note: ""
        };
        console.log('Staff ID:', staffId);
        console.log('Order ID:', orderId);
        console.log('Decision:', decision);
        console.log('Approve Request:', approveReq);
        try {

            await api.post(`/caringManagement/approval`, approveReq, {
                headers: {
                    'Content-Type': 'application/json',
                }
            },);
            alert('Đã phản hồi thành công!');
            setIsOrderProcessed(true);
            fetchOrderDetail();
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Đã xảy ra lỗi khi phản hồi.');
        }
    };

    const handleCompleteOrder = async () => {
        const staffId = user ? user.id : null;
        try {
            await api.post(`/caringManagement/complete/${staffId}/${orderId}`);
            alert('Đơn hàng đã hoàn thành!');
            fetchOrderDetail();
        } catch (error) {
            console.error('Error updating order status to Completed:', error);
            alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.');
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                {order ? (
                    <>
                        <h1>Chi tiết đơn chăm sóc #{order.caringOrder.id}</h1>
                        <h2>Ngày bắt đầu: {order.caringOrder.startDate}</h2>
                        <h2>Ngày kết thúc: {order.caringOrder.endDate}</h2>
                        <div className={styles.customerInfo}>
                            <h2>Thông tin khách hàng:</h2>
                            {order.caringOrder.customer ? (
                                <>
                                    <p className={styles.textLeft}>Tên: {order.caringOrder.customer.name}</p>
                                    <p className={styles.textLeft}>Số điện thoại: {order.caringOrder.customer.phone}</p>
                                    <p className={styles.textLeft}>Địa chỉ: {order.caringOrder.customer.address}</p>
                                </>
                            ) : (
                                <p>Không có thông tin khách hàng</p>
                            )}
                        </div>
                        <h2>Sản phẩm:</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.textLeft}>Ảnh</th>
                                    <th className={styles.textLeft}>Tên</th>
                                    <th className={styles.textLeft}>Giới tính</th>
                                    <th className={styles.textLeft}>Tình trạng</th>
                                    {status === 'Receiving' && (
                                        <th className={styles["actionColumn"]}></th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {order.caredKois && order.caredKois.length > 0 ? (
                                    order.caredKois.map((koi) =>
                                        koi !== null ? (
                                            <tr key={koi.id}>
                                                <td className={styles.textLeft}>
                                                    {<img
                                                        src={koi.photo}
                                                        alt={koi.name || 'Hình ảnh sản phẩm'}
                                                        style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                                    />}
                                                    </td>
                                                <td className={styles.textLeft}>{koi.name}</td>
                                                <td className={styles.textLeft}>{koi.sex}</td>
                                                <td className={styles.textLeft}>{translateStatus(koi.status)}</td>
                                                {status === 'Receiving' && (
                                                    <td className={styles["actionColumn"]}>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="false"
                                                                checked={decision[koi.id] === false}
                                                                onChange={() => handleDecision(koi.id, false)}
                                                            />
                                                            <span>Từ chối</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="true"
                                                                checked={decision[koi.id] === true}
                                                                onChange={() => handleDecision(koi.id, true)}
                                                            />
                                                            <span>Chấp nhận</span>
                                                        </label>
                                                    </td>
                                                )}
                                            </tr>
                                        ) : null
                                    )
                                ) : (
                                    <p>Không có sản phẩm</p>
                                )}
                            </tbody>
                        </table>
                        <ConsignCareStatus
                            orderId={orderId}
                            date={new Date(order.date).toLocaleDateString()}
                            status={status}
                        />
                    </>
                ) : (
                    <p>Loading order details...</p>
                )}

                {/* Kiểm duyệt */}
                {!isOrderProcessed && status === 'Receiving' && (
                    <div className={styles.buttonStatus}>
                        <h2>Kiểm duyệt</h2>
                        <button className={styles.buttonAccept} onClick={handleAcceptOrder}>
                            Phản hồi
                        </button>
                    </div>
                )}

                {/* Bảng cập nhật trạng thái */}
                {(status === 'Responded') && (
                    <div className={styles.updateStatus}>
                        <h2>Chờ thanh toán</h2>
                    </div>
                )}
                {(status === 'Paid') && (
                    <div className={styles.updateStatus}>
                        <h2>Cập nhật trạng thái</h2>
                        <button
                            className={status === 'Done' ? styles.buttonDisabled : styles.buttonCompleted}
                            onClick={status !== 'Done' ? handleCompleteOrder : undefined}
                            disabled={status === 'Done'}
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
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default ManageConsignCareDetail;
