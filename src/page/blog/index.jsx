import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './blog.module.css';
import Footer from '../../component/footer';
import Tagbar from '../../component/tagbar';
import Header from '../../component/header';

const Blog = () => {
    const [posts, setPosts] = useState([]); // Khởi tạo state để lưu dữ liệu từ API
    const [visiblePosts, setVisiblePosts] = useState(4); // Số lượng bài viết hiển thị ban đầu
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu

    useEffect(() => {
        // Gọi API để lấy dữ liệu
        axios.get('http://localhost:8080/posts')
            .then(response => {
                // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setPosts(response.data); // Lưu dữ liệu bài viết vào state
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
                setLoading(false); // Kết thúc trạng thái tải dữ liệu
            })
            .catch(error => {
                console.error("Lỗi khi tải dữ liệu:", error);
                setLoading(false);
            });

        // Thêm width: 1920px cho body
        document.body.style.width = "1920px";
        document.body.style.backgroundColor = "white"; // Màu nền cho trang blog

        return () => {
            // Khôi phục lại giá trị mặc định khi rời khỏi trang
            document.body.style.width = "";
            document.body.style.backgroundColor = "";
        };
    }, []);

    // Hàm để hiển thị thêm 4 bài viết
    const showMorePosts = () => {
        setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 4);
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <header className={`${styles.masthead}`} style={{ backgroundImage: "url('/imagines/background/KoiFish.jpg')" }}>
                <div className="container position-relative px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-7">
                            <div className={`${styles.siteHeading}`}>
                                <h1>Tin tức</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className={styles.container + " px-4 px-lg-5"}>
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        {posts.length > 0 && posts.slice(0, visiblePosts).map((post) => (
                            <div className={styles.postPreview} key={post.id}>
                                <a href={`/post/${post.id}`}>
                                    <h2 className={styles.postTitle}>
                                        {post.title}
                                    </h2>
                                    <h3 className={styles.postSubtitle}>
                                        {post.description.slice(0, 100)}...
                                    </h3>
                                </a>
                                <p className={styles.postMeta}>
                                    Đăng bởi {post.staffid} vào ngày {new Date(post.date).toLocaleDateString()}
                                </p>
                                <hr className="my-4" />
                            </div>
                        ))}

                        {/* Hiển thị nút "Xem thêm" hoặc thông báo khi hết bài */}
                        {visiblePosts < posts.length ? (
                            <div className="d-flex justify-content-end mb-4">
                                <button className="btn btn-primary text-uppercase" onClick={showMorePosts}>
                                    Xem thêm →
                                </button>
                            </div>
                        ) : (
                            <p className="text-center">Đã hết bài viết.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blog;
