import React, { useState, useEffect } from 'react';
import styles from './ForgotForm.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const ForgotPassword = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/imagines/background/Koi.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.style.width = 'auto';
        }

        return () => {
            document.body.style.backgroundImage = "";
            if (rootElement) {
                rootElement.style.width = '';
            }
        };
    }, []);

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [userName, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Gửi yêu cầu OTP sau khi nhập email và username
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/email/forgotPassword', {
                userName,
                email,
            });
            setErrorMessage("");
            setStep(2);
        } catch (error) {
            setErrorMessage("Tài khoản hoặc email không tồn tại");
        }
    };

    // Xác nhận OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/email/confirmCode/${otp}`);
            setErrorMessage("");
            setStep(3);
        } catch (error) {
            setErrorMessage("Mã OTP không chính xác!");
        }
    };

    // Đổi mật khẩu mới
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!"); // Cập nhật thông báo lỗi
            return;
        } else {
            setErrorMessage('');
        }

        try {
            // Gửi request để reset password với cả 2 trường password và confirmPassword
            const response = await api.post('/email/resetPassword', {
                userName,        // Gửi userName từ form
                email,           // Gửi email từ form
                password: newPassword,       // Mật khẩu mới
                confirmPassword: newPassword // Xác nhận mật khẩu mới (cần xác nhận 2 lần để khớp)
            });

            alert('Đổi mật khẩu thành công!');
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setErrorMessage('Đổi mật khẩu thất bại!');
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>Quên mật khẩu</h1>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                    <div className={styles.inputBox}>
                        <input
                            type="text"
                            placeholder="Nhập tên đăng nhập của bạn"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            style={{ backgroundColor: 'gray' }}
                            onClick={() => navigate('/login')}
                        >
                            Huỷ
                        </button>
                        <button type="submit">Gửi yêu cầu</button>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit}>
                    <div className={styles.inputBox}>
                        <input
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit">Xác nhận OTP</button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePasswordSubmit}>
                    <div className={styles.inputBox}>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} // Cập nhật newPassword
                            required
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} // Cập nhật confirmPassword
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit">Đổi mật khẩu</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
