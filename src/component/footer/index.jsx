import React from 'react';
import styles from './footer.module.css';
import { useNavigate } from 'react-router-dom';
const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className={`row ${styles.footer}`} style={{
            fontSize: 'medium', margin: 0, paddingBottom: 0
        }}>
            <div className={`col-md-4 ${styles.blackBg}`}>
                <div style={{ paddingLeft: '30px', textAlign: 'center' }}>
                    <img src="/imagines/background/logo.jpg" alt="Koi Farm" className={styles.logo} />
                    <p>Koi Farm Shop LLC@, 2024</p>
                    <p>Công Ty TNHH Koi Farm Shop</p>
                    <p>Copyright 2024</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
            <div className={`container col-md-8 ${styles.redBg}`}>
                <div className="row">
                    <div className="col-md-4">
                        <h5>Koi farm Shop</h5>
                        <ul className="list-unstyled">
                            <li><a href="" className={styles.textWhite} onClick={() => navigate('/about')}>Về chúng tôi</a></li>
                            <li><a href="#" className={styles.textWhite}>Đặt hàng online</a></li>
                            <li><a href="#" className={styles.textWhite}>Danh sách mặt hàng</a></li>
                            <li><a href="#" className={styles.textWhite} onClick={() => navigate('/tin-tuc')}>Tin tức</a></li>
                            <li><a href="#" className={styles.textWhite}>Hỗ trợ kỹ thuật</a></li>
                            <li><a href="" className={styles.textWhite} onClick={() => navigate('/lien-he')}>Liên hệ</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Thông tin cá nhân</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className={styles.textWhite} onClick={() => navigate('/login')}>Đăng nhập</a></li>
                            <li><a href="#" className={styles.textWhite}>Quản lý tài khoản</a></li>
                            <li><a href="#" className={styles.textWhite}>Đăng xuất</a></li>
                            <li><a href="#" className={styles.textWhite}>Thông tin cá nhân</a></li>
                            <li><a href="#" className={styles.textWhite}>Hướng dẫn mua bán</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Dịch vụ</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className={styles.textWhite}>Gói hàng cá online/offline</a></li>
                            <li><a href="#" className={styles.textWhite}>Danh sách điểm giao nhận hàng</a></li>
                            <li><a href="#" className={styles.textWhite}>Ký gửi chăm sóc</a></li>
                            <li><a href="#" className={styles.textWhite}>Chính sách bảo mật</a></li>
                            <li><a href="#" className={styles.textWhite}>Chính sách đổi trả hàng</a></li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <p>Thông tin liên hệ: Koifarmshop@gmail.com</p>
                    <p>Sđt liên hệ: 012.345.6789 (+84 23456789)</p>
                </div>
                <div className="row">
                    <p>Địa chỉ công ty: Đường D1, Khu Công nghệ Cao</p>
                    <p>TP.Thủ Đức, TP.HCM, 800000</p>
                </div>
            </div>
        </div >

    );
};

export default Footer;
