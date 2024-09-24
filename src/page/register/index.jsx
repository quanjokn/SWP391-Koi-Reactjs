import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css'; // CSS module cho định kiểu
import axios from 'axios'; // Import axios để gọi API

const RegisterForm = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/imagines/background/Koi.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = ""; // Khôi phục khi rời khỏi trang
        };
    }, []);

    const [errors, setErrors] = useState({});
    const [registerValues, setRegisterValues] = useState({
        username: '',
        password: '',
        email: '',
        phoneNumber: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setRegisterValues({
            ...registerValues,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { username, password, email, phoneNumber } = registerValues;

        // Regex xác thực email và số điện thoại
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        const newErrors = {};

        // Xác thực định dạng email
        if (!emailRegex.test(email)) {
            newErrors.email = 'Email không hợp lệ!';
        }

        // Xác thực định dạng số điện thoại
        if (!phoneRegex.test(phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại phải có 10 chữ số!';
        }

        // Cập nhật lỗi
        setErrors(newErrors);

        // Ngừng gửi nếu có lỗi xác thực
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            // Gửi request tới API đăng ký
            const response = await axios.post('https://dummyjson.com/users/add', {
                username,
                password,
                email,
                phone: phoneNumber
            });
            console.log('Đăng ký thành công:', response.data);

            // Sau khi đăng ký thành công, chuyển hướng tới trang đăng nhập
            navigate('/login');
        } catch (error) {
            console.error('Đăng ký không thành công:', error);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleRegister}>
                <h1>Đăng ký</h1>
                <div className={styles.inputBox}>
                    <input
                        name='username'
                        type='text'
                        placeholder='Tên đăng nhập'
                        value={registerValues.username}
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
                        name='phoneNumber'
                        type='text'
                        placeholder='Số điện thoại'
                        value={registerValues.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>} {/* Hiển thị lỗi số điện thoại */}
                </div>
                <button type='submit'>Đăng ký</button>

                <div className={styles.registerLink}>
                    <p>Đã có tài khoản? <a href='' onClick={() => navigate('/login')}>Đăng nhập ngay</a></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
