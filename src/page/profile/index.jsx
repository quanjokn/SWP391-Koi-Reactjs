import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import api from '../../config/axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [containerStyle, setContainerStyle] = useState({});
    const { user, saveUser, logout } = useContext(UserContext); // Lấy user từ context
    const [userProfile, setUserProfile] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        document.body.style.backgroundColor = "white"; // Background màu trắng
        setContainerStyle({
            backgroundColor: '#470101',
            color: 'white',
            margin: '0 auto', // Canh giữa trang
        });
        return () => {
            // Reset lại body khi rời khỏi trang
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        // Nếu có dữ liệu user từ UserContext, cập nhật userProfile
        if (user) {
            setUserProfile({
                id: user.id || '',
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                email: user.email || '',
                role: user.role || '', // Giá trị mặc định là ''
            });
        }
    }, [user]); // Chạy lại khi giá trị user thay đổi

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile({ ...userProfile, [name]: value });
    };

    const handleSaveClick = async () => {
        // Chỉ lấy các trường cần thiết để cập nhật
        const { id, name, phone, address, email } = userProfile;
        const updatedData = { name, phone, address, email };
        try {
            // Gọi API để cập nhật thông tin người dùng
            const response = await api.post(`/user/updateUser/${userProfile.id}`, updatedData);

            // Sử dụng saveUser để cập nhật thông tin người dùng
            saveUser(response.data);

            // Tắt chế độ chỉnh sửa
            setIsEditing(false);

            navigate('/tai-khoan');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleLogout = () => {
        logout(); // Gọi hàm logout
        navigate('/'); // Chuyển hướng về trang chủ
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={`${styles.container} px-4 px-lg-5`} style={containerStyle}>
                <div className="row">
                    <div className="col-md-3">
                        <ul className={`${styles.listGroup} list-group`}>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/">Trang chủ</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Đơn hàng</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/tai-khoan">Trang tài khoản</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Auctions settings</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Thay đổi mật khẩu</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="/" onClick={handleLogout}>
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-9">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className={styles.labels}>Tên</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.inputField}`}
                                        name="name"
                                        value={userProfile.name}
                                        onChange={isEditing ? handleInputChange : null}
                                        readOnly={!isEditing}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.labels}>Role</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.inputField}`}
                                        name="role"
                                        value={userProfile.role}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.labels}>Địa chỉ nhà</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.inputField}`}
                                        name="address"
                                        value={userProfile.address}
                                        onChange={isEditing ? handleInputChange : null}
                                        readOnly={!isEditing}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.labels}>Số điện thoại</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.inputField}`}
                                        name="phone"
                                        value={userProfile.phone}
                                        onChange={isEditing ? handleInputChange : null}
                                        readOnly={!isEditing}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.labels}>Địa chỉ email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${styles.inputField}`}
                                        name="email"
                                        value={userProfile.email}
                                        onChange={isEditing ? handleInputChange : null}
                                        readOnly={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="mt-5 text-center">
                                {isEditing ? (
                                    <>
                                        <button
                                            className="btn btn-secondary me-2"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleSaveClick}
                                        >
                                            Save Profile
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
