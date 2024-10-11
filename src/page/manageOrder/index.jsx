import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/header/index';
import { UserContext } from '../../service/UserContext';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import styles from './manageOrder.module.css';
import Loading from '../../component/loading';

const ManageOrder = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

    useEffect(() => {
        // Kiểm tra token (hoặc user) có hết hạn không
        const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
        if (tokenExpiryTime && Date.now() > tokenExpiryTime) {
            setUser(null);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    }, [navigate, setUser]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/staff/allOrder');
            const ordersData = response.data.map(order => ({
                id: order.id,
                totalPrice: order.total, // Tổng tiền
                orderDate: new Date(order.date).toLocaleDateString() // Ngày đặt hàng
            }));
            setOrders(ordersData);
            setIsLoading(false); // Đặt isLoading thành false sau khi tải xong
        } catch (error) {
            console.error('Error fetching orders:', error);
            setIsLoading(false); // Cũng đặt là false nếu có lỗi
        }
    };

    useEffect(() => {
        // Gọi hàm fetchOrders khi component được mount
        fetchOrders();
    }, [user, navigate]);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'Staff')) {
            navigate('/error');
        }
    }, [user, isLoading, navigate]);

    const handleOrderClick = async (orderId) => {
        try {
            const staffId = user.id;
            await api.post(`/staff/receiving/${orderId}/${staffId}`);
            // gọi lại fetchOrders để lấy lại danh sách đơn hàng mới
            await fetchOrders();
        } catch (error) {
            console.error('Error receiving order:', error);
        }
    };


    // Tính toán các chỉ số để hiển thị đơn hàng trên trang hiện tại
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Thay đổi trang khi người dùng bấm số trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Tạo danh sách các trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    // Hiển thị Loading nếu đang tải
    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Danh sách đơn hàng</h1>

                {/* Kiểm tra xem có đơn hàng không */}
                {orders.length === 0 ? (
                    <div className={styles.noOrdersMessage}>
                        Hiện tại không có đơn hàng đang đợi tiếp nhận.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày đặt hàng</th>
                                <th>Thành tiền</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td>{order.id}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.totalPrice} VND</td>
                                    <td>
                                        <button
                                            className={styles.button1}
                                            onClick={() => handleOrderClick(order.id)}
                                        >
                                            Tiếp nhận
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Hiển thị nút phân trang nếu có đơn hàng */}
                {orders.length > 0 && (
                    <nav>
                        <ul className="pagination justify-content-center">
                            {pageNumbers.map(number => (
                                <li
                                    key={number}
                                    className={`page-item ${number === currentPage ? 'active' : ''}`}
                                >
                                    <button
                                        onClick={() => paginate(number)}
                                        className="page-link"
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ManageOrder;
