import React from 'react';
import styles from './tagbar.module.css';
import { useNavigate } from 'react-router-dom';

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
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/fish/fishes-list">Sản phẩm</a></li>
                            <li><a href="/giong-ca">Giống cá</a></li>
                            <li><a href="/tin-tuc">Tin tức</a></li>
                            <li><a href="/lien-he">Liên hệ</a></li>
                        </ul>
                    </nav>
                </div>
                <div className={styles.header_cart} onClick={handleGoToCart}>
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
