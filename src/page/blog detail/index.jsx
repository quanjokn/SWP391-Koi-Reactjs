import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './detail.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import api from '../../config/axios';

const BlogDetail = () => {
    const { postId } = useParams(); // Lấy ID bài viết từ URL
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Đổi màu nền cho body khi vào trang chi tiết
        document.body.style.backgroundColor = "white";

        // Hàm lấy chi tiết bài viết từ API dựa vào postId
        const loadPostContent = async (id) => {
            try {
                const response = await api.get(`/posts/${id}`); // Sử dụng 'api' đã cấu hình

                // Kiểm tra nếu phản hồi không hợp lệ
                if (response.status !== 200) {
                    throw new Error('Bài viết không tồn tại.');
                }

                const data = response.data; // Lấy dữ liệu từ phản hồi
                console.log("Dữ liệu bài viết:", data); // Kiểm tra dữ liệu trả về
                setPost(data); // Lưu nội dung bài viết vào state
            } catch (error) {
                console.error('Lỗi khi tải nội dung bài viết:', error);
                setError('Đã xảy ra lỗi khi tải nội dung bài viết.');
            }
        };


        // Gọi hàm để tải nội dung bài viết khi component được mount
        if (postId) {
            loadPostContent(postId);
        }

        return () => {
            // Khôi phục màu nền khi rời khỏi trang chi tiết
            document.body.style.backgroundColor = "";
        };
    }, [postId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>Đang tải nội dung bài viết...</p>;
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
                                <h1>{post.title}</h1>
                                <span className={`${styles.meta}`}>
                                    Đăng bởi {post.staff?.name || "Không rõ"} ({post.staff?.userName || "Không rõ"}) vào ngày {new Date(post.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <article className="mb-4">
                <div className="container px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-7">
                            <h2>{post.description}</h2>
                            {/* Hiển thị title_1 và content_1 */}
                            {post.title_1 && <h3>{post.title_1}</h3>}
                            {post.content_1 && <p>{post.content_1}</p>}

                            {/* Hiển thị title_2 và content_2 */}
                            {post.title_2 && <h3>{post.title_2}</h3>}
                            {post.content_2 && <p>{post.content_2}</p>}
                        </div>
                    </div>
                </div>
            </article>
            <Footer />
        </>
    );
};

export default BlogDetail;
