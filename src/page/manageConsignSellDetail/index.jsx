import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import styles from './manageConsignSellDetail.module.css';
import ReasonModal from '../../component/reasonNote';
import ConsignSellStatus from '../../component/consignSellStatus';

const ManageConsignSellDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tempReason, setTempReason] = useState('');
    const [isOrderProcessed, setIsOrderProcessed] = useState(false);
    const [decision, setDecision] = useState({});

    const fetchOrderDetail = async () => {
        if (!orderId) {
            throw new Error('No orderId found');
        }
        try {
            const response = await api.post(`/consignManagement/detail/${orderId}`);
            console.log(response.data); // Kiểm tra dữ liệu nhận được
            if (response.data) {
                // Cập nhật order với thông tin nhận được từ API
                setOrder(response.data); // Cập nhật với đối tượng order
                setStatus(response.data.status); // Cập nhật trạng thái
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

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return 'Đợi xác nhận';
            case 'Accepted_Selling':
                return 'Đang bán';
            case "Sold":
                return "Đã bán";
            case "Paid":
                return "Đã thanh toán";
            case "Rejected":
                return "Đã bị từ chối";
            default:
                return status;
        }
    };

    const handleAcceptOrder = async () => {
        const staffId = user ? user.id : null;
        const approveReq = {
            orderID: orderId,
            decision,
            note: ""
        };
        console.log('Staff ID:', staffId);
        console.log('Order ID:', orderId);
        console.log('Decision:', decision);
        console.log('Approve Request:', approveReq);
        try {
            await api.post(`/consignManagement/approval/${staffId}`, approveReq);
            alert('Đơn hàng đã được phản hồi thành công!');
            setIsOrderProcessed(true);
            fetchOrderDetail();
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Đã xảy ra lỗi khi phản hồi !');
        }
    };


    const handleCompleteOrder = async () => {
        const staffId = user ? user.id : null;
        console.log('Staff ID:', staffId);
        console.log('Order ID:', orderId);
        try {
            const response = await api.post(`/staff/generateOrderId`, {});
            const type = 'consignOrder';
            return navigate(`/vnpay/onlinePayment/${type}/${staffId}/${order.orderID}/${response.data}/${order.request.totalPrice}`);
        } catch (error) {
            alert("Có lỗi xảy ra khi lấy đường dẫn thanh toán. Vui lòng thử lại.");
            return null; // Trả về null nếu có lỗi
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                {order ? (
                    <>
                        <h1>Chi tiết đơn kí gửi bán #{order.orderID}</h1>
                        <h2>Ngày đặt hàng: {order.request.date}</h2>
                        <div className={styles.customerInfo}>
                            <h2>Thông tin khách hàng:</h2>
                            <p>Tên: {order.customer.name}</p>
                            <p>Số điện thoại: {order.customer.phone}</p>
                            <p>Địa chỉ: {order.customer.address}</p>
                        </div>
                        <h2>Sản phẩm:</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.textLeft}>Ảnh cá</th>
                                    <th className={styles.textLeft}>Ảnh giấy chứng nhận</th>
                                    <th className={styles.textLeft}>Tên cá</th>
                                    <th className={styles.textLeft}>Số lượng</th>
                                    <th className={styles.textLeft}>Giá bán VND</th>
                                    <th className={styles.textLeft}>Trạng thái</th>
                                    {status === 'Receiving' && (
                                        <th className={styles["actionColumn"]}></th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {order.request.ConsignList.map(product => (
                                    <tr key={product.fishID}>
                                        <td className={styles.textLeft}>
                                            {<img
                                                src={product.photo}
                                                alt={product.name || 'Hình ảnh sản phẩm'}
                                                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                            />}</td>
                                        <td className={styles.textLeft}>
                                            {<img
                                                src={product.certificate}
                                                alt={product.name || 'Giấy chứng nhận'}
                                                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                            />}</td>
                                        <td className={styles.textLeft}>{product.name}</td>
                                        <td className={styles.textRight}>{product.quantity}</td>
                                        <td className={styles.textRight}>{product.price.toLocaleString('vi-VN')}</td>
                                        <td>{translateStatus(product.status)}</td>
                                        {status === 'Receiving' && (
                                            <td className={styles["actionColumn"]}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="false"
                                                        checked={decision[product.fishID] === false}
                                                        onChange={() => handleDecision(product.fishID, false)}
                                                    />
                                                    <span>Từ chối</span>
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="true"
                                                        checked={decision[product.fishID] === true}
                                                        onChange={() => handleDecision(product.fishID, true)}
                                                    />
                                                    <span>Chấp nhận</span>
                                                </label>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="2" className={styles.textLeft}><strong>Thành tiền:</strong></td>
                                    <td className={styles.textRight}><strong>{order.request.totalPrice.toLocaleString('vi-VN')}</strong></td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className={styles.textLeft}><strong>Hoa hồng:</strong></td>
                                    <td className={styles.textRight}><strong>{order.request.commission.toLocaleString('vi-VN')}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        <ConsignSellStatus
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

                {/* Bảng cập nhật trạng thái || product.status === 'Rejected'*/}
                {status === 'Responded' &&
                    (order.request.ConsignList.every(product => (product.status === 'Sold' || product.status === 'Rejected'
                    ))) && (
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
                {status === 'Done' && (
                    <div className={styles.updateStatus}>
                        <h2>Cập nhật trạng thái</h2>
                        <button
                            className={styles.buttonCompleted}
                            onClick={handleCompleteOrder}
                        >
                            Thanh toán
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

export default ManageConsignSellDetail;
