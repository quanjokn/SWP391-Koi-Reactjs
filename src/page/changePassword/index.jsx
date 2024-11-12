import React, { useState, useEffect, useContext } from 'react';
import styles from './changePassword.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import api from '../../config/axios';
import NavigationList from '../../component/navigationList';

const ChangePasswordPage = () => {
    const [containerStyle, setContainerStyle] = useState({});
    const { user } = useContext(UserContext); // Lấy thông tin user từ context

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setContainerStyle({
            backgroundColor: '#470101',
            color: 'white',
            margin: '0 auto', // Canh giữa trang
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Đặt lại thông báo khi người dùng nhập lại mật khẩu
        setErrorMessage('');
        setSuccessMessage('');

        setPasswordData({ ...passwordData, [name]: value });
    };

    const handlePasswordChange = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        // Đặt lại thông báo khi người dùng nhập lại mật khẩu
        setErrorMessage('');
        setSuccessMessage('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setErrorMessage('Bạn không được để trống các ô nhập');
            return;
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        try {

            const response = await api.post(`/user/changePassword/${user.id}`, {
                oldPassword,
                newPassword,
                confirmPassword
            });
            console.log(response.data)
            if (response.data && response.data.id) {
                setSuccessMessage('Mật khẩu đã được thay đổi thành công!');
                // Reset passwordData về giá trị mặc định
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setErrorMessage('');
            } else {
                setErrorMessage('Thay đổi mật khẩu thất bại.');
            }
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data; // Lấy thông báo lỗi từ phản hồi backend
                setErrorMessage(message || 'Yêu cầu không hợp lệ.');
            } else if (error.request) {
                // Trường hợp không nhận được phản hồi từ server (có thể là lỗi mạng hoặc CORS)
                console.error('No response received:', error.request);
                setErrorMessage('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng');
            } else {
                // Các lỗi khác (thiết lập sai hoặc lỗi không xác định)
                console.error('Error:', error.message);
                setErrorMessage('Có lỗi xảy ra, vui lòng thử lại.');
            }
        }
    };


    return (
        <>
            <Header />
            <Tagbar />
            <div className={`${styles.container} px-4 px-lg-5`} style={containerStyle}>
                <div className="row">
                    <NavigationList />
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
