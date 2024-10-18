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
        console.log('Blog created:', response.data);
    } catch (error) {
        console.error('Error creating blog:', error);
    }
};

const deleteBlog = async (blogID) => {
    try {
        await api.delete(`/blogManagement/delete/${blogID}`);
        console.log('Blog deleted successfully');
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
        console.log('Blog updated:', response.data);
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
    const [formData, setFormData] = useState({
        id: 0,
        title: '',
        description: '',
        title_1: '',
        content_1: '',
        title_2: '',
        content_2: '',
        staff: id,
        date: ''
    });

    // Fetch all blogs on load
    useEffect(() => {
        const fetchBlogs = async () => {
            const blogsData = await getAllBlogs();
            setBlogs(blogsData);
        };
        fetchBlogs();
    }, []);

    const handleCreate = async () => {
        await createBlog(formData);
        const updatedBlogs = await getAllBlogs();
        setBlogs(updatedBlogs);
    };

    const handleDelete = async (id) => {
        await deleteBlog(id);
        const updatedBlogs = await getAllBlogs();
        setBlogs(updatedBlogs);
    };

    const handleUpdate = async () => {
        await updateBlog(selectedBlog);
        const updatedBlogs = await getAllBlogs();
        setBlogs(updatedBlogs);
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

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container">
                <h1>Blog Management</h1>
                {/* Create Blog */}
                <div className="form-group">
                    <h2>Create Blog</h2>
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
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <div className="button-group">
                        <button onClick={handleCreate}>Create</button>
                    </div>
                </div>

                {/* Edit Blog */}
                {selectedBlog && (
                    <div className="form-group">
                        <h2>Edit Blog</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        <div className="button-group">
                            <button onClick={handleUpdate}>Update</button>
                        </div>
                    </div>
                )}

                {/* Blog List */}
                <div className="blog-list">
                    <h2>Blogs List</h2>
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog.id} className="blog-item">
                                <h3>{blog.title}</h3>
                                <p>{blog.content}</p>
                                <div className="button-group">
                                    <button onClick={() => handleEdit(blog.id)}>Edit</button>
                                    <button onClick={() => handleDelete(blog.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No blogs available</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default BlogManager;
