import React from 'react';
import styles from './footer.module.css';
const Footer = () => {

    return (
        <div className={`row ${styles.footer}`} style={{
            fontSize: 'medium', margin: 0, paddingBottom: 0
        }}>
            <div className={`col-md-4 ${styles.blackBg}`}>
                <div style={{ paddingLeft: '30px', textAlign: 'center' }}>
                    <img src="/imagines/logo/koi-farm-shop-logo-3.png" alt="Koi Farm" className={styles.logo} />
                    <p>Koi Farm Shop LLC@, 2024</p>
                    <p>Công Ty TNHH Koi Farm Shop</p>
                    <p>Copyright 2024</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
            <div className={`container col-md-8 ${styles.redBg}`}>
                <div className="row">
                    <div className="col-md-4">
                        <h5>Koi Farm Shop</h5>
                        <ul className="list-unstyled">
                            <li><a href="/gioi-thieu" className={styles.textWhite}>Về chúng tôi</a></li>
                            <li><a href="/fish/fishes-list" className={styles.textWhite}>Danh sách mặt hàng</a></li>
                            <li><a href="/tin-tuc" className={styles.textWhite}>Tin tức</a></li>

                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Thông tin cá nhân</h5>
                        <ul className="list-unstyled">
                            <li><a href="/login" className={styles.textWhite}>Đăng nhập</a></li>
                            <li><a href="/tai-khoan" className={styles.textWhite}>Thông tin cá nhân</a></li>
                            <li><a href="/lien-he" className={styles.textWhite}>Liên hệ</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Dịch vụ</h5>
                        <ul className="list-unstyled">
                            <li><a href="/ki-gui-ban-ca" className={styles.textWhite}>Ký gửi bán cá</a></li>
                            <li><a href="/ki-gui-cham-soc" className={styles.textWhite}>Ký gửi chăm sóc cá</a></li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <p>Thông tin liên hệ: koifarmshopswp391@gmail.com</p>
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
