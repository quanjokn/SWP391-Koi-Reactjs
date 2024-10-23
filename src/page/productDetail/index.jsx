import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./productDetail.module.css"; // Sử dụng CSS module
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';
import { UserContext } from '../../service/UserContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import api from "../../config/axios";
import { useNavigate } from 'react-router-dom';
import { CartContext } from "../../service/CartContext";


const ProductDetail = () => {
    const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const { user } = useContext(UserContext);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const navigate = useNavigate();
    const { fetchCart } = useContext(CartContext);

    useEffect(() => {
        // Fetch product details từ API dựa vào productId
        api.post(`/fish/fish-detail/${productId}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });
        // Fetch feedback for the product
        api.get(`/feedback/${productId}`)
            .then((response) => {
                setFeedbacks(response.data.evaluation);
            })
            .catch((error) => {
                console.error("Error fetching feedback:", error);
            });
    }, [productId]);

    if (!product) {
        return <p>No fish found</p>;
    }

    const handleAddToCart = (product) => {
        const userId = user ? user.id : null;
        if (!userId) {
            console.error("User not logged in!");
            return navigate('/login');
        }

        api.post(`/cart/addToCart/${userId}`, {
            fishId: product.id,
            quantity: 1
        })
            .then((response) => {
                setMessage('Thêm vào giỏ hàng thành công!');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
                // Cập nhật giỏ hàng
                fetchCart(); // Gọi lại để cập nhật giỏ hàng
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
    const images = [];
    if (product.photo) {
        images.push(product.photo.replace(/\\/g, "/"));
    }
    if (product.certificate) {
        images.push(product.certificate.replace(/\\/g, "/"));
    }

    // Tính giá khuyến mãi nếu có
    const promotionPrice = product.price * (1 - product.discount);

    return (
        <div className={styles["product-detail"]} >
            {/* Header */}
            <Header />
            <Tagbar />
            <Masthead title="Chi tiết sản phẩm" />
            {/* Product Section */}

            <main className={styles["product-section"]}>
                <h1 className={styles["title"]}>{product.name}</h1>
                <p className={styles["breadcrumb"]}>Trang chủ &gt; Danh sách sản phẩm &gt; {product.name}</p>
                <div className={styles["product-details"]} class="row">
                    <div class="col-md-9 row" >
                        {/* Swiper Gallery */}
                        <div class="col-md-5">
                            {images.length > 0 && (
                                <>
                                    <Swiper
                                        style={{
                                            '--swiper-navigation-color': '#fff',
                                            '--swiper-pagination-color': '#fff',
                                        }}
                                        spaceBetween={10}
                                        navigation={true}
                                        // thumbs={{ swiper: thumbsSwiper }}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                        modules={[Navigation, Thumbs]}
                                        className={styles['gallery-top']}
                                    >
                                        {images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    className={styles["product-image"]}
                                                    src={image}
                                                    alt={`Product Image ${index + 1}`}
                                                />
                                            </SwiperSlide>
                                        ))}

                                        {/* Hiển thị video nếu có */}
                                        {product.video && (
                                            <SwiperSlide>
                                                <div className={styles["video-container"]}>

                                                    <iframe
                                                        width="600"
                                                        height="400"
                                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.video)}`}
                                                        title={product.name}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </SwiperSlide>
                                        )}
                                    </Swiper>

                                    {/* Thumbnails */}
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        spaceBetween={10}
                                        slidesPerView={4}
                                        freeMode={true}
                                        watchSlidesProgress={true}
                                        modules={[Thumbs]}
                                        className={styles['gallery-thumbs']}
                                    >
                                        {images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    className={styles["thumb-image"]}
                                                    src={image}
                                                    alt={`Thumbnail ${index + 1}`}
                                                />
                                            </SwiperSlide>
                                        ))}
                                        {product.video && (
                                            <SwiperSlide>
                                                <img
                                                    className={styles["thumb-image"]}
                                                    src="https://img.icons8.com/ios-filled/50/000000/video.png"
                                                    alt="Video Thumbnail"
                                                />
                                            </SwiperSlide>
                                        )}
                                    </Swiper>
                                </>
                            )}
                        </div>

                        <div className={styles["product-info "]} class="col-md-7">
                            <p className={styles['price']}>Giá bán: {product.price} VND</p>
                            {product.discount > 0 && (
                                <p>Giá khuyến mãi: {promotionPrice.toFixed(2)} VND</p>
                            )}
                            <p>{product.description}</p>
                            <p>Chiều dài: {product.size}</p>
                            <p>Tuổi: {product.age}</p>
                            <p>Trạng thái sức khỏe: {product.healthStatus}</p>
                            <p>Giống cá: {product.category}</p>
                            <p>Số lượng đang bán: {product.quantity}</p>
                            <p>Nguồn gốc: {product.origin}</p>
                            <p>Tính cách: {product.character}</p>
                            <p>Khẩu phần ăn: {product.ration}</p>

                            <div className={styles["action-buttons"]}>
                                <button className={styles["add-to-cart"]}
                                    onClick={() => handleAddToCart(product)}>Thêm vào giỏ hàng</button>
                                <button className={styles["buy-now"]}>Đặt hàng</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">

                    </div>
                </div>

            </main >
            <div className={styles['feedback-section']}>
                <h3>Khách hàng đánh giá và nhận xét</h3>
                {feedbacks.length > 0 ? (
                    <div className={styles['feedback-list']}>
                        {feedbacks.map((feedback, index) => (
                            <div key={index} className={styles['feedback-item']}>
                                <img data-lazyloaded="1" data-placeholder-resp="30x30" src="https://secure.gravatar.com/avatar/f7e4c44b1063b3e3d19aef4d2e318a96?s=56&amp;d=mm&amp;r=g" alt="guest" data-src="https://secure.gravatar.com/avatar/f7e4c44b1063b3e3d19aef4d2e318a96?s=56&amp;d=mm&amp;r=g" data-srcset="https://secure.gravatar.com/avatar/f7e4c44b1063b3e3d19aef4d2e318a96?s=112&amp;d=mm&amp;r=g 2x" class="avatar avatar-56 photo entered litespeed-loaded" height="30" width="30" decoding="async" data-ll-status="loaded" srcset="https://secure.gravatar.com/avatar/f7e4c44b1063b3e3d19aef4d2e318a96?s=112&amp;d=mm&amp;r=g 2x"></img>
                                <strong>{feedback.userName}</strong>
                                <div className={styles['feedback-rating']}>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} className={i < feedback.rating ? styles['star-filled'] : styles['star-empty']}>★</span>
                                    ))}
                                </div>
                                <p>{feedback.feedback}</p>
                                <small> {new Date(feedback.date).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Chưa có đánh giá nào.</p>
                )}
            </div>

            {/* Footer */}
            <Footer />
            {
                showMessage && (
                    <div className={styles['message-popup']}>
                        {message}
                    </div>
                )
            }
        </div >
    );
};

export default ProductDetail;
