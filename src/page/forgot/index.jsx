import React, { useState, useEffect } from 'react';
import styles from './ForgotForm.module.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/imagines/background/Koi.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        // Khôi phục background khi rời khỏi trang
        return () => {
            document.body.style.backgroundImage = ""; // Hoặc thiết lập lại theo mặc định
        };
    }, []);

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const [step, setStep] = useState(1); // Quản lý các bước
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Gửi yêu cầu OTP sau khi nhập email
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        console.log('Email gửi đến:', email);
        setStep(2); // Chuyển đến bước nhập mã OTP
    };

    // Xác nhận OTP
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        console.log('Mã OTP:', otp);
        setStep(3); // Chuyển đến bước nhập mật khẩu mới
    };

    // Đổi mật khẩu mới
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        console.log('Mật khẩu mới:', newPassword);
        // Thực hiện hành động đổi mật khẩu tại đây

        // Giả lập thành công đổi mật khẩu
        alert('Đổi mật khẩu thành công!'); // Thông báo đổi mật khẩu thành công

        // Điều hướng về trang đăng nhập
        navigate('/login');
    };

    return (
        <div className={styles.wrapper}>
            <h1>Quên mật khẩu</h1>

            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
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
                        <button type="button"
                            style={{ backgroundColor: 'gray' }}
                            onClick={() => navigate('/login')}>Huỷ</button>
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
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
