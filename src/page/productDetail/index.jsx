import React, { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./productDetail.module.css"; // Sử dụng CSS module
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';
import { UserContext } from '../../service/UserContext';
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
    const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [userRating, setUserRating] = useState(0); // Default rating state
    const [userComment, setUserComment] = useState(''); // User comment state
    const { user } = useContext(UserContext);


    useEffect(() => {
        // Fetch product details từ API dựa vào productId
        axios.get(`http://localhost:8080/fish/fish-detail/${productId}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });
        // Fetch feedback for the product
        axios.get(`http://localhost:8080/api/feedback/${productId}`)
            .then((response) => {
                setFeedbacks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching feedback:", error);
            });
    }, [productId]);

    if (!product) {
        return <p>No fish found</p>;
    }

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const feedbackData = {
            productId: product.id,
            userEmail: 'user@example.com', // Change this to dynamic user email
            rating: userRating,
            comment: userComment,
        };

        axios.post('http://localhost:8080/api/feedback', feedbackData)
            .then((response) => {
                setFeedbacks([...feedbacks, response.data]); // Add the new feedback to the state
                setUserRating(0); // Reset rating
                setUserComment(''); // Reset comment
            })
            .catch((error) => {
                console.error("Error submitting feedback!", error);
            });
    };


    const handleAddToCart = (product) => {
        const userId = user ? user.id : null;   
        if (!userId) {
            console.error("User not logged in!");           
            return ;
        }

        axios.post(`http://localhost:8080/cart/addToCart/${userId}`, {
            fishId: product.id,
            quantity: 1
        })
            .then((response) => {
                setMessage('Thêm vào giỏ hàng thành công!');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
            })
            .catch((error) => {
                console.error("Error adding product to cart!", error);
            });
    };

    const getYouTubeVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
        const matches = url.match(regex);
        return matches ? matches[1] : null;
    };

    // Tính giá khuyến mãi nếu có
    const promotionPrice = product.price * (1 - product.discount);

    return (
        <div className={styles["product-detail"]}>
            {/* Header */}
            <Header />
            <Tagbar />
            <Masthead title="Chi tiết sản phẩm" />
            {/* Product Section */}
            <main className={styles["product-section"]}>
                <h2>Chi tiết sản phẩm - {product.name}</h2>
                <p className={styles["breadcrumb"]}>Trang chủ &gt; Danh sách sản phẩm &gt; {product.name}</p>
                <div className={styles["product-details"]}>
                    <img className={styles["product-image"]} alt={product.name} src={product.photo.replace(/\\/g, "/")} />
                    <div className={styles["product-info"]}>
                        <p>{product.description}</p>
                        <p>Giá bán: {product.price} VND</p>
                        {product.discount > 0 && (
                            <p>Giá khuyến mãi: {promotionPrice.toFixed(2)} VND</p>
                        )}
                        <p>Chiều dài: {product.size}</p>
                        <p>Tuổi: {product.age}</p>
                        <p>Trạng thái sức khỏe: {product.healthStatus}</p>
                        <p>Giống cá: {product.category}</p>
                        <p>Số lượng đang bán: {product.quantity}</p>
                        <p>Nguồn gốc: {product.origin}</p>
                        <p>Tính cách: {product.character}</p>
                        <p>Khẩu phần ăn: {product.ration}</p>
                        <img className={styles["product-image"]} src={product.certificate.replace(/\\/g, "/")} alt="Giấy chứng nhận" />
                        {product.video && (
                            <div className={styles["video-container"]}>
                                <h3>Xem Video</h3>
                                <iframe
                                    width="600"
                                    height="400"
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.video)}`} // Giải mã ID video
                                    title={product.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <div className={styles["action-buttons"]}>
                            <button className={styles["add-to-cart"]}
                                onClick={() => handleAddToCart(product)}>Thêm vào giỏ hàng</button>
                            <button className={styles["buy-now"]}>Đặt hàng</button>
                        </div>
                    </div>
                </div>
                <div className={styles['feedback-section']}>
                    <h3>Khách hàng đánh giá và nhận xét</h3>
                    {feedbacks.length > 0 ? (
                        <div className={styles['feedback-list']}>
                            {feedbacks.map((feedback, index) => (
                                <div key={index} className={styles['feedback-item']}>
                                    <div className={styles['feedback-rating']}>
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <span key={i} className={i < feedback.rating ? styles['star-filled'] : styles['star-empty']}>★</span>
                                        ))}
                                    </div>
                                    <p>{feedback.comment}</p>
                                    <small>{feedback.userEmail} - {new Date(feedback.created_at).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Chưa có đánh giá nào.</p>
                    )}

                    <h4>Để lại bình luận</h4>
                    <form onSubmit={handleFeedbackSubmit}>
                        <div className={styles['rating-input']}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} onClick={() => setUserRating(star)} className={userRating >= star ? styles['star-filled'] : styles['star-empty']}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder="Leave your comment"
                            minLength={15}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>

            </main>

            {/* Footer */}
            <Footer />
            {showMessage && (
                <div className={styles['message-popup']}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
