import React, { useEffect, useState, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { UserContext } from '../../service/UserContext'; // Nhập UserContext

export const LoginForm = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Thêm state cho thông báo lỗi

    const navigate = useNavigate();
    const { saveUser } = useContext(UserContext); // Lấy setUser từ context

    useEffect(() => {
        document.body.style.backgroundImage = "url('/imagines/background/Koi.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.style.width = 'auto';
        }

        return () => {
            document.body.style.backgroundImage = ""; // Khôi phục khi rời khỏi trang
            if (rootElement) {
                rootElement.style.width = ''; // Khôi phục width cho root
            }
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!userName || !password) {
            setErrorMessage("Cần nhập tài khoản và mật khẩu");
            return;
        }

        if (!userName || !password) {
            setErrorMessage("Cần nhập tài khoản và mật khẩu");
            return;
        } else {
            const loginValues = { userName, password };

        try {
            const response = await api.post('/user/login', loginValues);

            if (response.data && response.data.jwt) {
                // Lưu JWT token vào localStorage
                localStorage.setItem('jwt', response.data.jwt);

                // Lấy thông tin người dùng
                const userResponse = await api.get('/user/profile');

                // Lưu thông tin người dùng vào context
                saveUser({ jwt: response.data.jwt, ...userResponse.data });

                // Điều hướng đến trang chính
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                // Kiểm tra nếu có dữ liệu lỗi trong phản hồi
                if (error.response.status === 400) {
                    setErrorMessage("Tài khoản hoặc mật khẩu sai");
                } else {
                    setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
                }
            } else {
                // Nếu không có response, có thể là lỗi mạng
                setErrorMessage("Có lỗi mạng xảy ra. Vui lòng kiểm tra kết nối của bạn.");
            }
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
                        <a href="" onClick={() => navigate('/forgot-password')}>Quên mật khẩu</a>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" style={{ backgroundColor: 'gray' }} onClick={() => navigate('/')}>Trang chủ</button>
                        <button type='submit'>Đăng nhập</button>
                    </div>

                    <div className={styles.titleLogin}>
                        <h3>Đăng nhập với</h3>
                    </div>

                    <div className={styles.socialLogin}>
                        <a href="http://localhost:8080/oauth2/authorization/google" className={styles.btnGoogle} onClick={() => console.log("Đăng nhập bằng Google")}>
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
};
export default LoginForm;
