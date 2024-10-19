import React, { useContext } from 'react';
import styles from './header.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';

const Header = () => {
    const navigate = useNavigate();
    // Lấy thông tin user từ UserContext
    const { user } = useContext(UserContext);
    // Hàm xử lý sự kiện nhấp chuột vào icon user
    const handleUserClick = () => {
        if (user) {
            navigate('/tai-khoan');
        } else {
            navigate('/login');
        }
    };
    return (
        <div className={styles.tagbar}>
            <div className={styles.leftSection}>
                <img src="/imagines/logo/koi-farm-shop-logo-3.png" alt="Koi farm logo" className={styles.logo} onClick={() => navigate('/')} />
                <h1 className={styles.siteTitle}>Koi farm Shop</h1>
            </div>
            <div className={styles.rightSection}>
                <span onClick={(handleUserClick)} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-user"></i>
                    {user ? user.name : 'Đăng nhập'}
                </span>
            </div>
        </div>
    );
};

export default Header;
