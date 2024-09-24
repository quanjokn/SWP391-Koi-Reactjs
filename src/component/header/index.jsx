import React from 'react';
import styles from './header.module.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.tagbar}>
            <div className={styles.leftSection}>
                <img src="/imagines/background/logo.jpg" alt="Koi farm logo" className={styles.logo} />
                <h1 className={styles.siteTitle}>Koi farm Shop</h1>
            </div>
            <div className={styles.rightSection}>
                <span><i className="fas fa-envelope"></i> koifarmshop@email.com</span>
                <span><i className="fas fa-bell"></i> Thông báo</span>
                <span onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-cogs"></i> Cài đặt
                </span>
                <span onClick={() => navigate('/support')} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-tools"></i> Hỗ trợ kỹ thuật
                </span>
            </div>
        </header>
    );
};

export default Header;
