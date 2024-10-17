import React from 'react';
import { useEffect, useState } from 'react';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import styles from './manageEmployee.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ManageEmployee = () => {
    // Dummy data for employees
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState(''); // Search sẽ chỉ áp dụng sau khi nhấn icon
    const [appliedFilterRole, setAppliedFilterRole] = useState('All'); // Role sẽ chỉ áp dụng sau khi nhấn nút "Áp dụng"

    const [newAccount, setNewAccount] = useState({
        id: 0,
        userName: '',
        role: '',
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
                const allUsers = [...response.data.customers, ...response.data.staff]; // Gộp cả customers và staff
                setUsers(allUsers); // Cập nhật state với danh sách tất cả user
                setFilteredUsers(allUsers); // Hiển thị tất cả user lúc đầu
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        fetchUsers();
    }, []);

    // Xử lý tạo tài khoản mới
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        console.log('New Account:', newAccount);
        try {
            const response = await api.post('/userManagement/createAccount', newAccount, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Account created:', response.data);
            const updatedUsers = [...users, response.data]; // Cập nhật danh sách người dùng sau khi thêm mới
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers); // Cập nhật danh sách đã filter
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    // Xử lý thay đổi trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // setNewAccount({ ...newAccount, [name]: value });
        setNewAccount((prevAccount) => ({
            ...prevAccount,
            [name]: name === 'status' ? value === 'true' : value, // Chuyển đổi status sang boolean
        }));
    };

    const handleEdit = (id) => {
        console.log(`Edit employee with ID: ${id}`);
    };

    const handleRemove = async (id) => {
        try {
            const response = await api.delete(`/userManagement/deleteUser/${id}`);
            if (response.status === 200) {
                alert('Delete user successfully');
                // Cập nhật danh sách người dùng sau khi xóa
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Lọc users theo role và search term áp dụng
    useEffect(() => {
        const filtered = users
            .filter((user) => {
                if (appliedFilterRole === 'All') return true;
                return user.role === appliedFilterRole;
            })
            .filter((user) => {
                const userName = user.name || ''; // Đặt giá trị mặc định là chuỗi rỗng
                const searchTerm = appliedSearchTerm || ''; // Đặt giá trị mặc định là chuỗi rỗng
                return userName.toLowerCase().includes(searchTerm.toLowerCase());
            });
        setFilteredUsers(filtered);
    }, [appliedFilterRole, appliedSearchTerm, users]);


    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm); // Lưu search term đã nhập để áp dụng tìm kiếm
    };

    // Filter khi nhấn nút "Áp dụng"
    const handleApplyFilter = () => {
        setAppliedFilterRole(filterRole); // Lưu filter role đã chọn để áp dụng lọc
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div>
                <div className={styles.container}>
                    <h1>Manage Employees</h1>

                    {/* Filter role và search */}
                    <div className={styles["search-filter-container2"]}>
                        <div className={styles["search-container2"]}>
                            <label >
                                Search by Name:
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

                        <div className={styles["filter-container2"]}>
                            <label>
                                Filter by Role:
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Customer">Customer</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </label>
                            <button className={styles['ap-dung']} onClick={handleApplyFilter}>Áp dụng</button>
                        </div>
                    </div>

                    {/* Bảng hiển thị danh sách người dùng */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Edit</th>
                                <th>Remove</th>
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
                                        <td>{user.role}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            <button className={styles["btn"]} onClick={() => handleEdit(user.id)}>Edit</button>
                                        </td>
                                        <td>
                                            <button className={styles["btn"]} onClick={() => handleRemove(user.id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Form để tạo tài khoản mới */}
                    <form className={styles["form-create-account"]} onSubmit={handleCreateAccount}>
                        <h2>Create New Account</h2>
                        <label>
                            User Name:
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
                            Role:
                            <select
                                name="role"
                                value={newAccount.role}
                                onChange={handleInputChange}
                            >
                                <option value="Customer">Customer</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Full Name:
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
                            Phone:
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
                            Address:
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
                        <label>
                            Status:
                            <select
                                name="status"
                                value={newAccount.status}
                                onChange={(e) =>
                                    setNewAccount({ ...newAccount, status: e.target.value === 'true' })
                                }
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </label>
                        <br />
                        <button className={styles["btn-create"]} type="submit">Create Account</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>

    );
};

export default ManageEmployee;