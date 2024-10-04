import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './navigationList.module.css';
import { UserContext } from '../../service/UserContext';

const NavigationList = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const location = useLocation(); // Lấy thông tin về địa chỉ URL hiện tại

    const handleLogout = () => {
        logout(); // Gọi hàm logout
        navigate('/'); // Chuyển hướng về trang chủ
    };

    // Hàm kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn đã cho
    const isActive = (path) => location.pathname === path ? styles.active : '';

    return (
        <div className="col-md-3">
            <ul className={`${styles.listGroup} list-group`}>
                <li className={`${styles.listGroupItem} list-group-item`}>
                    <a href="/">Trang chủ</a>
                </li>
                <li className={`${styles.listGroupItem} list-group-item`}>
                    <a href="">Đơn hàng</a>
                </li>
                <li className={`${styles.listGroupItem} list-group-item ${isActive('/tai-khoan')}`}>
                    <a href="/tai-khoan">Trang tài khoản</a>
                </li>
                <li className={`${styles.listGroupItem} list-group-item ${isActive('/doi-mat-khau')}`}>
                    <a href="/doi-mat-khau">Thay đổi mật khẩu</a>
                </li>
                <li className={`${styles.listGroupItem} list-group-item`}>
                    <a href="" onClick={handleLogout}>Đăng xuất</a>
                </li>
            </ul>
        </div>
    );
};

export default NavigationList;
