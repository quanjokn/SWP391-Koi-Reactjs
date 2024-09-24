import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css'; // CSS module cho định kiểu
import axios from 'axios'; // Import axios để gọi API

const RegisterForm = () => {
    const navigate = useNavigate();
    
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
            // Gửi request tới API đăng ký
            const response = await axios.post('/user/addUser', { // Thay đổi URL cho API
                userName,
                password,
                email,
                phone: phone
            });
            console.log('Đăng ký thành công:', response.data);

            // Sau khi đăng ký thành công, chuyển hướng tới trang đăng nhập
            navigate('/login');
        } catch (error) {
            console.error('Đăng ký không thành công:', error);
            setErrors({ ...errors, api: 'Đăng ký không thành công. Vui lòng thử lại.' }); // Thêm thông báo lỗi từ API
        }
    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleRegister}>
                <h1>Đăng ký</h1>
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
