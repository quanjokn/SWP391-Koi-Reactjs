import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';
import Footer from '../../component/footer';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';

const ProfilePage = () => {
    const [containerStyle, setContainerStyle] = useState({});

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

    const [userProfile, setUserProfile] = useState({
        name: 'John Doe',
        phone: '123-456-7890',
        address: '123 Main St',
        email: 'johndoe@example.com',
        role: 'Customer',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile({ ...userProfile, [name]: value });
    };

    const handleSaveClick = () => {
        console.log('Saving profile:', userProfile);
        setIsEditing(false);
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
                                <a href="">Trang tài khoản</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Đơn hàng</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Tài khoản</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Auctions settings</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Thay đổi mật khẩu</a>
                            </li>
                            <li className={`${styles.listGroupItem} list-group-item`}>
                                <a href="">Thoát</a>
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
