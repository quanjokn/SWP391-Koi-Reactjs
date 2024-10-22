import React, { useEffect, useState, useContext } from 'react';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import styles from './orderListConsignCare.module.css';
import NavigationList from '../../component/navigationList';
import Loading from '../../component/loading';
import { UserContext } from '../../service/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const OrderListConsignCare = () => {
    const [containerStyle, setContainerStyle] = useState({});
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setContainerStyle({
            backgroundColor: '#470101',
            color: 'white',
            margin: '0 auto',
        });
    }, []);

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user.id) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await api.post(`/caringOrder/getList/${user.id}`);
                if (response.data && Array.isArray(response.data)) {
                    const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setOrders(sortedOrders);
                    setFilteredOrders(sortedOrders); // Khởi tạo danh sách đơn hàng đã lọc với toàn bộ đơn hàng ban đầu
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleViewOrderDetail = (orderId) => {
        navigate(`/order-consign-care/${orderId}`);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleSearch = () => {
        const filtered = orders.filter(order => {
            const matchesDate = searchDate ? order.date.startsWith(searchDate) : true;
            const matchesStatus = searchStatus ? order.status === searchStatus : true;
            return matchesDate && matchesStatus;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return { text: 'Đợi xác nhận' };
            case 'Receiving':
                return { text: 'Đang xác nhận' };
            case 'Responded':
                return { text: 'Đã phản hồi' };
            case 'Done':
                return { text: 'Đã hoàn thành', className: styles.done };
            case 'Rejected':
                return { text: 'Đã bị từ chối', className: styles.rejected };
            default:
                return { text: status, className: '' };
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={`${styles.container} px-4 px-lg-5`} style={containerStyle}>
                <div className="row">
                    <NavigationList />
                    <div className="col-md-9">
                        <div className="p-3 py-5">

                            <div className="d-flex mb-3">
                                <input
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    className="form-control me-2"
                                    placeholder="Tìm kiếm theo ngày"
                                />
                                <select
                                    value={searchStatus}
                                    onChange={(e) => setSearchStatus(e.target.value)}
                                    className="form-select me-2"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Pending_confirmation">Đợi xác nhận</option>
                                    <option value="Receiving">Đang xác nhận</option>
                                    <option value="Responded">Đã phản hồi</option>
                                    <option value="Done">Đã hoàn thành</option>
                                    <option value="Rejected">Đã bị từ chối</option>
                                </select>
                                <button className="btn btn-primary" onClick={handleSearch}>Tìm kiếm</button>
                            </div>

                            {isLoading ? (
                                <Loading />
                            ) : currentOrders.length > 0 ? (
                                <>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th className={styles.textLeft}>Ngày</th>
                                                <th className={styles.textLeft}>Mã đơn ký gửi</th>
                                                <th className={styles.textRight}>Giá VND</th>
                                                <th className={styles.textLeft}>Trạng thái ký gửi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders.map((order) => {
                                                const totalPrice = order.totalPrice || 0;

                                                return (
                                                    <tr
                                                        key={order.id}
                                                        onClick={() => handleViewOrderDetail(order.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td className={styles.textLeft}>{order.date}</td>
                                                        <td className={styles.textLeft}>{order.id}</td>
                                                        <td className={styles.textRight}>{totalPrice.toLocaleString('vi-VN')}</td>
                                                        <td className={`${styles.textLeft} ${translateStatus(order.status).className}`}>{translateStatus(order.status).text}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

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
                                </>
                            ) : (
                                <div className={`${styles.noOrdersMessage} p-3 py-5`}>
                                    <h4 className='text-center'>Không có đơn ký gửi.</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderListConsignCare;
