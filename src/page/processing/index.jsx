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

    const [searchOrderDate, setSearchOrderDate] = useState('');
    const [searchCareDate, setSearchCareDate] = useState('');
    const [searchConsignDate, setSearchConsignDate] = useState('');
    const [searchOrderStatus, setSearchOrderStatus] = useState('');
    const [searchCareStatus, setSearchCareStatus] = useState('');
    const [searchConsignStatus, setSearchConsignStatus] = useState('');

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
                .filter(order => order.status !== "Shared" && order.status !== "Rejected" && order.status !== "Expired")
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
                case "Expired":
                    return "Đã hết hạn";
            default:
                return status;
        }
    };

    // Hàm lọc đơn hàng theo ngày và trạng thái
    const filterOrders = (orders, date, status) => {
        return orders.filter(order => {
            const matchesDate = date ? order.orderDate.toLocaleDateString() === new Date(date).toLocaleDateString() : true;
            const matchesStatus = status ? order.status === status : true;
            return matchesDate && matchesStatus;
        });
    };

    // Hàm lọc đơn chăm sóc theo ngày và trạng thái
    const filterCaringOrders = (caringOrders, date, status) => {
        return caringOrders.filter(order => {
            const matchesDate = date ? order.startDate.toLocaleDateString() === new Date(date).toLocaleDateString() : true;
            const matchesStatus = status ? order.status === status : true;
            return matchesDate && matchesStatus;
        });
    };

    // Hàm lọc đơn ký gửi bán theo ngày và trạng thái
    const filterConsignOrders = (consignOrders, date, status) => {
        return consignOrders.filter(order => {
            const matchesDate = date ? order.date.toLocaleDateString() === new Date(date).toLocaleDateString() : true;
            const matchesStatus = status ? order.status === status : true;
            return matchesDate && matchesStatus;
        });
    };

    const filteredOrders = filterOrders(orders, searchOrderDate, searchOrderStatus);
    const filteredCaringOrders = filterCaringOrders(caringOrders, searchCareDate, searchCareStatus);
    const filteredConsignOrders = filterConsignOrders(consignOrders, searchConsignDate, searchConsignStatus);

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Danh sách đơn hàng</h1>

                {/* Kiểm tra xem có đơn hàng không */}
                <h2>Danh sách đơn mua</h2>
                <div className="order-search-container">
                    <input
                        type="date"
                        value={searchOrderDate}
                        onChange={(e) => setSearchOrderDate(e.target.value)}
                        className="form-control me-2 search-input"
                        placeholder="Tìm kiếm theo ngày"
                    />
                    <select
                        value={searchOrderStatus}
                        onChange={(e) => setSearchOrderStatus(e.target.value)}
                        className="form-select me-2 search-select"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Pending_confirmation">Đợi xác nhận</option>
                        <option value="Preparing">Đang chuẩn bị</option>
                        <option value="Shipping">Đang vận chuyển</option>
                    </select>
                </div>
                {filteredOrders.length === 0 ? (
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
                                <th className={styles.textCenter}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder).map((order) => (
                                <tr key={order.id} onClick={() => handleOrderClick(order.id)}>
                                    <td className={styles.textLeft}>{order.id}</td>
                                    <td className={styles.textLeft}>{order.orderDate.toLocaleDateString()}</td>
                                    <td className={styles.textLeft}>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td className={`${styles.textCenter}`}>{translateStatus(order.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* Hiển thị nút phân trang nếu có đơn hàng */}
                {filteredOrders.length > 0 && (
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
                <div className="order-search-container">
                    <input
                        type="date"
                        value={searchCareDate}
                        onChange={(e) => setSearchCareDate(e.target.value)}
                        className="form-control me-2 search-input"
                        placeholder="Tìm kiếm theo ngày"
                    />
                    <select
                        value={searchCareStatus}
                        onChange={(e) => setSearchCareStatus(e.target.value)}
                        className="form-select me-2 search-select"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Pending_confirmation">Đợi xác nhận</option>
                        <option value="Receiving">Đang xác nhận</option>
                        <option value="Responded">Đã phản hồi</option>
                        <option value="Paid">Đã thanh toán</option>
                    </select>
                </div>
                {filteredCaringOrders.length === 0 ? (
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
                                <th className={styles.textCenter}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCaringOrders.slice(indexOfFirstCare, indexOfLastCare).map(order => (
                                <tr key={order.id} className={styles.row} onClick={() => handleCaringClick(order.id)}>
                                    <td className={`${styles.textLeft}`}>{order.id}</td>
                                    <td className={`${styles.textLeft}`}>{new Date(order.startDate).toLocaleDateString()}</td>
                                    <td className={`${styles.textLeft}`}>{new Date(order.endDate).toLocaleDateString()}</td>
                                    <td className={`${styles.textLeft}`}>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td className={styles.textCenter}>{translateStatus(order.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* Hiển thị nút phân trang nếu có đơn hàng */}
                {filteredCaringOrders.length > 0 && (
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
                <div className="order-search-container">
                    <input
                        type="date"
                        value={searchConsignDate}
                        onChange={(e) => setSearchConsignDate(e.target.value)}
                        className="form-control me-2 search-input"
                        placeholder="Tìm kiếm theo ngày"
                    />
                    <select
                        value={searchConsignStatus}
                        onChange={(e) => setSearchConsignStatus(e.target.value)}
                        className="form-select me-2 search-select"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Pending_confirmation">Đợi xác nhận</option>
                        <option value="Receiving">Đang xác nhận</option>
                        <option value="Responded">Đã phản hồi</option>
                        <option value="Done">Đã hoàn thành</option>
                    </select>
                </div>
                {filteredConsignOrders.length === 0 ? (
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
                                <th className={styles.textCenter}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredConsignOrders.slice(indexOfFirstConsign, indexOfLastConsign).map((order) => (
                                <tr key={order.id} onClick={() => handleConsignClick(order.id)}>
                                    <td className={`${styles.textLeft}`}>{order.id}</td>
                                    <td className={styles.textLeft}>{order.date.toLocaleDateString()}</td>
                                    <td className={styles.textLeft}>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td className={styles.textCenter}>{translateStatus(order.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}


                {/* Hiển thị nút phân trang nếu có đơn hàng */}
                {filteredConsignOrders.length > 0 && (
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
