import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './changePassword.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import axios from 'axios';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Lấy thông tin user từ context

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        document.body.style.backgroundColor = "white"; // Đặt màu nền trắng
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handlePasswordChange = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (newPassword !== confirmPassword) {
            setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/user/changePassword/${user.id}`, {
                oldPassword,
                newPassword
            });

            if (response.data.success) {
                setSuccessMessage('Mật khẩu đã được thay đổi thành công!');
                setErrorMessage('');
            } else {
                setErrorMessage('Thay đổi mật khẩu thất bại.');
            }
        } catch (error) {
            setErrorMessage('Có lỗi xảy ra khi thay đổi mật khẩu.');
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={`${styles.container} px-4 px-lg-5`}>
                <div className="row">
                    <div className="col-md-3">
                        <ul className={`${styles.listGroup} list-group`}>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/">Trang chủ</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Đơn hàng</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/tai-khoan">Trang tài khoản</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/doi-mat-khau">Thay đổi mật khẩu</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/">Đăng xuất</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 py-5">
                            <h4 className="text-right">Đổi mật khẩu</h4>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}

                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className={styles.labels}>Mật khẩu cũ</label>
                                    <input
                                        type="password"
                                        className={`form-control ${styles.inputField}`}
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className={styles.labels}>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className={`form-control ${styles.inputField}`}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className={styles.labels}>Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className={`form-control ${styles.inputField}`}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="mt-5 text-center">
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handlePasswordChange}
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ChangePasswordPage;
