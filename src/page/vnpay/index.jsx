import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';
import styles from './VNPay.module.css';

const CreateVNPay = () => {
    const { user } = useContext(UserContext);
    const [content, setContent] = useState('');
    const { type, userId, orderId, vnpayCode, money } = useParams();
    const [isChecked, setIsChecked] = useState(false); 
    const [validationMessage, setValidationMessage] = useState(''); 

    useEffect(() => {
        if (user && user.name) {
            if (type === 'order') {
                setContent(`Thanh toan don hang #${vnpayCode} - ${user.name}`);
            } else if (type === 'caringOrder') {
                setContent(`Thanh toan ki gui cham soc #${vnpayCode} - ${user.name}`);
            } else if (type === 'consignOrder') {
                setContent(`Thanh toan ki gui ban #${vnpayCode} - ${user.name}`);
            }
        }
    }, [type, vnpayCode, user]);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        setValidationMessage(''); 
    };

    const handleNavigateOnlinePayment = async () => {
        if (!isChecked) {
            setValidationMessage("Bạn phải đồng ý với điều khoản thanh toán."); 
            return;
        }

        try {
            const response = await api.post(`/api/payment/create_payment/${type}/${userId}/${orderId}/${vnpayCode}/${content}`, {});
            console.log(response.data);
            return window.location.href = response.data;
        } catch (error) {
            console.error("Error fetching payment URL:", error);
            alert("Có lỗi xảy ra khi lấy đường dẫn thanh toán. Vui lòng thử lại.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.row} ${styles.mt5}`}>
                <div className={styles.colMd6}>
                    <div className={styles.card}>
                        <div className={styles.cardBody}>
                            <img src='/imagines/logo/vnpay-logo.jpg' alt="VNPay Logo" className={styles.logo} />
                            <h2 className={styles.cardTitle}>Thanh Toán Đơn Hàng</h2>
                                <div className={styles.formGroup}>
                                    <label htmlFor="amount">Số tiền:</label>
                                    <input
                                        type="number"
                                        className={styles.formControl}
                                        value={money}
                                        id="amount"
                                        readOnly
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="orderInfo">Thông tin đơn hàng:</label>
                                    <input
                                        type="text"
                                        value={content}
                                        className={styles.formControl}
                                        id="orderInfo"
                                        readOnly
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor="agree">Tôi đồng ý với các điều khoản thanh toán</label>
                                </div>
                                <button onClick={handleNavigateOnlinePayment} className={styles.btnPrimary}>Thanh toán</button>
                                {validationMessage && (
                                    <div className={styles.validationMessage} style={{ color: 'red' }}>
                                        {validationMessage}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateVNPay;
