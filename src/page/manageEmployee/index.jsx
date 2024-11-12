import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import styles from './manageEmployee.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ManageEmployee = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Customers');
    const navigate = useNavigate();
    const [newAccount, setNewAccount] = useState({
        id: 0,
        userName: '',
        role: 'Staff',
        name: '',
        phone: '',
        address: '',
        email: '',
        status: true,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/userManagement/allAccount');
                const allUsers = [...response.data.customers, ...response.data.staff];
                setUsers(allUsers);
                setFilteredUsers(allUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users
            .filter((user) => {
                if (activeTab === 'Staff/Manager') return user.role !== 'Customer';
                return user.role === 'Customer';
            })
            .filter((user) => {
                const userName = user.name || '';
                return userName.toLowerCase().includes(appliedSearchTerm.toLowerCase());
            });
        setFilteredUsers(filtered);
    }, [appliedSearchTerm, activeTab, users]);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            console.log(newAccount)
            const response = await api.post('/userManagement/createAccount', newAccount, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Create user successfully');
            const reload = await api.get('/userManagement/allAccount');
            const allUsers = [...reload.data.customers, ...reload.data.staff]; // Combine customers and staff again
            setUsers(allUsers);
            setFilteredUsers(allUsers);
            navigate('/nhan-vien');
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Tài khoản đã tồn tại !');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount((prevAccount) => ({
            ...prevAccount,
            [name]: name === 'status' ? value === 'true' : value,
        }));
    };

    const handleRemove = async (id) => {
        try {
            const response = await api.delete(`/userManagement/deleteUser/${id}`);
            if (response.status === 200) {
                alert('Delete user successfully');
                const updatedUsersResponse = await api.get('/userManagement/allAccount');
                const allUsers = [...updatedUsersResponse.data.customers, ...updatedUsersResponse.data.staff];                
                setUsers(allUsers);
                setFilteredUsers(allUsers);
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm);
    };



    const translate = (role) => {
        switch (role) {
            case 'Customer':
                return 'Khách hàng';
            case 'Staff':
                return 'Nhân viên';
            case 'Manager':
                return 'Quản lý';
            default:
                return role;
        }
    };


    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Quản lý người dùng</h1>

                {/* Tab Navigation */}
                <div className={styles.tabContainer}>
                    <button
                        className={activeTab === 'Customers' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('Customers')}
                    >
                        Khách hàng
                    </button>
                    <button
                        className={activeTab === 'Staff/Manager' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('Staff/Manager')}
                    >
                        Nhân viên/Quản lý
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'Staff/Manager' && (
                    <>
                        {/* Search */}
                        <div className={styles["search-filter-container2"]}>
                            <div className={styles["search-container2"]}>
                                <label>
                                    Tìm kiếm theo tên:
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </label>
                                <button className={styles['search']} onClick={handleSearch}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tài khoản</th>
                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.userName}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{translate(user.role)}</td>
                                            <td>
                                                {user.status === true ? <div className={styles["online-icon"]}></div> : <div className={styles["offline-icon"]}></div>}
                                            </td>
                                            <td>
                                                <button className={styles["btn"]} onClick={() => handleRemove(user.id)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Create New Account Form */}
                        <form className={styles["form-create-account"]} onSubmit={handleCreateAccount}>
                            <h2>Tạo tài khoản</h2>
                            <label>
                                Tài khoản:
                                <input
                                    type="text"
                                    name="userName"
                                    value={newAccount.userName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Vai trò:
                                <select
                                    name="role"
                                    value={newAccount.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </label>
                            <br />
                            <label>
                                Tên:
                                <input
                                    type="text"
                                    name="name"
                                    value={newAccount.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Số điện thoại:
                                <input
                                    type="text"
                                    name="phone"
                                    value={newAccount.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Địa chỉ:
                                <input
                                    type="text"
                                    name="address"
                                    value={newAccount.address}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={newAccount.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br />
                            <div className={styles["create"]}>
                                <button className={styles["btn-create"]} type="submit">Tạo</button>
                            </div>
                        </form>
                    </>
                )}

                {/* Customers Tab */}
                {activeTab === 'Customers' && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tài khoản</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{translate(user.role)}</td>
                                        <td >
                                            {user.status === true ? <div className={styles["online-icon"]}></div> : <div className={styles["offline-icon"]}></div>}
                                        </td>
                                        <td>
                                            <button className={styles["btn"]} onClick={() => handleRemove(user.id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No customers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ManageEmployee;
