import React from 'react';
import styles from './tagbar.module.css';
import { useNavigate, Link } from 'react-router-dom';

const Tagbar = () => {
    const navigate = useNavigate();

    const handleGoToCart = () => {
        navigate('/cart');
    };

    return (
        <>
            <div className={styles.tagbar}>
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
                <div className={styles.header_cart}>
                    <i className={`fas fa-shopping-cart ${styles.customCartIcon}`}></i>
                    <span className={styles.cartQuantity}>
                        <sup className={`${styles.cartamount}`}>0</sup>
                    </span>
                </div>
            </div>
        </>
    );
};

export default Tagbar;
