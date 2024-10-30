import React, { useState, useEffect } from 'react';
import styles from './ForgotForm.module.css';
import { useNavigate } from 'react-router-dom';
import Loading from "../../component/loading/index";
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
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // Thêm state loading

    // Gửi yêu cầu OTP sau khi nhập email và username
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu loading
        try {
            const response1 = await api.post('/email/checkUsernameAndEmail', {
                userName,
                email,
            });
            setErrorMessage("");
            setStep(2);
            const response2 = await api.post('/email/forgotPassword', {
                userName,
                email,
            });
        } catch (error) {
            setErrorMessage("Tài khoản hoặc email không tồn tại");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    // Gửi lại yêu cầu OTP mà không cần nhập lại email và username
    const handleResendOtp = async () => {
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await api.post('/email/forgotPassword', {
                userName,
                email,
            });
            setErrorMessage("Mã OTP mới đã được gửi lại!");
            setIsButtonDisabled(true);
            setTimer(30);

            // Đếm ngược thời gian chờ
            const countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(countdown);
                        setIsButtonDisabled(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } catch (error) {
            setErrorMessage("Lỗi khi gửi lại mã OTP");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    // Xác nhận OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await api.post(`/email/confirmCode/${otp}`);
            setErrorMessage("");
            setStep(3);
        } catch (error) {
            setErrorMessage("Mã OTP không chính xác!");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    // Đổi mật khẩu mới
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Cần nhập mật khẩu reset!");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        } else {
            setErrorMessage('');
        }

        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await api.post('/email/resetPassword', {
                userName,
                email,
                password: newPassword,
                confirmPassword: newPassword
            });

            alert('Đổi mật khẩu thành công!');
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setErrorMessage('Đổi mật khẩu thất bại!');
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className={styles.wrapper}>
            <h1>Quên mật khẩu</h1>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                    <div className={styles.inputBox}>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            type="email"
                            placeholder="Email"
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
                        <button type="submit" disabled={isLoading}>Gửi yêu cầu</button> {/* Vô hiệu hóa nút khi đang loading */}
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
                        <button
                            type="button"
                            style={{ backgroundColor: 'gray' }}
                            onClick={handleResendOtp}
                            disabled={isButtonDisabled} // Vô hiệu hóa nút khi đang đếm ngược hoặc loading
                        >
                            {isButtonDisabled ? `Gửi lại OTP (${timer}s)` : 'Gửi lại OTP'}
                        </button>
                        <button type="submit" disabled={isLoading}>Xác nhận OTP</button> {/* Vô hiệu hóa nút khi đang loading */}
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
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={isLoading}>Đổi mật khẩu</button> {/* Vô hiệu hóa nút khi đang loading */}
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
