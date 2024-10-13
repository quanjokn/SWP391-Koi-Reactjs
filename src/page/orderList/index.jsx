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

const OrderList = () => {
    const [containerStyle, setContainerStyle] = useState({});
    const [orders, setOrders] = useState([]); // Khởi tạo mảng đơn hàng
    const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
    const [ordersPerPage] = useState(10); // Số đơn hàng hiển thị mỗi trang
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

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user.id) {
                // Nếu user hoặc user.id không tồn tại, không gọi API
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const userid = user.id;
                const response = await api.post(`/order/orderList/${userid}`);
                console.log(response);
                if (response.data && Array.isArray(response.data)) {
                    setOrders(response.data);
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
            <div className={`${styles.container} px-4 px-lg-5`} style={containerStyle}>
                <div className="row">
                    <NavigationList />
                    <div className="col-md-9">
                        <div className="p-3 py-5">
                            {isLoading ? (
                                <Loading /> // Hiển thị Loading khi đang tải
                            ) : currentOrders.length > 0 ? (
                                <>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Ngày</th>
                                                <th>Mã đơn hàng</th>
                                                <th>Giá</th>
                                                <th>Trạng thái đơn hàng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders.map((order) => {
                                                const productNames =
                                                    order.orderDetails && order.orderDetails.length > 0
                                                        ? order.orderDetails.map((product) => product.title).join(', ')
                                                        : 'Chưa có sản phẩm';

                                                const totalQuantity =
                                                    order.orderDetails && order.orderDetails.length > 0
                                                        ? order.orderDetails.reduce((total, product) => total + product.quantity, 0)
                                                        : 0;

                                                const totalPrice = order.total || 0;

                                                return (
                                                    <tr
                                                        key={order.id}
                                                        onClick={() => handleViewOrderDetail(order.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>{order.date || 'N/A'}</td>
                                                        <td>{'KFS_' + order.id}</td>
                                                        <td>{totalPrice} VND</td>
                                                        <td>{order.status || 'N/A'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {/* Hiển thị nút phân trang */}
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
                                    <h4 className='text-center'>Bạn chưa đặt đơn hàng.</h4>
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
