import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';

const BlogDetail = () => {
    const { postId } = useParams(); // Lấy ID bài viết từ URL
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Đổi màu nền cho body khi vào trang chi tiết
        document.body.style.backgroundColor = "white";
        document.body.style.width = "1920px";

        // Hàm lấy chi tiết bài viết từ API dựa vào postId
        const loadPostContent = async (id) => {
            try {
                const response = await fetch(`http://localhost:8080/posts/${id}`);
                if (!response.ok) {
                    throw new Error('Bài viết không tồn tại.');
                }
                const data = await response.json();
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
            document.body.style.width = "";
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
                                    Đăng bởi {post.staff.name} ({post.staff.userName}) vào ngày {new Date(post.date).toLocaleDateString()}
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
                            <p>{post.description}</p>
                        </div>
                    </div>
                </div>
            </article>
            <Footer />
        </>
    );
};

export default BlogDetail;
