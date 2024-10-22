import React, { useEffect, useState, useContext } from 'react';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import styles from './orderList.module.css';
import NavigationList from '../../component/navigationList';
import Loading from '../../component/loading';
import { UserContext } from '../../service/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import OrderSearch from '../../component/orderSearch';

const OrderList = () => {
    const [containerStyle, setContainerStyle] = useState({});
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setContainerStyle({
            backgroundColor: '#470101',
            color: 'white',
            margin: '0 auto',
        });
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user.id) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const userid = user.id;
                const response = await api.post(`/order/orderList/${userid}`);
                if (response.data && Array.isArray(response.data)) {
                    const sortedOrders = response.data.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        return dateB - dateA;
                    });
                    setOrders(sortedOrders);
                    setFilteredOrders(sortedOrders);
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
        navigate(`/order-detail/${orderId}`);
    };

    // Hàm xử lý tìm kiếm khi gọi từ component OrderSearch
    const handleSearch = (searchDate, searchStatus) => {
        const filtered = orders.filter(order => {
            const matchesDate = searchDate ? order.date.includes(searchDate) : true;
            const matchesStatus = searchStatus ? order.status === searchStatus : true;
            return matchesDate && matchesStatus;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
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

    const translateStatus = (status) => {
        switch (status) {
            case 'Pending_confirmation':
                return { text: 'Đợi xác nhận' };
            case 'Preparing':
                return { text: 'Đang chuẩn bị' };
            case 'Shipping':
                return { text: 'Đang vận chuyển' };
            case 'Completed':
                return { text: 'Đã hoàn thành', className: styles.done };
            case 'Rejected':
                return { text: 'Đã bị từ chối', className: styles.rejected };
            default:
                return { text: status };
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
                            {/* Component tìm kiếm */}
                            <OrderSearch onSearch={handleSearch} />

                            {isLoading ? (
                                <Loading />
                            ) : currentOrders.length > 0 ? (
                                <>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th className={styles.textLeft}>Ngày</th>
                                                <th className={styles.textLeft}>Mã đơn hàng</th>
                                                <th className={styles.textRight}>Giá VND</th>
                                                <th className={styles.textLeft}>Trạng thái đơn hàng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    onClick={() => handleViewOrderDetail(order.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td className={styles.textLeft}>{order.date}</td>
                                                    <td className={styles.textLeft}>{order.id}</td>
                                                    <td className={styles.textRight}>{order.total.toLocaleString('vi-VN')}</td>
                                                    <td className={`${styles.textLeft} ${translateStatus(order.status).className}`}>{translateStatus(order.status).text}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <nav>
                                        <ul className="pagination justify-content-center">
                                            {pageNumbers.map(number => (
                                                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                                                    <button onClick={() => paginate(number)} className="page-link">
                                                        {number}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </>
                            ) : (
                                <div className={`${styles.noOrdersMessage} p-3 py-5`}>
                                    <h4 className='text-center'>Không có đơn hàng.</h4>
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

export default OrderList;
