import React from 'react';
import styles from './tagbar.module.css';
import { useNavigate } from 'react-router-dom';

const Tagbar = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Điều hướng quay lại trang trước
    };

    return (
        <>
            <div className={styles.tagbar}>
                <button className={styles.goBackButton} onClick={handleGoBack}>
                    Quay lại
                </button>
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
            </div>
        </>
    );
};

export default Tagbar;
