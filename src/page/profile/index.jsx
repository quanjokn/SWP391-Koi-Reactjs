import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import { UserContext } from '../../service/UserContext';
import api from '../../config/axios';
import NavigationList from '../../component/navigationList';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [containerStyle, setContainerStyle] = useState({});
    const { user, saveUser } = useContext(UserContext); // Lấy user từ context
    const [userProfile, setUserProfile] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        setContainerStyle({
            backgroundColor: '#470101',
            color: 'white',
            margin: '0 auto', // Canh giữa trang
        });
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
                point: user.point || '0'
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
            saveUser(response.data); // Chỉ lưu trữ thông tin người dùng từ response

            // Tắt chế độ chỉnh sửa
            setIsEditing(false);

            navigate('/tai-khoan');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const translateRole = (role, point) => {
        if (role === 'Customer' && point >= 200) {
            return 'Khách hàng thân thiết';
        }

        switch (role) {
            case 'Customer':
                return 'Khách Hàng';
            case 'Staff':
                return 'Nhân Viên';
            case 'Manager':
                return 'Quản Lý';
            default:
                return role;
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className={`${styles.container} px-4 px-lg-5`} style={containerStyle}>
                <div className="row">
                    <NavigationList />

                    <div className="col-md-9">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                                {userProfile.role === 'Customer' && (
                                    <div className={`${styles.pointsBadge} ms-3`}>
                                        Điểm tích lũy: {userProfile.point}
                                    </div>
                                )}
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
                                    <label className={styles.labels}>Vai trò</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.inputField}`}
                                        name="role"
                                        value={translateRole(userProfile.role, userProfile.point)}
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
                                            Huỷ
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleSaveClick}
                                        >
                                            Lưu
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Chỉnh sửa
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