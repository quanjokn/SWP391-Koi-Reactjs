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
import Loading from '../../component/loading';

const ManageConsignCareDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tempReason, setTempReason] = useState('');
    const [isOrderProcessed, setIsOrderProcessed] = useState(false);
    const [decision, setDecision] = useState({});
    const [showUpdateForm, setShowUpdateForm] = useState(false); // State để hiển thị form
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const [updateData, setUpdateData] = useState({
        caredKoiID: '',
        date: formatDate(new Date()),
        photo: '',
        evaluation: ''
    }); // State cho dữ liệu form
    const [updateHistory, setUpdateHistory] = useState([]);

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
                console.log(response.data)
                setStatus(response.data.caringOrder.status); // Cập nhật trạng thái
            } else {
                throw new Error('No order data found');
            }
        } catch (error) {
            console.error('Error fetching order detail:', error);
            navigate('/error');
        }
    };

    const fetchUpdateHistory = async () => {
        try {
            const response = await api.get(`/caringManagement/getAllHealthUpdation/${updateData.caredKoiID}`);
            setUpdateHistory(response.data); // Giả sử API trả về mảng lịch sử
        } catch (error) {
            console.error('Error fetching update history:', error);
        }
    };

    useEffect(() => {
        if ((!user || user.role !== 'Staff')) {
            navigate('/error');
            return;
        } else {
            fetchOrderDetail();
            fetchUpdateHistory();
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
            case "Pending_payment":
                return "Chờ thanh toán";
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
        const hasPendingDecision = order.caredKois.some(koi => decision[koi.id] === undefined);
        if (hasPendingDecision) {
            alert('Vui lòng chọn chấp nhận hoặc từ chối !');
            fetchOrderDetail();
        } else {
            const approveReq = {
                staffID: staffId,
                orderID: orderId,
                decision,
                note: ""
            };
            try {
                setIsLoading(true);
                await api.post(`/caringManagement/approval`, approveReq, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                },);
                setIsLoading(false);
                alert('Đã phản hồi thành công!');
                setIsOrderProcessed(true);
                fetchOrderDetail();
            } catch (error) {
                console.error('Error accepting order:', error);
                alert('Đã xảy ra lỗi khi phản hồi.');
                setIsLoading(false);
            }
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

    // cập nhật trạng thái
    const handleUpdateButtonClick = () => {
        setShowUpdateForm((prevState) => !prevState); // Hiển thị form khi nhấn nút
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setUpdateData((prevData) => ({
            ...prevData,
            [name]: name === "photo" ? files[0]?.name : (name === "caredKoiID" ? Number(value) : value), // Lưu tên file nếu là photo
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        console.log(updateData);
        try {
            setIsLoading(true);
            await api.post(`/caringManagement/updateHealthStatus`, updateData); // Giả sử endpoint này nhận thông tin cập nhật
            setIsLoading(false);
            alert('Đã cập nhật thành công!');
            setShowUpdateForm(false); // Ẩn form sau khi cập nhật
            fetchOrderDetail(); // Cập nhật lại chi tiết đơn hàng
            fetchUpdateHistory();
        } catch (error) {
            console.error('Error updating fish status:', error);
            alert('Đã xảy ra lỗi khi cập nhật.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />
    }

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
                            orderId={orderId || 'N/A'}
                            startDate={new Date(order.caringOrder.startDate).toLocaleDateString() || 'N/A'}
                            endDate={new Date(order.caringOrder.endDate).toLocaleDateString() || 'N/A'}
                            status={status || 'N/A'}
                            price={order.caringOrder.totalPrice || 'N/A'}
                            requestDate={order.caringOrder.careDateStatus.requestDate }
                            pendingDate={order.caringOrder.careDateStatus.pendingDate }
                            responseDate={order.caringOrder.careDateStatus.responseDate } 
                            completedDate={order.caringOrder.careDateStatus.completedDate }
                            paymentDate={order.caringOrder.careDateStatus.paymentDate }                        
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

            {(status === 'Paid') && (
                <div className={styles.container}>

                    {/* Nút mở form cập nhật */}
                    <button onClick={handleUpdateButtonClick} className={styles.updateButton}>
                        {showUpdateForm ? "Đóng form" : "Cập nhật tình trạng cá"}
                    </button>

                    {/* Form cập nhật tình trạng cá */}
                    {showUpdateForm && (
                        <div className={styles.updateFormContainer}>
                            <h2>Cập nhật tình trạng cá</h2>
                            <form onSubmit={handleUpdateSubmit} className={styles.updateForm}>
                                <label >
                                    Cá:
                                    <select
                                        name="caredKoiID"
                                        value={updateData.caredKoiID}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="" disabled></option>
                                        {order.caredKois.map((koi) => (
                                            <option key={koi.id} value={koi.id}>
                                                {koi.name}
                                            </option>
                                        ))}

                                    </select>
                                </label>
                                <label>
                                    Ngày cập nhật:
                                    <input
                                        type="text"
                                        name="date"
                                        value={updateData.date}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Hình ảnh cá:
                                    <input
                                        type="file"
                                        name="photo"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Tình trạng:
                                    <textarea
                                        name="evaluation"
                                        value={updateData.evaluation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <button type="submit" className={styles.updateButton}>
                                    Cập nhật
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Bảng lịch sử cập nhật */}
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
            )}
            <Footer />
        </>
    );
};

export default ManageConsignCareDetail;
