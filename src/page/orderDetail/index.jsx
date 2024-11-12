import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import OrderStatus from '../../component/orderStatus/index';
import styles from './orderDetail.module.css';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import Loading from '../../component/loading';
import { useNavigate, useParams } from 'react-router-dom';
import { color } from 'chart.js/helpers';

const OrderDetail = () => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({});
    const navigate = useNavigate();
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.post(`/order/orderDetail/${orderId}`);
                const orderDTO = response.data;
                console.log(orderDTO)
                if (orderDTO) {
                    setOrder(orderDTO);
                    setOrderItems(orderDTO.orderDetailsDTO);
                } else {
                    console.error('No order data received from backend API');
                    navigate('/error');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    useEffect(() => {
        setContainerStyle({
            marginBottom: '48px',
        });

        return () => {
            setContainerStyle({});
        };
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-5" style={containerStyle}>
                <OrderStatus orderId={order.orderId}
                    date={order.date}
                    status={order.status}
                    orderDate={order.orderDateStatus.orderDate}
                    responseDate={order.orderDateStatus.responseDate}
                    deliveryDate={order.orderDateStatus.deliveryDate}
                    completeDate={order.orderDateStatus.completeDate}
                />

                {order.status === 'Rejected' && (
                    <h3 className={styles.textCenter}>
                        <span>Lý do từ chối:</span> {order.note}
                    </h3>
                )}

                <h3 className={styles.orderDetailH3}>Hóa đơn</h3>
                <div className="order-summary">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={styles.textLeft}>Tên khách hàng</th>
                                <th className={styles.textLeft}>Số điện thoại</th>
                                <th className={styles.textLeft}>Địa chỉ</th>
                                <th className={styles.textRight}>Tổng số lượng</th>
                                <th className={styles.textRight}>Thành tiền VND</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.textLeft}>{order.users?.name || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.users?.phone || 'N/A'}</td>
                                <td className={styles.textLeft}>{order.users?.address || 'N/A'}</td>
                                <td className={styles.textRight}>{order.totalQuantity || 0}</td>
                                <td className={styles.textRight}>{order.totalOrderPrice ? order.totalOrderPrice.toLocaleString('vi-VN') : 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className={styles.orderDetailH3}>Thông tin chi tiết</h3>
                <div className="order-items">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th className={`${styles.textCenter} ${styles.pictureColum}`}>Hình ảnh</th>
                                <th className={styles.textLeft}>Tên cá</th>
                                <th className={`${styles.textRight} ${styles.quantityColumn}`}>Số lượng</th>
                                <th className={styles.textRight}>Giá tiền VND</th>
                                {order.status === 'Completed' && (
                                    <th className={styles.textCenter}>Nhận xét</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item.fishId}>
                                    <td className={`${styles.textCenter} ${styles.pictureColum}`}>
                                        <img
                                            src={item.photo}
                                            alt={item.fishName || 'Hình ảnh sản phẩm'}
                                            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td className={styles.textLeft}>{item.fishName || 'N/A'}</td>
                                    <td className={`${styles.textRight} ${styles.quantityColumn}`}>{item.quantity || 0}</td>
                                    <td className={styles.textRight}>{item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : 0}</td>
                                    {/* Nút đánh giá cho từng con cá */}
                                    {order.status === 'Completed' && !item.evaluationStatus && (
                                        <td className={styles.textCenter}>

                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate(`/review/${orderId}/${item.fishId}`)}
                                            >
                                                Nhận xét
                                            </button>

                                        </td>
                                    )}
                                    {order.status === 'Completed' && item.evaluationStatus && (
                                        <td className={styles.textCenter}>
                                            <button className="btn btn-primary">
                                                Đã nhận xét
                                            </button>

                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetail;
