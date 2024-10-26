import React, { useContext } from 'react';
import styles from './header.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext); // Assuming setUser is provided to update user state
    const { logout } = useContext(UserContext);
    // Handle click on the user icon
    const handleUserClick = () => {
        if (user) {
            navigate('/tai-khoan');
            window.location.reload();
        } else {
            navigate('/login');
        }
    };

    // Handle click on the logout icon
    const handleLogout = () => {
        logout(); 

        // Redirect to login page
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className={styles.tagbar}>
            <div className={styles.leftSection}>
                <img
                    src="/imagines/logo/koi-farm-shop-logo-3.png"
                    alt="Koi farm logo"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                />
                <h1 className={styles.siteTitle}>Koi Farm Shop</h1>
            </div>
            <div className={styles.rightSection}>
                <span onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-user"></i>
                    {user ? user.name : 'Đăng nhập'}
                </span>
                {user && (
                    <span onClick={handleLogout} style={{ cursor: 'pointer', color: 'lightgray' }}>
                        <i className="fas fa-sign-out-alt"></i> {/* Logout icon */}
                        Đăng xuất
                    </span>
                )}
            </div>
        </div>
    );
};

export default Header;
