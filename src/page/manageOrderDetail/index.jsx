import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import styles from './manageOrderDetail.module.css';
import Loading from '../../component/loading';

const ManageOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra token (hoặc user) có hết hạn không
        const tokenExpiryTime = localStorage.getItem('tokenExpiryTime'); // Giả định bạn lưu thời gian hết hạn
        if (tokenExpiryTime && Date.now() > tokenExpiryTime) {
            setUser(null); // Đặt lại user về null
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng đến trang đăng nhập
            }, 3000); // Thời gian đếm ngược 3 giây trước khi chuyển hướng
        }
    }, [navigate, setUser]);

    useEffect(() => {
        // Fetch chi tiết đơn hàng dựa trên orderId từ dummyjson
        const fetchOrderDetail = async () => {
            try {
                const response = await axios.get(`https://dummyjson.com/carts/${orderId}`);
                setOrder(response.data);
                setStatus(response.data.isDeleted ? 'Cancelled' : 'Pending');
                setIsLoading(false); // Đặt loading thành false khi có dữ liệu
            } catch (error) {
                console.error('Error fetching order detail:', error);
                navigate('/error'); // Chuyển hướng đến trang lỗi nếu không lấy được dữ liệu
            }
        };

        // Kiểm tra phân quyền người dùng
        if (!user || user.role !== 'Staff') {
            navigate('/error');
            return;
        } else {
            fetchOrderDetail();
        }
    }, [user, orderId, navigate]);

    const handleStatusChange = () => {
        // Cập nhật trạng thái đơn hàng
        axios.put(`https://dummyjson.com/carts/${orderId}`, { isDeleted: status === 'Cancelled' })
            .then(() => {
                setStatus(status === 'Pending' ? 'Cancelled' : 'Pending');
            })
            .catch(error => console.error('Error updating order status:', error));
    };

    // Chỉ hiển thị loading nếu đang trong trạng thái loading
    if (isLoading) {
        return <Loading />;
    }

    // Tính toán tổng giá
    const totalPrice = order.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Chi tiết đơn hàng của ID {order.id}</h1>
                <h2>Ngày đặt hàng: {order.orderDate}</h2>
                <div className={styles.customerInfo}>
                    <h2>Thông tin khách hàng:</h2>
                    <p>Tên: {order.customerName}</p>
                    <p>Số điện thoại: {order.customerPhone}</p>
                    <p>Địa chỉ: {order.customerAddress}</p>
                </div>
                <h2>Sản phẩm:</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên cá</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map(product => (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price} VND</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'right' }}><strong>Thành tiền:</strong></td>
                            <td><strong>{totalPrice} VND</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div className={styles.statusContainer}>
                    <label htmlFor="status">Trạng thái:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className={styles.button2} onClick={handleStatusChange}>
                        Cập nhật trạng thái
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ManageOrderDetail;
