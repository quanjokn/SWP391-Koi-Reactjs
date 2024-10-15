import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../service/UserContext";
import Loading from "../loading";

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <Loading />;  // Hiển thị khi đang tải thông tin người dùng
    }

    if (!user) {
        return <Navigate to="/login" />;  // Chuyển hướng nếu không có người dùng
    }

    if (requiredRole && user.role !== requiredRole) {
        // Nếu vai trò không khớp, chuyển hướng về trang chủ hoặc trang phù hợp
        return <Navigate to="/" />;
    }

    return children;  // Nếu vai trò khớp, hiển thị nội dung
};

export default PrivateRoute;
