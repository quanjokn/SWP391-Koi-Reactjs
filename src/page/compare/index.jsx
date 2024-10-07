
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';
import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./compare.module.css";

const ComparePage = () => {
    const location = useLocation();
    const productsToCompare = location.state?.productsToCompare || [];
    if (productsToCompare.length === 0) {
        return <p>Không có sản phẩm nào để so sánh.</p>;
    }
    return (
        
        <div>
            <Header/>
            <Tagbar/>
            <h1>So sánh sản phẩm</h1>
            <div className={styles['compare-container']} class="row">
                {productsToCompare.map((product, index) => (
                    <div key={index} className={styles['compare-item']}>
                        <h2>{product.name}</h2>
                        <img src={product.photo} alt={product.name} />
                        <p>Giá: {product.price}</p>
                        <p>Kích thước: {product.size}</p>
                        <p>Giới tính: {product.sex}</p>
                        <p>Mô tả{product.description}</p>
                        <p>Tuổi: {product.age}</p>
                        <p>Trạng thái sức khỏe: {product.healthStatus}</p>
                        <p>Giống cá: {product.category}</p>
                        <p>Số lượng đang bán: {product.quantity}</p>
                        <p>Nguồn gốc: {product.origin}</p>
                        <p>Tính cách: {product.character}</p>
                        <p>Khẩu phần ăn: {product.ration}</p>
                        {/* Thêm các thông tin khác bạn muốn so sánh */}
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default ComparePage;
