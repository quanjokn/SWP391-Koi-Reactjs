import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginForm = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Thêm state cho thông báo lỗi

    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = "url('/imagines/background/Koi.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = ""; // Khôi phục khi rời khỏi trang
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn chặn reload trang khi submit form

        const loginValues = { userName, password };

        try {
            // Thêm 'http://' trước địa chỉ API
            const response = await axios.post('http://localhost:8080/user/login', loginValues);

            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            setErrorMessage("Tài khoản hoặc mật khẩu sai"); // Cập nhật thông báo lỗi
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                <form onSubmit={handleLogin}>
                    <h1>Đăng nhập</h1>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Hiển thị thông báo lỗi */}

                    <div className={styles['input-box']}>
                        <input
                            name='username'
                            type='text'
                            placeholder='Tên đăng nhập'
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles['input-box']}>
                        <input
                            name='pass'
                            type='password'
                            placeholder='Mật khẩu'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles['remmember-forgot']}>
                        <label><input type='checkbox' />Lưu tài khoản</label>
                        <a href="#" onClick={() => navigate('/forgot-password')}>Quên mật khẩu</a>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" style={{ backgroundColor: 'gray' }} onClick={() => navigate('/')}>Quay lại</button>
                        <button type='submit'>Đăng nhập</button>
                    </div>

                    <div className={styles.titleLogin}>
                        <h3>Đăng nhập với</h3>
                    </div>

                    <div className={styles.socialLogin}>
                        <a href="#" className={styles.btnFace} onClick={() => console.log("Đăng nhập bằng Facebook")}>
                            <i className="fab fa-facebook"></i>Facebook
                        </a>
                        <a href="#" className={styles.btnGoogle} onClick={() => console.log("Đăng nhập bằng Google")}>
                            <img src="/imagines/icon/icon-google.png" alt="GOOGLE" />
                            Google
                        </a>
                    </div>

                    <div className={styles['register-link']}>
                        <p>Không có tài khoản ? <a href='' onClick={() => navigate('/register')}>Đăng kí ngay</a></p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginForm;
