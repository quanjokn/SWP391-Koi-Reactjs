import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css'; // CSS module cho định kiểu
import axios from 'axios';

const RegisterForm = () => {
    const navigate = useNavigate();

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

    const [errors, setErrors] = useState({});
    const [registerValues, setRegisterValues] = useState({
        userName: '',
        password: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterValues({
            ...registerValues,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { userName, password, email, phone } = registerValues;

        if (!userName || !password || !email || !phone) {
            setErrors("Cần nhập đầy đủ thông tin đăng kí");
            return;
        } else {
            // Regex xác thực email và số điện thoại
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\d{10}$/;

            const newErrors = {};

            // Xác thực định dạng email
            if (!emailRegex.test(email)) {
                newErrors.email = 'Email không hợp lệ!';
            }

            // Xác thực định dạng số điện thoại
            if (!phoneRegex.test(phone)) {
                newErrors.phone = 'Số điện thoại phải có 10 chữ số!';
            }

            // Cập nhật lỗi
            setErrors(newErrors);

            // Ngừng gửi nếu có lỗi xác thực
            if (Object.keys(newErrors).length > 0) {
                return;
            }

            try {
                // Gửi request tới API đăng ký với dữ liệu JSON
                const response = await api.post('/user/register', {
                    userName,
                    password,
                    email,
                    phone,
                });

                if (response.status === 200) {
                    // Sau khi đăng ký thành công, chuyển hướng tới trang đăng nhập
                    navigate('/login');
                }
            } catch (error) {
                console.error('Đăng ký không thành công:', error);

                // Kiểm tra nếu lỗi là do username đã tồn tại
                if (error.response && error.response.status === 400) {
                    setErrors({ ...errors, userName: 'Tên đăng nhập đã tồn tại!' });
                } else {
                    setErrors({ ...errors, api: 'Đăng ký không thành công. Vui lòng thử lại.' });
                }
            }
        }

    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleRegister}>
                <h1>Đăng ký</h1>
                {errors.userName && <p className={styles.error}>{errors.userName}</p>} {/* Hiển thị lỗi tên đăng nhập trùng */}
                <div className={styles.inputBox}>
                    <input
                        name='userName' // Sửa name thành 'userName'
                        type='text'
                        placeholder='Tên đăng nhập'
                        value={registerValues.userName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.inputBox}>
                    <input
                        name='password'
                        type='password'
                        placeholder='Mật khẩu'
                        value={registerValues.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.inputBox}>
                    <input
                        name='email'
                        type='text'
                        placeholder='Email'
                        value={registerValues.email}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>} {/* Hiển thị lỗi email */}
                </div>
                <div className={styles.inputBox}>
                    <input
                        name='phone'
                        type='text'
                        placeholder='Số điện thoại'
                        value={registerValues.phone}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.phone && <p className={styles.error}>{errors.phone}</p>} {/* Hiển thị lỗi số điện thoại */}
                </div>
                {errors.api && <p className={styles.error}>{errors.api}</p>} {/* Hiển thị lỗi từ API */}

                <button type='submit'>Đăng ký</button>

                <div className={styles.registerLink}>
                    <p>Đã có tài khoản? <a href='' onClick={() => navigate('/login')}>Đăng nhập ngay</a></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
