import React, { useEffect, useState, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { UserContext } from '../../service/UserContext'; // Nhập UserContext

// comment to fix bug git
export const LoginForm = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Thêm state cho thông báo lỗi
    const [rememberMe, setRememberMe] = useState(false); // State để quản lý checkbox "Lưu tài khoản"

    const navigate = useNavigate();
    const { saveUser } = useContext(UserContext); // Lấy setUser từ context

    useEffect(() => {
        // Kiểm tra và tự động điền thông tin tài khoản nếu có trong localStorage
        const storedUsername = localStorage.getItem('savedUsername');
        const storedPassword = localStorage.getItem('savedPassword');
        const storedRememberMe = localStorage.getItem('rememberMe') === 'true'; // Lấy giá trị rememberMe

        if (storedUsername) setUsername(storedUsername);
        if (storedPassword) setPassword(storedPassword);
        setRememberMe(storedRememberMe); // Thiết lập trạng thái rememberMe từ localStorage

        document.body.style.backgroundImage = "url('/imagines/background/Koi.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.style.width = 'auto';
        }

        return () => {
            document.body.style.backgroundImage = ""; // Khôi phục khi rời khỏi trang
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
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

        const loginValues = { userName, password };

        try {
            const response = await api.post('/user/login', loginValues);

            if (response.data && response.data.jwt) {
                // Lưu JWT token vào localStorage
                localStorage.setItem('jwt', response.data.jwt);

                // Lấy thông tin người dùng
                const userResponse = await api.get('/user/profile');

                // Lưu thông tin người dùng vào context
                const user = { jwt: response.data.jwt, ...userResponse.data };
                saveUser(user);

                if (rememberMe) {
                    localStorage.setItem('savedUsername', userName);
                    localStorage.setItem('savedPassword', password); // Cẩn thận với việc lưu mật khẩu
                    localStorage.setItem('rememberMe', 'true'); // Lưu trạng thái rememberMe
                } else {
                    localStorage.removeItem('savedUsername');
                    localStorage.removeItem('savedPassword');
                    localStorage.removeItem('rememberMe'); // Xóa trạng thái rememberMe
                }

                // Điều hướng dựa trên vai trò của người dùng
                if (user.role === 'Customer') {
                    navigate('/'); // Điều hướng về trang chủ
                } else if (user.role === 'Manager' || user.role === 'Staff') {
                    navigate('/admin-dashboard'); // Điều hướng về trang quản lý
                } else {
                    setErrorMessage("Vai trò của bạn không được phân quyền");
                }
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
                        <label>
                            <input type='checkbox' checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                            Lưu tài khoản
                        </label>
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

export default LoginForm;