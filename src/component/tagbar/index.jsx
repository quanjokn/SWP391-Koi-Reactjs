import React, {useContext} from 'react';
import styles from './tagbar.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../service/UserContext'; // Import UserContext

const Tagbar = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleGoToCart = () => {
        navigate('/cart');
    };

    

    return (
        <>
            <div className={styles.tagbar}>
                {/* Hiển thị menu và giỏ hàng cho Customer */}
                {user?.role === 'Customer' ||  !user && (
                    <>
                        <div className={styles.navContainer}>
                            <nav>
                                <ul className={styles.navList}>
                                    <li><Link to="/">Trang chủ</Link></li>
                                    <li><Link to="/fish/fishes-list">Sản phẩm</Link></li>
                                    <li><Link to="/giong-ca">Giống cá</Link></li>
                                    <li><Link to="/tin-tuc">Tin tức</Link></li>
                                    <li><Link to="/lien-he">Liên hệ</Link></li>
                                </ul>
                            </nav>
                        </div>
                        {/* Cart layout */}
                        <div onClick={handleGoToCart} className={styles.header_cart}>
                            <i className={`fas fa-shopping-cart ${styles.customCartIcon}`}></i>
                            <span className={styles.cartQuantity}>
                                <sup className={`${styles.cartamount}`}>0</sup>
                            </span>
                        </div>
                    </>
                )}

                {/* Hiển thị menu cho Staff*/}
                {(user?.role === 'Staff') && (
                    <div className={styles.navContainer}>
                            <nav>
                                <ul className={styles.navList}>
                                <li><Link to="/manage-orders">Đơn hàng</Link></li>
                                <li><Link to="/inventory">Ký gửi chăm sóc</Link></li>
                                <li><Link to="/">Ký gửi bán</Link></li>
                                <li><Link to="/">Đang xử lý</Link></li>
                                <li><Link to="/">Lịch sử</Link></li>
                                </ul>
                            </nav>
                        </div>
                )}

                {/* Hiển thị menu cho Manager*/}
                    {(user?.role === 'Manager') && (
                    <div className={styles.navContainer}>
                            <nav>
                                <ul className={styles.navList}>
                                <li><Link to="/orders">Dash board</Link></li>
                                <li><Link to="/inventory">Nhân viên</Link></li>
                                <li><Link to="/">Khách hàng</Link></li>
                                <li><Link to="/">Hàng tồn kho</Link></li>
                                <li><Link to="/">Tin tức</Link></li>
                                </ul>
                            </nav>
                        </div>
                )}
            </div>
        </>
    );
};

export default Tagbar;
