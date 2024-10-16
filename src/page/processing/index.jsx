import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/header/index';
import { UserContext } from '../../service/UserContext';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import styles from './processing.module.css';
import Loading from '../../component/loading';

const Processing = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [caringOrders, setCaringOrders] = useState([]);
    const [consignOrders, setConsignOrders] = useState([]);
    const [currentPageOrder, setCurrentPageOrder] = useState(1);
    const [currentPageCare, setCurrentPageCare] = useState(1);
    const [currentPageConsign, setCurrentPageConsign] = useState(1);
    const [ordersPerPage] = useState(5);

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
        if (!user || !user.id) return;
        try {
            const staffId = user.id;
            const response = await api.post(`/staff/getAllOrder/${staffId}`);
            console.log(response);
            const ordersData = response.data.order
                .filter(order => order.status !== "Completed" && order.status !== "Rejected") // Lọc các đơn hàng có trạng thái không phải "Completed" hoặc "Rejected"
                .map(order => ({
                    id: order.id,
                    totalPrice: order.total, // Tổng tiền
                    orderDate: new Date(order.date).toLocaleDateString(), // Ngày đặt hàng
                    status: order.status
                }));
            const caring = response.data.caringOrders.map(order => ({
                id: order.id,
                startDate: new Date(order.startDate).toLocaleDateString(),
                endDate: new Date(order.endDate).toLocaleDateString(),
                totalPrice: order.totalPrice, // Tổng tiền
                status: order.status
            }));
            const consign = response.data.consignOrders.map(order => ({
                id: order.id,
                totalPrice: order.totalPrice, // Tổng tiền
                date: new Date(order.date).toLocaleDateString(), // Ngày đặt hàng
                status: order.status
            }));
            setOrders(ordersData);
            setCaringOrders(caring);
            setConsignOrders(consign);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false); // Luôn đặt isLoading thành false sau khi tải xong
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'Staff')) {
            navigate('/error');
        }
    }, [user, isLoading, navigate]);

    // Hàm điều hướng đến trang chi tiết đơn hàng
    const handleOrderClick = (orderId) => {
        navigate(`/manage-orders/${orderId}`);
    };
    const handleCaringClick = (orderId) => {
        navigate(`/manage-consign-care/${orderId}`);
    };
    const handleConsignClick = (orderId) => {
        navigate(`/manage-consign-sell/${orderId}`);
    };

    // Tính toán các chỉ số để hiển thị đơn hàng trên trang hiện tại
    const indexOfLastOrder = currentPageOrder * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const indexOfLastCare = currentPageCare * ordersPerPage;
    const indexOfFirstCare = indexOfLastCare - ordersPerPage;
    const currentCareOrders = caringOrders.slice(indexOfFirstCare, indexOfLastCare);

    const indexOfLastConsign = currentPageConsign * ordersPerPage;
    const indexOfFirstConsign = indexOfLastConsign - ordersPerPage;
    const currentConsignOrders = consignOrders.slice(indexOfFirstConsign, indexOfLastConsign);

    // Thay đổi trang khi người dùng bấm số trang
    const paginateOrder = (pageNumber) => {
        setCurrentPageOrder(pageNumber);
    };
    const paginateCaring = (pageNumber) => {
        setCurrentPageCare(pageNumber);
    };
    const paginateConsign = (pageNumber) => {
        setCurrentPageConsign(pageNumber);
    };

    // Tạo danh sách các trang
    const pageNumbersOrder = [];
    for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
        pageNumbersOrder.push(i);
    }
    const pageNumbersCaring = [];
    for (let i = 1; i <= Math.ceil(caringOrders.length / ordersPerPage); i++) {
        pageNumbersCaring.push(i);
    }
    const pageNumbersConsign = [];
    for (let i = 1; i <= Math.ceil(consignOrders.length / ordersPerPage); i++) {
        pageNumbersConsign.push(i);
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
                <h2>Danh sách đơn mua</h2>
                {orders.length === 0 ? (
                    <div className={styles.noOrdersMessage}>
                        Hiện tại bạn không có đơn tiếp nhận.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày đặt hàng</th>
                                <th>Thành tiền</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td>{order.id}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.totalPrice} VND</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <button
                                            className={styles.button1}
                                            onClick={() => handleOrderClick(order.id)}
                                        >
                                            Chi tiết
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
                            {pageNumbersOrder.map(number => (
                                <li
                                    key={number}
                                    className={`page-item ${number === currentPageOrder ? 'active' : ''}`}
                                >
                                    <button
                                        onClick={() => paginateOrder(number)}
                                        className="page-link"
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                <h2>Danh sách đơn ký gửi chăm sóc</h2>
                {caringOrders.length === 0 ? (
                    <div className={styles.noOrdersMessage}>
                        Hiện tại bạn không có đơn tiếp nhận.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Thành tiền</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCareOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td>{order.id}</td>
                                    <td>{order.startDate}</td>
                                    <td>{order.endDate}</td>
                                    <td>{order.totalPrice} VND</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <button
                                            className={styles.button1}
                                            onClick={() => handleCaringClick(order.id)}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* Hiển thị nút phân trang nếu có đơn hàng */}
                {caringOrders.length > 0 && (
                    <nav>
                        <ul className="pagination justify-content-center">
                            {pageNumbersCaring.map(number => (
                                <li
                                    key={number}
                                    className={`page-item ${number === currentPageCare ? 'active' : ''}`}
                                >
                                    <button
                                        onClick={() => paginateCaring(number)}
                                        className="page-link"
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                <h2>Danh sách đơn ký gửi bán</h2>
                {consignOrders.length === 0 ? (
                    <div className={styles.noOrdersMessage}>
                        Hiện tại bạn không có đơn tiếp nhận.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày đặt hàng</th>
                                <th>Thành tiền</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConsignOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.totalPrice} VND</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <button
                                            className={styles.button1}
                                            onClick={() => handleConsignClick(order.id)}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}


                {/* Hiển thị nút phân trang nếu có đơn hàng */}
                {consignOrders.length > 0 && (
                    <nav>
                        <ul className="pagination justify-content-center">
                            {pageNumbersConsign.map(number => (
                                <li
                                    key={number}
                                    className={`page-item ${number === currentPageConsign ? 'active' : ''}`}
                                >
                                    <button
                                        onClick={() => paginateConsign(number)}
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

export default Processing;
