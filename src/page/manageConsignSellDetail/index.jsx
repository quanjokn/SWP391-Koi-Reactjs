import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import styles from './manageConsignSellDetail.module.css';

const ManageConsignSellDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {  
        // Kiểm tra phân quyền người dùng
        if (!user || user.role !== 'Staff') {
            navigate('/error');
            return;
        } else {
            api.post(`/consignManagement/detail/${orderId}`)
                .then(response => {
                    setOrder(response.data);
                    setStatus(response.data.status);
                })
                .catch(error => console.error('Error fetching order detail:', error));
        }
    }, [user, orderId, navigate]);

    const handleStatusChange = () => {
        // Cập nhật trạng thái đơn hàng
        api.post(`https://dummyjson.com/carts/${orderId}`, { isDeleted: status === 'Cancelled' })
            .then(() => {
                setStatus(status === 'Pending' ? 'Cancelled' : 'Pending');
            })
            .catch(error => console.error('Error updating order status:', error));
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Order Details for {order.orderId}</h1>
                <h2>Ngày đặt hàng: {order.request.orderDate}</h2>
                <div className={styles.customerInfo}>
                    <h2>Thông tin khách hàng:</h2>
                    <p>Tên: {order.customer.name}</p> 
                    <p>Số điện thoại: {order.customer.phone}</p> 
                    <p>Địa chỉ: {order.customer.address}</p> 
                </div>
                <h2>Sản phẩm:</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên cá</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.ConsignList.map(product => (
                            <tr key={product.fishId}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price} VND</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'right' }}><strong>Thành tiền:</strong></td>
                            <td><strong>{order.request.totalPrice} VND</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div className={styles.statusContainer}>
                    <label htmlFor="status">Trạng thái:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className={styles.button2} onClick={handleStatusChange}>
                        Cập nhật trạng thái
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ManageConsignSellDetail;
