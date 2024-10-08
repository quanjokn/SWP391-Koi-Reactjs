import React from 'react';
import { Link } from 'react-router-dom';
import styles from './error.module.css'; 

const ErrorPage = () => {
    return (
        <section className={styles.errorContainer}>
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className={styles.errorTitle}>
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className={styles.errorText}>
                        Xin lỗi, chúng tôi không tìm thấy.
                    </p>
                    <p className={styles.errorDescription}>
                        Nhưng đừng lo lắng, bạn có thể tìm kiếm trong trang chủ.
                    </p>
                    <Link to="/" className={styles.errorLink}>
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;
