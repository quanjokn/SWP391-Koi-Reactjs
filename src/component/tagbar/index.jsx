import React, { useState, useContext, useEffect } from 'react';
import styles from './tagbar.module.css';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../config/axios';
import { UserContext } from '../../service/UserContext';

const Tagbar = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [numberQuanity, setNumberQuanity] = useState(null);
    const userId = user ? user.id : null;
    const handleGoToCart = () => {
        navigate('/cart');
    };

    useEffect(() => {
        if (userId) {
            api.post(`/cart/${userId}`)
                .then(response => {
                    const cartItems = response.data.cartItems;
                    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
                    setNumberQuanity(totalQuantity);
                })
                .catch(error => {

                });
        }
    }, [userId]);

    return (
        <>
            <div className={styles.tagbar}>
                {/* Hiển thị menu và giỏ hàng cho Customer */}
                {(user?.role === 'Customer' || !user) && (
                    <>
                        <div className={styles.navContainer}>
                            <nav>
                                <ul className={styles.navList}>
                                    <li><Link to="/">Trang chủ</Link></li>
                                    <li><Link to="/fish/fishes-list">Sản phẩm</Link></li>
                                    <li>
                                        <span className={styles["dich-vu"]}>Dịch vụ</span>
                                        <ul>
                                            <li><Link to="/ki-gui-cham-soc"> Ký gửi chăm sóc</Link> </li>
                                            <li><Link to="/ki-gui-ban-ca"> Ký gửi bán</Link> </li>
                                        </ul>
                                    </li>
                                    <li><Link to="/tin-tuc">Tin tức</Link></li>
                                    <li><Link to="/lien-he">Liên hệ</Link></li>
                                </ul>
                            </nav>
                        </div>
                        {/* Cart layout */}
                        <div onClick={handleGoToCart} className={styles.header_cart}>
                            <i className={`fas fa-shopping-cart ${styles.customCartIcon}`}></i>
                            <span>{numberQuanity !== null ? numberQuanity : 0}</span>
                        </div>
                    </>
                )}

                {/* Hiển thị menu cho Staff*/}
                {(user?.role === 'Staff') && (
                    <div className={styles.navContainer}>
                        <nav>
                            <ul className={styles.navList}>
                                <li><Link to="/manage-orders">Đơn hàng</Link></li>
                                <li><Link to="/manage-consign-care">Ký gửi chăm sóc</Link></li>
                                <li><Link to="/manage-consign-sell">Ký gửi bán</Link></li>
                                <li><Link to="/manage-blog">Tạo tin tức</Link></li>
                                <li><Link to="/process-order">Đang xử lý</Link></li>
                                <li><Link to="/history">Lịch sử</Link></li>
                            </ul>
                        </nav>
                    </div>
                )}

                {/* Hiển thị menu cho Manager*/}
                {(user?.role === 'Manager') && (
                    <div className={styles.navContainer}>
                        <nav>
                            <ul className={styles.navList}>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/nhan-vien">Users</Link></li>
                                <li><Link to="/">Khuyến mãi</Link></li>
                                <li><Link to="/quan-li-san-pham">Kho</Link></li>                                
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
};

export default Tagbar;
