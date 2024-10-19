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
                        <input
                            type="number"
                            id="rating"
                            value={rating}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 1 && value <= 5) {
                                    setRating(value);
                                }
                            }}
                            min="1"
                            max="5"
                            required
                            className={styles.ratingInput}
                            style={{ textAlign: 'center' }} // Căn giữa nội dung
                        />
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
