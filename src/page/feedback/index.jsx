import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import styles from './feedback.module.css';
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';

const FeedbackPage = () => {
    const { orderId, fishId } = useParams(); // Get the orderId and fishId from URL parameters
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [product, setProduct] = useState(null); // State to hold product information

    // Fetch the product information based on fishId
    useEffect(() => {
        api.get(`/product/${fishId}`) // Adjust API call as needed
            .then((response) => {
                setProduct(response.data); // Set the product data
            })
            .catch((error) => {
                console.error("Error fetching product information:", error);
            });
    }, [fishId]);
    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmitFeedback = () => {
        if (!feedback || rating === 0) {
            alert("Vui lòng cung cấp đánh giá và xếp hạng.");
            return;
        }

        setIsSubmitting(true);

        // Send feedback to the API
        api.post(`/feedback/${orderId}/${fishId}`, {
            feedback: feedback,
            rating: rating,
        })
            .then((response) => {
                alert("Cảm ơn bạn đã đánh giá!");
                navigate(`/order-history`); // Redirect to order history after feedback
            })
            .catch((error) => {
                console.error("Error submitting feedback:", error);
                alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles["feedback-container"]}>
                <h2 className={styles["feedback-title"]}>Đánh giá sản phẩm</h2>
                {/* Product Display Section */}
                {product && (
                    <div className={styles["product-section"]}>
                        <img
                            src={product.imageUrl} // Assuming the product has an image URL
                            alt={product.name}
                            className={styles["product-image"]}
                        />
                        <p className={styles["product-name"]}>{product.name}</p>
                    </div>
                )}  
                <div className={styles["feedback-form-group"]}>
                    <label className={styles["feedback-label"]}>Đánh giá của bạn</label>
                    <textarea
                        value={feedback}
                        onChange={handleFeedbackChange}
                        placeholder="Nhập đánh giá của bạn tại đây..."
                        className={styles["feedback-textarea"]}
                        rows="4"
                    />
                </div>

                <div className={styles["feedback-form-group"]}>
                    <label className={styles["feedback-label"]}>Chất lượng sản phẩm</label>
                    <div className={styles["rating-container"]}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRatingChange(star)}
                                className={`${styles.star} ${rating >= star ? styles.active : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmitFeedback}
                    className={styles["submit-button"]}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </div>
            <Footer />
        </>

    );
};

export default FeedbackPage;
