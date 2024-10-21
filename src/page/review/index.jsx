import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import styles from './review.module.css';

const Review = () => {
    const { orderId, fishId } = useParams(); // Lấy orderId và fishId từ URL
    const [fishDetail, setFishDetail] = useState(null); // Dữ liệu chi tiết về cá
    const [feedback, setFeedback] = useState(''); // Dữ liệu feedback
    const [rating, setRating] = useState(0); // Dữ liệu rating
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái submit
    const navigate = useNavigate(); // Điều hướng

    // Lấy thông tin chi tiết của cá từ backend
    useEffect(() => {
        const fetchFishDetail = async () => {
            try {
                const response = await api.get(`/feedback/${fishId}`); // Gọi API lấy chi tiết cá
                setFishDetail(response.data); // Lưu dữ liệu chi tiết của cá
            } catch (error) {
                console.error('Error fetching fish detail:', error);
            }
        };

        fetchFishDetail();
    }, [fishId]);

    // Xử lý submit form feedback
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra nếu feedback và rating chưa được nhập
        if (!feedback.trim() || rating === 0) {
            alert('Vui lòng nhập phản hồi và chọn đánh giá!');
            return; // Dừng lại nếu không hợp lệ
        }

        setIsSubmitting(true);

        try {
            // Gửi yêu cầu POST để lưu feedback
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

    // Xử lý chọn rating
    const handleClick = (value) => {
        setRating(value);
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.reviewContainer}>
                {fishDetail ? (
                    <div className={styles.fishDetail}>
                        <h2 className={styles.title}>{fishDetail.name}</h2>
                        <div className="container my-4">
                            <div className="row">
                                <div className="col-md-4 d-flex align-items-center justify-content-center">
                                    <img
                                        src={fishDetail.photo}
                                        alt={fishDetail.name}
                                        className={`img-fluid rounded ${styles.fishImage}`}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className={`card ${styles.cardReview}`}>
                                        <div className="card-body">
                                            <p className="card-text"><strong>Tuổi:</strong> {fishDetail.age}</p>
                                            <p className="card-text"><strong>Kích thước:</strong> {fishDetail.size}</p>
                                            <p className="card-text"><strong>Giới tính:</strong> {fishDetail.sex}</p>
                                            <p className="card-text"><strong>Xuất xứ:</strong> {fishDetail.origin}</p>
                                            <p className="card-text"><strong>Giá:</strong> {fishDetail.price.toLocaleString('vi-VN')} VND</p>
                                            <p className="card-text"><strong>Tình trạng sức khỏe:</strong> {fishDetail.healthStatus}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3>Viết đánh giá của bạn</h3>
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
                ) : (
                    <p>Đang tải thông tin cá...</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Review;
