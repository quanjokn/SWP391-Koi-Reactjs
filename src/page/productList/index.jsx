import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import styles from "./productList.module.css";
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';



const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        import: false,
        vietnamese: false,
        f1: false
    });

    const [searchTerm, setSearchTerm] = useState(''); 
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get("http://localhost:8080/fish/fishes-list")
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked
        }));
    };

    const applyFilters = () => {
        let filtered = products;

        if (selectedFilters.import) {
            filtered = filtered.filter((product) => product.origin === "Thuần chủng nhập khẩu");
        }
        if (selectedFilters.vietnamese) {
            filtered = filtered.filter((product) => product.origin === "Thuần chủng Việt");
        }
        if (selectedFilters.f1) {
            filtered = filtered.filter((product) => product.origin === "Lai F1");
        }
        setFilteredProducts(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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

    const handleNavigateToDetail = (productId) => {
        navigate(`/fish-detail/${productId}`);
    };


    return (
        <>
            <Header />
            <Tagbar />
            <h2 className={styles['text-wrapper-93']}>Danh mục sản phẩm</h2>

            <div className={styles['product-list']}>
                
            <div className={styles['search-filter-container']}>
                    {/* Search bar */}
                    <input
                        type="text"
                        className={styles['search-bar']}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />

                    {/* Filter Section */}
                    <div className={styles['filter-container']}>
                        <h4>Bộ lọc:</h4>
                        <label>
                            <input
                                type="checkbox"
                                name="import"
                                checked={selectedFilters.import}
                                onChange={handleFilterChange}
                            />
                            Thuần chủng nhập khẩu
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="vietnamese"
                                checked={selectedFilters.vietnamese}
                                onChange={handleFilterChange}
                            />
                            Thuần Việt
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="f1"
                                checked={selectedFilters.f1}
                                onChange={handleFilterChange}
                            />
                            F1
                        </label>
                        <button className={styles['apply-filter-button']} onClick={applyFilters}>
                            Áp dụng
                        </button>
                    </div>
                </div>

                
                <div className={styles['products-container']}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className={styles['product-item']}>
                                <img src={product.photo.replace(/\\/g, "/")} alt={product.name} onClick={() => handleNavigateToDetail(product.id)}/>
                                <h3 onClick={() => handleNavigateToDetail(product.id)}>{product.name}</h3>
                                <p>Giới tính: {product.sex}</p>
                                <p>Kích thước: {product.size}</p>
                                <p>Giá: {product.price} VND</p>

                                <div className={styles['button-group']}>
                                    <button className={styles['compare-button']}>
                                        So sánh
                                        </button>
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

            <Footer />
            {showMessage && (
                <div className={styles['message-popup']}>
                    {message}
                </div>
            )}
        </>
    );
};

export default ProductList;
