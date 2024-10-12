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
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);   

    useEffect(() => {
        if (!user || user.role !== 'Staff') {
            navigate('/error');
        } else {
            api.get('/caringManagement/allPendingOrder')
                .then(response => {
                    console.log(response);                    
                    setOrders(response.data);
                })
                .catch(error => console.error('Error fetching orders:', error));
        }
    }, [user, navigate]);

    const handleOrderClick = (orderId) => {
        navigate(`/manage-orders/${orderId}`);
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Danh sách đơn ký gửi chăm sóc</h1>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày đặt hàng</th>
                            <th>Thành tiền</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className={styles.row}>
                                <td>{order.id}</td>
                                <td>{order.startDate}</td>
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
            </div>
            <Footer />
        </>
    );
};

export default ManageConsignCare;
