import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate
import styles from './styles.module.css';
const Home = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {

        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.style.width = 'auto';
        }

        return () => {
            if (rootElement) {
                rootElement.style.width = ''; // Khôi phục width cho root
            }
        };
    }, []);

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
            <div>
                <a href='/tai-khoan'>account</a>
            </div>
        </div>
    );
};

export default Home;