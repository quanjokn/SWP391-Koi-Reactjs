import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import { UserContext } from '../../service/UserContext';
import './staffHome.module.css';

const AdminDashboard = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            navigate('/');
        }

        if (user && (user.role !== 'Manager' && user.role !== 'Staff')) {
            navigate('/');
        }

    }, [user, isLoading, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h1>Welcome to Admin Dashboard</h1>
                <p>Hello, {user?.name} ({user?.role})</p>

                {user?.role === 'Manager' && (
                    <div>
                        <h2>Manager Tools</h2>
                        <ul>
                            <li><a href="/order-management">Manage Orders</a></li>
                            <li><a href="/staff-management">Manage Staff</a></li>
                        </ul>
                    </div>
                )}

                {user?.role === 'Staff' && (
                    <div>
                        <h2>Staff Tools</h2>
                        <ul>
                            <li><a href="/inventory">Manage Inventory</a></li>
                            <li><a href="/customer-support">Customer Support</a></li>
                        </ul>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;