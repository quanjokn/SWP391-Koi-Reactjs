import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import styles from './manageEmployee.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ManageEmployee = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState(''); 
    const [activeTab, setActiveTab] = useState('Customers'); 
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

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/userManagement/createAccount', newAccount, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Create user successfully');
            const updatedUsers = [...users, response.data];
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers); 
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount((prevAccount) => ({
            ...prevAccount,
            [name]: name === 'status' ? value === 'true' : value,
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
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
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

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                    <h1>Manage Users</h1> 

                {/* Tab Navigation */}
                <div className={styles.tabContainer}>
                    <button
                        className={activeTab === 'Customers' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('Customers')}
                    >
                        Customers
                    </button>
                    <button
                        className={activeTab === 'Staff/Manager' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('Staff/Manager')}
                    >
                        Staff/Manager
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'Staff/Manager' && (
                    <>
                        {/* Search */}
                        <div className={styles["search-filter-container2"]}>
                            <div className={styles["search-container2"]}>
                                <label>
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
                        </div>

                        {/* Table */}
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
                                        <td colSpan="9">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Create New Account Form */}
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
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
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
                    </>
                )}

                {/* Customers Tab */}
                {activeTab === 'Customers' && (                    
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
                                            <button className={styles["btn"]} onClick={() => handleRemove(user.id)}>Remove</button>
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
