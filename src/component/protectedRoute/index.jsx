import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../service/UserContext';
import Loading from '../loading';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <Loading />

    if (!user) {
        // Nếu không có người dùng, chuyển hướng đến trang đăng nhập
        return <Navigate to="/login" />;
    }

    // Nếu có người dùng, hiển thị nội dung của trang
    return children;
};

export default ProtectedRoute;
