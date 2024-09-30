import React from "react";
import styles from "./productDetail.module.css"; // Sử dụng CSS module
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';

const ProductDetail = () => {
    return (
        <div className={styles["product-detail"]}>
            {/* Header */}
            <Header />
            <Tagbar />
            {/* Product Section */}
            <main className={styles["product-section"]}>
                <h2>Chi tiết sản phẩm - Cá Koi #043</h2>
                <p className={styles["breadcrumb"]}>Trang chủ &gt; Danh sách sản phẩm &gt; Cá Koi #043</p>
                <div className={styles["product-details"]}>
                    <img className={styles["product-image"]} alt="Koi Tancho Kohaku" src="/imagines/KoiFish.jpg" />
                    <div className={styles["product-info"]}>
                        <p>
                            Em koi Tancho Kohaku có kích thước 84 cm, 4 năm tuổi, nguồn gốc từ Dainichi koi farm Nhật Bản. Hình thể đẹp, màu sắc rõ nét, body rắn chắc.
                        </p>
                        <p>Giá bán: Liên hệ để thỏa thuận giá</p>
                        <p>Chiều dài: 84cm</p>
                        <p>Tuổi: 4 năm</p>
                        <p>Trạng thái sức khỏe: Khỏe mạnh</p>
                        <p>Giống cá: Kohaku</p>
                        <p>Số lượng đang bán: 20</p>
                        <div className={styles["action-buttons"]}>
                            <button className={styles["add-to-cart"]}>Thêm vào giỏ hàng</button>
                            <button className={styles["buy-now"]}>Đặt hàng</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProductDetail;
