import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/header/index';
import { UserContext } from '../../service/UserContext';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import axios from 'axios';
import styles from './manageOrder.module.css';

const ManageOrder = () => {
    const { user, setUser } = useContext(UserContext); // Lấy cả setUser từ UserContext
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [timeoutMessage, setTimeoutMessage] = useState(''); // Thêm state cho thông báo

    useEffect(() => {
        // Kiểm tra token (hoặc user) có hết hạn không
        const tokenExpiryTime = localStorage.getItem('tokenExpiryTime'); // Giả định bạn lưu thời gian hết hạn
        if (tokenExpiryTime && Date.now() > tokenExpiryTime) {
            setUser(null); // Đặt lại user về null
            setTimeoutMessage('Session expired. Redirecting to login...'); // Cập nhật thông báo
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng đến trang đăng nhập
            }, 3000); // Thời gian đếm ngược 3 giây trước khi chuyển hướng
        }
    }, [navigate, setUser]);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(loadingTimeout);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        if (!user || user.role !== 'Staff') {
            navigate('/error');
        } else {
            axios.get('https://dummyjson.com/carts')
                .then(response => {
                    const ordersData = response.data.carts.map(cart => ({
                        id: cart.id,
                        customerName: `Customer ${cart.userId}`,
                        address: `Address ${cart.userId}`,
                        status: cart.isDeleted ? 'Cancelled' : 'Pending',
                        totalPrice: cart.total, // Thêm Total Price
                        totalQuantity: cart.totalQuantity
                    }));
                    setOrders(ordersData);
                })
                .catch(error => console.error('Error fetching orders:', error));
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleOrderClick = (orderId) => {
        navigate(`/manage-orders/${orderId}`);
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Danh sách đơn hàng</h1>
                {timeoutMessage && <div className={styles.timeoutMessage}>{timeoutMessage}</div>} {/* Hiển thị thông báo timeout */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Total Price</th>
                            <th>Total Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className={styles.row}>
                                <td>{order.id}</td>
                                <td>{order.customerName}</td>
                                <td>{order.address}</td>
                                <td>{order.status}</td>
                                <td>{order.totalPrice} VND</td>
                                <td className={styles.shortQuantity}>{order.totalQuantity}</td>
                                <td>
                                    <button 
                                        className={styles.button1}
                                        onClick={() => handleOrderClick(order.id)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

export default ManageOrder;
