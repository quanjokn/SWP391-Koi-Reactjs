import React, { useState, useEffect } from "react";
import api from "../../config/axios";
import styles from "./productList.module.css";
import Header from "../../component/header";  // Reused Header from Blog
import Footer from "../../component/footer";  // Reused Footer from Blog
import Tagbar from '../../component/tagbar';  // Added Tagbar from Blog
import Masthead from "../../component/masthead";
import { useNavigate } from 'react-router-dom';  // Sử dụng useNavigate cho điều hướng

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();  // useNavigate để điều hướng

    useEffect(() => {
        api.get("/fish/fishes-list")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    const handleAddToCart = (product) => {
        // Gửi yêu cầu thêm sản phẩm vào giỏ hàng đến backend
        const userId = 1
        api.post(`/cart/addToCart/${userId}`, {
            fishId: product.id,
            quantity: 1  // Giả sử thêm 1 sản phẩm vào giỏ hàng
        })
            .then((response) => {
                console.log("Product added to cart:", response.data);
                // Điều hướng đến trang giỏ hàng sau khi thêm thành công
                navigate('/cart');
            })
            .catch((error) => {
                console.error("Error adding product to cart:", error);
            });
    };

    return (
        <>
            <Header />     {/* Included Header */}
            <Tagbar />     {/* Included Tagbar */}
            <Masthead title="Danh mục sản phẩm" />
            <div className={styles['product-list']}>
                <div className={styles['products-container']}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className={styles['product-item']}>
                                <img src={product.photo.replace(/\\/g, "/")} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>Giới tính: {product.gender}</p>
                                <p>Kích thước: {product.size}</p>
                                <p>Giá: {product.price} VND</p>

                                <div className={styles['button-group']}>
                                    <button className={styles['order-button']}>Đặt hàng</button>
                                    <button
                                        className={styles['add-to-cart-button']}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có sản phẩm nào.</p>
                    )}
                </div>
            </div>

            <Footer />  {/* Included Footer */}
        </>
    );
};

export default ProductList;
