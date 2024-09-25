import React from 'react';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate
import styles from './styles.module.css';
const Home = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    return (
        <div className={styles.wrapper}>
            <div>
                <a href='' onClick={() => navigate('/login')}>Login</a>
            </div>
            <div>
                <a href='' onClick={() => navigate('/tin-tuc')}>Blog</a>
            </div>
            <div>
                <a href='/about'>about</a>
            </div>
        </div>
    );
};

export default Home;