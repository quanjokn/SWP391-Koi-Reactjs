import React, { useState, useEffect } from 'react';
import OrderRevenueChart from '../../component/orderRevenueChart/index';
import WeeklySalesPieChart from '../../component/weeklySalesPieChart/index';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import './dashboard.css';

const Dashboard = () => {
    // Khai báo state để lưu trữ dữ liệu từ API
    const [weeklyData, setWeeklyData] = useState({
        revenue: 0,
        sales: 0,
    });

    // Hàm lấy dữ liệu từ API
    useEffect(() => {
        const fetchWeeklyData = async () => {
            try {
                const response = await api.post('/dashBoard/orderAndRevenue', {
                    year: new Date().getFullYear(), // Lấy năm hiện tại
                    month: new Date().getMonth() + 1 // Lấy tháng hiện tại
                });

                // Tính tổng revenue và sales
                const totalRevenue = response.data.reduce((acc, item) => acc + item.totalRevenue, 0);
                const totalSales = response.data.reduce((acc, item) => acc + item.totalOrders, 0);

                // Cập nhật state với dữ liệu mới
                setWeeklyData({
                    revenue: totalRevenue,
                    sales: totalSales,
                });
            } catch (error) {
                console.error('Error fetching weekly data:', error);
            }
        };

        fetchWeeklyData();
    }, []);

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-4">
                <h1 className="text-center">Bảng điều khiển doanh nghiệp</h1>

                {/* Thẻ hiển thị dữ liệu tuần */}
                <div className="row mt-5">
                    <div className="col-md-6 mb-6">
                        <div className="info-box p-3">
                            <h4>Doanh thu tuần này</h4>
                            <p>${weeklyData.revenue.toLocaleString('vi-VN')} VND</p>
                        </div>
                    </div>

                    <div className="col-md-6 mb-6">
                        <div className="info-box p-3">
                            <h4>Doanh số tuần này</h4>
                            <p>{weeklyData.sales} đơn hàng</p>
                        </div>
                    </div>
                </div>

                {/* Biểu đồ doanh thu và bán hàng */}
                <div className="row mt-5">
                    <div className="col-md-8 mb-4">
                        <div className="chart-box p-3">
                            <OrderRevenueChart />
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="chart-box p-3">
                            <WeeklySalesPieChart />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
