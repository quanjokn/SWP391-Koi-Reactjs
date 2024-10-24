import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../service/UserContext';
import Header from '../../component/header/index';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import styles from './manageFeedback.module.css';
import Loading from '../../component/loading';

const ManageFeedback = () => {
    const { user } = useContext(UserContext);
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [feedbackPerPage] = useState(5); // Số phản hồi mỗi trang

    const fetchFeedback = async () => {
        try {
            const response = await api.get('/ratingFeedbackController/getList');
            const feedbackData = response.data.map(fb => ({
                images: fb.images,
                fishName: fb.fishName,
                userName: fb.userName,
                feedback: fb.feedback,
                orderId: fb.orderId,
                fishId: fb.fishId,
                rating: fb.rating
            }));
            setFeedback(feedbackData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [user]);

    const handleAccept = (fishId, orderId) => {
        try {
            const approval = '1';
            api.post(`/ratingFeedbackController/approval/${orderId}/${fishId}/${approval}`, []);
            fetchFeedback();
        } catch (error) {
            alert('Lỗi khi duyệt phản hồi này!');
        }
    };

    const handleReject = (fishId, orderId) => {
        try {
            const approval = '0';
            api.post(`/ratingFeedbackController/approval/${orderId}/${fishId}/${approval}`, []);
            fetchFeedback();
        } catch (error) {
            alert('Lỗi khi duyệt phản hồi này!');
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    // Tính toán chỉ số cho trang hiện tại
    const indexOfLastFeedback = currentPage * feedbackPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
    const currentFeedback = feedback.slice(indexOfFirstFeedback, indexOfLastFeedback);

    // Tạo danh sách số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(feedback.length / feedbackPerPage); i++) {
        pageNumbers.push(i);
    }

    // Hàm thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Danh sách phản hồi từ khách hàng</h1>

                {/* Kiểm tra xem có phản hồi hay không */}
                {feedback.length === 0 ? (
                    <div className={styles.noFeedbackMessage}>
                        Hiện tại không có phản hồi nào từ khách hàng cần duyệt.
                    </div>
                ) : (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.textLeft}>Sản phẩm</th>
                                    <th className={styles.textLeft}>Khách hàng</th>
                                    <th className={styles.textLeft}>Phản hồi</th>
                                    <th className={styles.textCenter}>Duyệt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFeedback.map((item, index) => (
                                    <tr key={index} className={styles.row}>
                                        <td className={styles.textLeft}>
                                            <img
                                                src={item.images}
                                                alt={item.fishName}
                                                className={styles.fishImage}
                                            />
                                            <span>{item.fishName}</span>
                                        </td>
                                        <td className={styles.textLeft}>{item.userName}</td>
                                        <td className={styles.textLeft}>
                                            <strong>Rating:</strong> {item.rating}/5<br />
                                            <strong>Feedback:</strong> {item.feedback}
                                        </td>
                                        <td className={styles.textCenter}>
                                            <button
                                                className={styles.button1}
                                                onClick={() => handleAccept(item.fishId, item.orderId)}
                                            >
                                                Chấp nhận
                                            </button>
                                            <button
                                                className={styles.button2}
                                                onClick={() => handleReject(item.fishId, item.orderId)}
                                            >
                                                Từ chối
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Hiển thị nút phân trang */}
                        {feedback.length > 0 && (
                            <nav>
                                <ul className="pagination justify-content-center">
                                    {pageNumbers.map(number => (
                                        <li
                                            key={number}
                                            className={`page-item ${number === currentPage ? 'active' : ''}`}
                                        >
                                            <button
                                                onClick={() => paginate(number)}
                                                className="page-link"
                                            >
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ManageFeedback;
