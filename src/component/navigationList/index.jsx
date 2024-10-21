import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link
import styles from './navigationList.module.css';
import { UserContext } from '../../service/UserContext';

const NavigationList = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const location = useLocation();
    const { user } = useContext(UserContext);

    const handleLogout = () => {
        logout(); // Gọi hàm logout
        navigate('/'); // Chuyển hướng về trang chủ
    };

    // Hàm kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn đã cho
    const isActive = (path) => (location.pathname === path ? styles.active : '');

    return (
        <>
            {(user?.role === 'Customer' || !user) && (
                <div className="col-md-3">
                    {/* Hiển thị menu và giỏ hàng cho Customer */}


                    <ul className={`${styles.listGroup} list-group`}>
                        <li className={`${styles.listGroupItem} list-group-item`}>
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/order-list')}`}>
                            <Link to="/order-list">Đơn hàng</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/order-list-consign-care')}`}>
                            <Link to="/order-list-consign-care">Đơn ký gửi chăm sóc</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/order-list-consign-sell')}`}>
                            <Link to="/order-list-consign-sell">Đơn ký gửi để bán</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/tai-khoan')}`}>
                            <Link to="/tai-khoan">Trang tài khoản</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/doi-mat-khau')}`}>
                            <Link to="/doi-mat-khau">Thay đổi mật khẩu</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item`}>
                            <Link to="" onClick={handleLogout}>Đăng xuất</Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Hiển thị menu và giỏ hàng cho Customer */}
            {(user?.role === 'Staff' || !user) && (
                <div className="col-md-3">
                    <ul className={`${styles.listGroup} list-group`}>
                        <li className={`${styles.listGroupItem} list-group-item`}>
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/tai-khoan')}`}>
                            <Link to="/tai-khoan">Trang tài khoản</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/doi-mat-khau')}`}>
                            <Link to="/doi-mat-khau">Thay đổi mật khẩu</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item`}>
                            <Link to="" onClick={handleLogout}>Đăng xuất</Link>
                        </li>
                    </ul>

                </div>
            )}

            {/* Hiển thị menu và giỏ hàng cho Customer */}
            {(user?.role === 'Manager' || !user) && (
                <div className="col-md-3">
                    <ul className={`${styles.listGroup} list-group`}>
                        <li className={`${styles.listGroupItem} list-group-item`}>
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/tai-khoan')}`}>
                            <Link to="/tai-khoan">Trang tài khoản</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item ${isActive('/doi-mat-khau')}`}>
                            <Link to="/doi-mat-khau">Thay đổi mật khẩu</Link>
                        </li>
                        <li className={`${styles.listGroupItem} list-group-item`}>
                            <Link to="" onClick={handleLogout}>Đăng xuất</Link>
                        </li>
                    </ul>

                </div>
            )}
        </>
    );
};

export default NavigationList;
