import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./productDetail.module.css"; // Sử dụng CSS module
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';

const ProductDetail = () => {
    const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);


    const [message, setMessage] = useState([]);
    const [showMessage, setShowMessage] = useState([]);

    useEffect(() => {
        // Fetch product details từ API dựa vào productId
        axios.get(`http://localhost:8080/fish/fish-detail/${productId}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });
    }, [productId]);

    if (!product) {
        return <p>No fish found</p>;
    }

    const handleAddToCart = (product) => {
        const userId = 1;
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
