import React, { useState } from 'react';
import Footer from '../../component/footer';
import Tagbar from '../../component/tagbar';
import Header from '../../component/header';
import Masthead from '../../component/masthead';
import styles from './home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const products = [
        {
            id: 1,
            name: 'Sản phẩm 1',
            price: '100.000đ',
            image: '/imagines/products/asagi-koi-1.png',
            description: 'Đây là sản phẩm chất lượng cao, phù hợp với mọi người.',
            rating: 4.5,
        },
        {
            id: 2,
            name: 'Sản phẩm 2',
            price: '200.000đ',
            image: '/imagines/products/asagi-koi-1.png',
            description: 'Sản phẩm này có nhiều tính năng và công dụng tuyệt vời.',
            rating: 4.2,
        },
        {
            id: 3,
            name: 'Sản phẩm 3',
            price: '300.000đ',
            image: '/imagines/products/asagi-koi-1.png',
            description: 'Một lựa chọn hoàn hảo cho những ai yêu thích cá Koi.',
            rating: 4.8,
        },
        {
            id: 4,
            name: 'Sản phẩm 4',
            price: '400.000đ',
            image: '/imagines/products/asagi-koi-1.png',
            description: 'Đây là sản phẩm được ưa chuộng nhất trong cửa hàng.',
            rating: 5.0,
        },
        {
            id: 5,
            name: 'Sản phẩm 5',
            price: '500.000đ',
            image: '/imagines/products/asagi-koi-1.png',
            description: 'Sản phẩm mới nhất của chúng tôi.',
            rating: 4.0,
        },
    ];

    const [startIndex, setStartIndex] = useState(0);
    const [fade, setFade] = useState(false);

    const nextProduct = () => {
        setFade(true);
        setTimeout(() => {
            setStartIndex((prevIndex) => (prevIndex + 1) % (products.length - 3)); // Chỉ số tối đa cho startIndex
            setFade(false);
        }, 500); // Thời gian trễ tương ứng với thời gian animation
    };

    const prevProduct = () => {
        setFade(true);
        setTimeout(() => {
            setStartIndex((prevIndex) => (prevIndex - 1 + (products.length - 3)) % (products.length - 3));
            setFade(false);
        }, 500); // Thời gian trễ tương ứng với thời gian animation
    };


    return (
        <div className={styles.container}>
            <Header />
            <Tagbar />
            <Masthead title="Koi Farm Shop" />
            <div className={`${styles.fullHeight}`}>
                <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-md-8">
                        <h3 className={styles.contentText} style={{ fontFamily: 'Kadwa' }}>Nhà cung cấp cá Koi uy tín nhất Việt Nam</h3>
                        <p className={styles.contentText}>
                            KoiFarmShop được thành lập với mục tiêu mang đến những sản phẩm và dịch vụ chất lượng trong lĩnh vực nuôi dưỡng và chăm sóc cá Koi.
                            Chúng tôi chuyên cung cấp cá Koi Nhật Bản chính hãng, thiết kế và thi công hồ cá Koi, cùng các giải pháp tối ưu về thiết bị và vật tư cho hồ cá.
                            Với kinh nghiệm nhiều năm, KoiFarmShop tự hào đã và đang đồng hành cùng những người yêu thích cá Koi, lan tỏa niềm đam mê này đến khắp mọi nơi.
                        </p>
                        <button className={styles.button} onClick={() => navigate('/gioi-thieu')}>Xem thêm</button>
                    </div>
                    <div className="col-md-4">
                        <img src="/imagines/background/koi-background-3-1.png" alt="background content" className={styles.infoImage} />
                    </div>
                </div>
            </div>
            <div className={styles.deliveryService}>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <img className={styles.directionsBus} alt="Directions bus" src="/imagines/icon/directions-bus-1.svg" />
                        <p className={styles.textWrapperTitle}>Giao nhận hàng mọi nơi</p>
                        <div className={styles.overlap19}>
                            <p className={styles.textWrapperText}>
                                Dịch vụ mua bán và ký gửi của chúng tôi có mặt tại 63 tỉnh thành khắp Việt Nam, với cam kết vận chuyển
                                nhanh, an toàn và hiệu quả.
                            </p>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <img className={styles.check} alt="Check" src="/imagines/icon/check-1.svg" />
                        <p className={styles.textWrapperTitle}>Dịch vụ ký gửi uy tín</p>
                        <div className={styles.overlap}>
                            <p className={styles.textWrapperText}>
                                Dịch vụ mua bán và ký gửi của chúng tôi có mặt tại 63 tỉnh thành khắp Việt Nam, với cam kết vận chuyển
                                nhanh, an toàn và hiệu quả.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <img className={styles.check} alt="Commit" src="/imagines/icon/star-filled-1.svg" />
                        <div className={styles.textWrapperTitle}>Cam kết phục vụ</div>
                        <div className={styles.overlap}>
                            <p className={styles.textWrapperText}>
                                Đội ngũ dày dạn của chúng tôi, với kiến thức và kinh nghiệm trong lĩnh vực kinh doanh cá Koi, sẵn sàng cung
                                cấp cho quý khách sự phục vụ tận tâm và uy tín.
                            </p>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <img className={styles.check} alt="High quality" src="/imagines/icon/archive-1.svg" />
                        <p className={styles.textWrapperTitle}>Sản phẩm chất lượng cao</p>
                        <div className={styles.overlap}>
                            <p className={styles.textWrapperText}>
                                Tất cả các sản phẩm của chúng tôi bảo đảm các tiêu chuẩn nuôi và chăm sóc từ các nhà buôn với kinh nghiệm nuôi
                                trồng lâu năm, với sản phẩm đạt các chứng chỉ chất lượng cao nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.productList}>
                <button onClick={prevProduct} className={styles.navButton}>←</button>
                <div className={`${styles.productGroup} ${fade ? styles.fadeOut : styles.fadeIn}`}>
                    {products.slice(startIndex, startIndex + 4).map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            <img src={product.image} alt={product.name} />
                            <h2>{product.name}</h2>
                            <p>{product.price}</p>
                            <div className={styles.descriptionBox}>
                                <p>{product.description}</p>
                            </div>
                            <button>Mua ngay</button>
                            <div className={styles.ratingRow}>
                                <span>{product.rating.toFixed(1)}</span>
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 45 45"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.starIcon}
                                >
                                    <path d="M10.9219 41.25L13.9688 28.0781L3.75 19.2188L17.25 18.0469L22.5 5.625L27.75 18.0469L41.25 19.2188L31.0312 28.0781L34.0781 41.25L22.5 34.2656L10.9219 41.25Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={nextProduct} className={styles.navButton}>→</button>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
