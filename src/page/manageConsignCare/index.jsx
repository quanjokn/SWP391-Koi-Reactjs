import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/header/index';
import { UserContext } from '../../service/UserContext';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import styles from './manageConsignCare.module.css';

const ManageConsignCare = () => {
    const { user } = useContext(UserContext); // Lấy cả setUser từ UserContext
    const [orders, setOrders] = useState([]);   
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/caringManagement/allPendingOrder');
            const ordersData = response.data.map(order => ({
                id: order.id,
                totalPrice: order.totalPrice, // Tổng tiền
                orderDate: order.startDate
            }));
            setOrders(ordersData);           
        } catch (error) {
            console.error('Error fetching orders:', error);
            
        }
    };

    useEffect(() => {
        // Gọi hàm fetchOrders khi component được mount
        fetchOrders();
    }, [user]);

    const handleOrderClick = async (orderId) => {
        try {
            const staffId = user.id;
            await api.post(`/caringManagement/receiving/${staffId}/${orderId}`);
            // gọi lại fetchOrders để lấy lại danh sách đơn hàng mới
            fetchOrders();
        } catch (error) {
            console.error('Error receiving order:', error);
        };
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

export default ManageConsignCare;
