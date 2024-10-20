import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import styles from './review.module.css';

const Review = () => {
    const { orderId, fishId } = useParams(); // Lấy orderId và fishId từ URL
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post(`/feedback/${orderId}/${fishId}`, { feedback, rating });
            alert('Đánh giá của bạn đã được gửi!');
            navigate(`/order-detail/${orderId}`); // Chuyển hướng về trang chi tiết đơn hàng sau khi đánh giá xong
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClick = (value) => {
        setRating(value);
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.reviewContainer}>
                <h2 className={styles.title}>Đánh giá sản phẩm</h2>
                <form onSubmit={handleSubmit} className={styles.reviewForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="feedback">Phản hồi của bạn:</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            className={styles.textArea}
                            placeholder="Hãy chia sẻ cảm nghĩ của bạn về sản phẩm"
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="rating">Đánh giá (1-5):</label>
                        <div id="rating" className={styles.starContainer}>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1; // Giá trị sao

                                return (
                                    <svg
                                        key={starValue}
                                        width="45"
                                        height="45"
                                        viewBox="0 0 45 45"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`${styles.starIcon} ${starValue <= rating ? styles.selectedStar : ''}`}
                                        onClick={() => handleClick(starValue)}
                                    >
                                        <polygon
                                            points="22.5,0 29.5,15 45,16.5 33,27.5 36.5,43.5 22.5,35 8.5,43.5 12,27.5 0,16.5 15.5,15"
                                            fill={starValue <= rating ? '#ffd700' : '#e4e5e9'} // Vàng cho sao được chọn, xám cho sao chưa chọn
                                        />
                                    </svg>
                                );
                            })}
                        </div>
                    </div>


                    <button
                        type="submit"
                        className={`${styles.submitBtn} btn btn-primary`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Review;
