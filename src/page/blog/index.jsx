import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import styles from './blog.module.css';
import Footer from '../../component/footer';
import Tagbar from '../../component/tagbar';
import Header from '../../component/header';
import Masthead from '../../component/masthead';

const Blog = () => {
    const [posts, setPosts] = useState([]); // Khởi tạo state để lưu dữ liệu từ API
    const [visiblePosts, setVisiblePosts] = useState(4); // Số lượng bài viết hiển thị ban đầu
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu

    useEffect(() => {
        // Gọi API để lấy dữ liệu
        api.get('/posts')  // Sử dụng 'api' đã được cấu hình
            .then(response => {
                // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    // Sắp xếp bài viết theo ngày giảm dần (mới nhất lên đầu)
                    const sortedPosts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setPosts(sortedPosts); // Lưu dữ liệu bài viết đã sắp xếp vào state
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
                setLoading(false); // Kết thúc trạng thái tải dữ liệu
            })
            .catch(error => {
                console.error("Lỗi khi tải dữ liệu:", error);
                setLoading(false);
            });

        document.body.style.backgroundColor = "white"; // Màu nền cho trang blog

        return () => {
            // Khôi phục lại giá trị mặc định khi rời khỏi trang
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
            <Masthead title="Tin tức" />
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
