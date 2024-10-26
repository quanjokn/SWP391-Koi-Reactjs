import React, { useState, useEffect, useContext } from "react";
import api from "../../config/axios";
import styles from "./productList.module.css";
import Header from "../../component/header";
import Footer from "../../component/footer";
import Tagbar from '../../component/tagbar';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';
import Masthead from "../../component/masthead";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from "../../service/CartContext";


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const { user } = useContext(UserContext);
    const [compareList, setCompareList] = useState([]);
    const [showCompareBox, setShowCompareBox] = useState(false);

    const { fetchCart } = useContext(CartContext);

    useEffect(() => {
        api.get('/fish/fishes-list')
            .then((response) => {
                setProducts(response.data.fishDetailDTOList);
                setFilteredProducts(response.data.fishDetailDTOList);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    const handleAddToCompare = (product) => {
        // Thêm sản phẩm vào danh sách so sánh
        setCompareList((prevList) => {
            if (prevList.length < 2 && !prevList.some(p => p.id === product.id)) {
                return [...prevList, product];
            }
            return prevList;
        });
        setShowCompareBox(true); // Hiển thị box so sánh
    };
    const handleRemoveCompare = (productId) => {
        // Xóa sản phẩm khỏi danh sách so sánh
        setCompareList((prevList) => prevList.filter(product => product.id !== productId));
        if (compareList.length == 0) {
            setShowCompareBox(false);
        }
    };

    const handleCloseCompareBox = () => {
        // Ẩn box so sánh
        setShowCompareBox(false);
    };

    const navigateToComparePage = () => {
        if (compareList.length === 2) {
            navigate('/compare', { state: { productsToCompare: compareList } });
        }
    };
    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    useEffect(() => {
        let filtered = products;
        if (selectedFilter === "import") {
            filtered = products.filter(product => product.origin === "Thuần chủng nhập khẩu");
        } else if (selectedFilter === "vietnamese") {
            filtered = products.filter(product => product.origin === "Thuần chủng Việt");
        } else if (selectedFilter === "f1") {
            filtered = products.filter(product => product.origin === "Lai F1");
        }
        setFilteredProducts(filtered);
    }, [selectedFilter, products]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSearchClick = () => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

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

    const handleNavigateToDetail = (productId) => {
        navigate(`/fish-detail/${productId}`);
    };


    return (
        <>
            <Header />
            <Tagbar />

            <Masthead title={"Danh mục sản phẩm"} />
            <div className={styles['search-filter-container']}>
                {/* Search Section */}

            <div className={`${styles.masthead}`} style={{ backgroundImage: "url('/imagines/background/promotion.jpg')" }}>
                <div className="container position-relative px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-7">
                            <div className={`${styles.siteHeading}`}>
                                <h2>Chương trình khuyến mãi cho khách hàng thân thiết giảm 10%</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Search Section */}

            <div className={styles['search-container']}>
                <input
                    type="text"
                    className={styles['search-bar']}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearchChange}  // Cập nhật từ khóa tìm kiếm khi người dùng nhập
                />
                <button className={styles['search-button']} onClick={handleSearchClick}>
                    <FontAwesomeIcon icon={faSearch} />  {/* Nút search icon */}
                </button>
            </div>
            {/* Bộ lọc */}
            <div className={styles['filter-container']}>
                <h4>Bộ lọc:</h4>
                <select value={selectedFilter} onChange={handleFilterChange}>
                    <option value="">Tất cả sản phẩm</option>
                    <option value="import">Thuần chủng nhập khẩu</option>
                    <option value="vietnamese">Thuần Việt</option>
                    <option value="f1">Lai F1</option>
                </select>
            </div>
            </div>
            


            <div className={styles['product-list']}>
                <div className={styles['products-container']}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className={styles['product-item']}>
                                <img src={product.photo.replace(/\\/g, "/")} alt={product.name} onClick={() => handleNavigateToDetail(product.id)} />
                                <h3 onClick={() => handleNavigateToDetail(product.id)}>{product.name}</h3>
                                <p>Giới tính: {product.sex}</p>
                                <p>Kích thước: {product.size}</p>
                                <p>Giá: {product.price} VND</p>

                                <div className={styles['button-group']}>
                                    <button className={styles['compare-button']} onClick={() => handleAddToCompare(product)}>
                                        <i class="fa-solid fa-plus"></i> {/* Icon So sánh */}
                                    </button>
                                    <button className={styles['add-to-cart-button']} onClick={() => handleAddToCart(product)}>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có sản phẩm nào.</p>
                    )}
                </div>
            </div>
            {/* Box so sánh */}
            {showCompareBox && (
                <div className={styles['compare-box']}>
                    <div className={styles['compare-box-header']}>
                        <h4>So sánh sản phẩm</h4>
                        <button onClick={handleCloseCompareBox}>
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className={styles['compare-box-body']}>
                        {compareList.map((product) => (
                            <div key={product.id} className={`${styles.producToCompare}`}>
                                <img src={product.photo.replace(/\\/g, "/")} alt={product.name} />
                                <p>{product.name}</p>
                                <button onClick={() => handleRemoveCompare(product.id)}>Xóa</button>
                            </div>
                        ))}
                        {compareList.length === 2 && (
                            <button onClick={navigateToComparePage}>
                                So sánh
                            </button>
                        )}
                    </div>
                </div>
            )}



            <Footer />
            {
                showMessage && (
                    <div className={styles['message-popup']}>
                        {message}
                    </div>
                )
            }
        </>
    );
};

export default ProductList;