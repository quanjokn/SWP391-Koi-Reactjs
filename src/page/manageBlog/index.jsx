import React, { useState, useEffect, useContext } from 'react';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import api from '../../config/axios';
import { UserContext } from '../../service/UserContext';
import './manageBlog.css';

// API calls
const createBlog = async (blog) => {
    try {
        const response = await api.post('/blogManagement/create', blog);
    } catch (error) {
        console.error('Error creating blog:', error);
    }
};

const deleteBlog = async (blogID) => {
    try {
        await api.delete(`/blogManagement/delete/${blogID}`);
    } catch (error) {
        console.error('Error deleting blog:', error);
    }
};

const getBlogDetails = async (blogID) => {
    try {
        const response = await api.get(`/blogManagement/detail/${blogID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blog details:', error);
    }
};

const updateBlog = async (blog) => {
    try {
        const response = await api.post('/blogManagement/update', blog);
    } catch (error) {
        console.error('Error updating blog:', error);
    }
};

const getAllBlogs = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
};

// Blog Manager Component
function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const { user } = useContext(UserContext);
    const id = user.id;
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 5;

    // Lấy ngày hiện tại dưới dạng chuỗi 'YYYY-MM-DD'
    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng 0-indexed nên cần +1
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [formData, setFormData] = useState({
        id: 0,
        title: '',
        description: '',
        title_1: '',
        content_1: '',
        title_2: '',
        content_2: '',
        staff: { id: id },
        date: getCurrentDate() // Mặc định là ngày hiện tại
    });

    // State để lưu thông báo lỗi
    const [error, setError] = useState('');

    // Fetch all blogs on load
    useEffect(() => {
        const fetchBlogs = async () => {
            const blogsData = await getAllBlogs();

            const sortedBlogs = blogsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBlogs(sortedBlogs);
        };
        fetchBlogs();
    }, []);

    // Kiểm tra dữ liệu hợp lệ
    const validateForm = () => {
        if (!formData.title || !formData.description || !formData.title_1 || !formData.content_1 || !formData.title_2 || !formData.content_2) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc.');
            return false;
        }
        setError('');
        return true;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;  // Dừng nếu form không hợp lệ
        await createBlog(formData);
        const updatedBlogs = await getAllBlogs();
        setBlogs(updatedBlogs);
        resetForm();
    };

    const handleDelete = async (id) => {
        await deleteBlog(id);
        const updatedBlogs = await getAllBlogs();
        setBlogs(updatedBlogs);
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;  // Dừng nếu form không hợp lệ
        try {
            await updateBlog(formData);
            const updatedBlogs = await getAllBlogs();
            setBlogs(updatedBlogs);
            resetForm();
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    const handleEdit = async (id) => {
        const blog = await getBlogDetails(id);
        setSelectedBlog(blog);
        setFormData({
            id: blog.id,
            title: blog.title,
            description: blog.description,
            title_1: blog.title_1,
            content_1: blog.content_1,
            title_2: blog.title_2,
            content_2: blog.content_2,
            staff: blog.staff,
            date: blog.date
        });
    };

    const resetForm = () => {
        setSelectedBlog(null);
        setFormData({
            id: 0,
            title: '',
            description: '',
            title_1: '',
            content_1: '',
            title_2: '',
            content_2: '',
            staff: { id: id },
            date: getCurrentDate()
        });
        setError('');
    };

    // Tính toán các blog cần hiển thị dựa trên trang hiện tại
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Tính tổng số trang
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    // Hàm phân trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container">
                <h2>Quản lý tin tức</h2>

                {/* Pagination */}
                {blogs.length > 0 && (
                    <nav>
                        <ul className="pagination justify-content-center">
                            {[...Array(totalPages).keys()].map(number => (
                                <li
                                    key={number + 1}
                                    className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}
                                >
                                    <button
                                        onClick={() => paginate(number + 1)}
                                        className="page-link"
                                    >
                                        {number + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* Blog List */}
                <div className="blog-list">
                    {currentBlogs.length > 0 ? (
                        currentBlogs.map((blog) => (
                            <div key={blog.id} className="blog-item">
                                <h3>{blog.title}</h3>
                                <p>{blog.content}</p>
                                <p><strong>Ngày đăng:</strong> {blog.date}</p>
                                <div className="button-group">
                                    <button className="btn btn-secondary" onClick={() => handleEdit(blog.id)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(blog.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No blogs available</p>
                    )}
                </div>

                {/* Create or Update Blog */}
                <div className="form-group">
                    <h2>{selectedBlog ? 'Chỉnh sửa tin tức' : 'Tạo tin tức'}</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Hiển thị lỗi nếu có */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Title 1"
                        value={formData.title_1}
                        onChange={(e) => setFormData({ ...formData, title_1: e.target.value })}
                    />
                    <textarea
                        placeholder="Content 1"
                        value={formData.content_1}
                        onChange={(e) => setFormData({ ...formData, content_1: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Title 2"
                        value={formData.title_2}
                        onChange={(e) => setFormData({ ...formData, title_2: e.target.value })}
                    />
                    <textarea
                        placeholder="Content 2"
                        value={formData.content_2}
                        onChange={(e) => setFormData({ ...formData, content_2: e.target.value })}
                    />
                    <input
                        type="date"
                        value={formData.date}
                        max={getCurrentDate()} // Chặn chọn ngày vượt quá ngày hiện tại
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <div className="button-group">
                        {selectedBlog ? (
                            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleCreate}>Create</button>
                        )}
                        <button className="btn btn-secondary" onClick={resetForm}>Reset</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default BlogManager;
