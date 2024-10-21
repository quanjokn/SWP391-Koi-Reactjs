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
            const ordersData = response.data.order

                .filter(order => order.status !== "Completed" && order.status !== "Rejected")
                .map(order => ({
                    id: order.id,
                    totalPrice: order.total,
                    orderDate: new Date(order.date), // Lưu lại dưới dạng đối tượng Date để dễ sắp xếp
                    status: order.status
                }))
                .sort((a, b) => b.orderDate - a.orderDate); // Sắp xếp theo ngày, mới nhất trước

            const caring = response.data.caringOrders
                .filter(order => order.status !== "Done" && order.status !== "Rejected")
                .map(order => ({
                    id: order.id,
                    startDate: new Date(order.startDate),
                    endDate: new Date(order.endDate),
                    totalPrice: order.totalPrice,
                    status: order.status
                }))
                .sort((a, b) => b.startDate - a.startDate); // Sắp xếp theo ngày bắt đầu

            const consign = response.data.consignOrders
                .filter(order => order.status !== "Shared" && order.status !== "Rejected")
                .map(order => ({
                    id: order.id,
                    totalPrice: order.totalPrice,
                    date: new Date(order.date),
                    status: order.status
                }))
                .sort((a, b) => b.date - a.date); // Sắp xếp theo ngày

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

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return 'Đợi xác nhận';
            case 'Preparing':
                return 'Đang chuẩn bị';
            case 'Shipping':
                return 'Đang vận chuyển';
            case "Pending":
                return "Đang chờ xử lý";
            case 'Receiving':
                return 'Đang xác nhận';
            case 'Responded':
                return 'Đã phản hồi';
            case "Completed":
                return "Đã hoàn thành";
            case "Done":
                return "Đã hoàn thành";
            case "Paid":
                return "Đã thanh toán";
            default:
                return status;
        }
    };

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
                                <th className={styles.textLeft}>ID</th>
                                <th className={styles.textLeft}>Ngày đặt hàng</th>
                                <th className={styles.textLeft}>Thành tiền VND</th>
                                <th className={styles.textLeft}>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td className={styles.textLeft}>{order.id}</td>
                                    <td className={styles.textLeft}>{order.orderDate.toLocaleDateString()}</td>
                                    <td className={styles.textLeft}>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td className={styles.textLeft}>{translateStatus(order.status)}</td>
                                    <td className={styles.textCenter}>
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
                                <th className={styles.textLeft}>ID</th>
                                <th className={styles.textLeft}>Ngày bắt đầu</th>
                                <th className={styles.textLeft}>Ngày kết thúc</th>
                                <th className={styles.textLeft}>Thành tiền VND</th>
                                <th className={translateStatus(styles.textLeft)}>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCareOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td className={styles.textLeft}>{order.id}</td>
                                    <td className={styles.textLeft}>{order.startDate.toLocaleDateString()}</td>
                                    <td className={styles.textLeft}>{order.endDate.toLocaleDateString()}</td>
                                    <td className={styles.textLeft}>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td className={styles.textLeft}>{translateStatus(order.status)}</td>
                                    <td className={styles.textCenter}>
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
                                <th className={styles.textLeft}>ID</th>
                                <th className={styles.textLeft}>Ngày đặt hàng</th>
                                <th className={styles.textLeft}>Thành tiền VND</th>
                                <th className={styles.textLeft}>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConsignOrders.map(order => (
                                <tr key={order.id} className={styles.row}>
                                    <td className={styles.textLeft}>{order.id}</td>
                                    <td className={styles.textLeft}>{order.date.toLocaleDateString()}</td>
                                    <td className={styles.textLeft}>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td className={styles.textLeft}>{translateStatus(order.status)}</td>
                                    <td className={styles.textCenter}>
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
