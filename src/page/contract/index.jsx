import React, { useEffect } from 'react';
import styles from './contract.module.css';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';

const Contract = () => {
    useEffect(() => {

        // Thêm width: 1920px cho body
        document.body.style.width = "1920px";
        document.body.style.backgroundColor = "white"; // Màu nền cho trang blog

        return () => {
            // Khôi phục lại giá trị mặc định khi rời khỏi trang
            document.body.style.width = "";
            document.body.style.backgroundColor = "";
        };
    }, []);

    return (
        <>
            <Header />
            <Tagbar />
            <header className={`${styles.masthead}`} style={{ backgroundImage: "url('/imagines/background/KoiFish.jpg')" }}>
                <div className="container position-relative px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-7">
                            <div className={`${styles.siteHeading}`}>
                                <h1>Liên hệ</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="mb-4">
                <div className="container px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-7">
                            <div className={styles.contactInfo}>
                                <h2>Công ty TNHH Koi Farm Shop</h2>
                                <p><strong>Địa chỉ:</strong> Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000, Vietnam</p>
                                <p><strong>Website:</strong> <a href="https://hello-beta-bice.vercel.app/" target="_blank" rel="noopener noreferrer">KoiFarmShop.app</a></p>
                                <p><strong>Hotline:</strong> 012.345.6789 (+84 23456789)</p>
                                <p><strong>Email:</strong>Koifarmshop@gmail.com</p>
                                <p><strong>Mail:</strong>info@Koifarmshop.vn</p>
                            </div>

                            {/* Google Map nhúng bằng iframe */}
                            <div className={styles.mapContainer}>
                                <h3>Vị trí của chúng tôi trên bản đồ:</h3>
                                <div className={styles.mapResponsive}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100108979795!2d106.80501208522817!3d10.841127561752332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1727262607369!5m2!1sen!2s"
                                        width="600"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Contract;
