import React, { useEffect, useState } from 'react';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import styles from './orderList.module.css';
import NavigationList from '../../component/navigationList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderList = () => {
    const [containerStyle, setContainerStyle] = useState({});
    const [orders, setOrders] = useState([]); // Khởi tạo mảng đơn hàng
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
            try {
                const response = await axios.get('https://dummyjson.com/carts');
                if (response.data && response.data.carts) {
                    setOrders(response.data.carts); // Đảm bảo bạn đang thiết lập đúng mảng đơn hàng
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrderDetail = () => {
        navigate('/order-detail');
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
                            {orders.length > 0 ? (
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Trạng thái đơn hàng</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => {
                                            const totalPrice = order.products.reduce((total, product) => total + product.price * product.quantity, 0);
                                            const productNames = order.products.map(product => product.title).join(', '); // Tạo chuỗi tên sản phẩm
                                            const totalQuantity = order.products.reduce((total, product) => total + product.quantity, 0); // Tính tổng số lượng sản phẩm

                                            return (
                                                <tr key={order.id} onClick={handleViewOrderDetail} style={{ cursor: 'pointer' }}>
                                                    <td>{order.date || 'N/A'}</td>
                                                    <td>{order.status || 'N/A'}</td>
                                                    <td>{productNames}</td>
                                                    <td>{totalQuantity}</td>
                                                    <td>{totalPrice} VND</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
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
