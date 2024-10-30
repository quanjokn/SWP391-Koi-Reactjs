import React, { useState, useEffect } from 'react';
import OrderRevenueChart from '../../component/orderRevenueChart/index';
import WeeklySalesPieChart from '../../component/weeklySalesPieChart/index';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import * as XLSX from 'xlsx';
import './dashboard.css';

const Dashboard = () => {
    const [monthlyData, setMonthlyData] = useState({ revenue: 0, sales: 0 });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    // Hàm lấy dữ liệu từ API
    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const response = await api.post('/dashBoard/orderAndRevenue', {
                    year: new Date().getFullYear(),
                    month: selectedMonth
                });

                // tổng doanh thu và doanh số cho tháng
                const totalRevenue = response.data.allRevenueOfMonth;

                const totalSales = response.data.ordersRevenueList.reduce((acc, item) => {
                    return acc + item.totalOrders;
                }, 0);

                // Cập nhật dữ liệu hàng tháng
                setMonthlyData({ revenue: totalRevenue, sales: totalSales });
            } catch (error) {
                console.error('Error fetching monthly data:', error);
            }
        };

        fetchMonthlyData();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value, 10));
    };

    // Hàm xuất dữ liệu ra file Excel
    const exportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('vi-VN');
        const formattedTime = now.toLocaleTimeString('vi-VN');

        const data = [
            {
                'Tháng': selectedMonth, // Lưu theo tháng
                'Ngày': formattedDate,
                'Thời gian': formattedTime,
                'Doanh thu tháng': monthlyData.revenue,
                'Doanh số tháng': monthlyData.sales
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Data'); // Đổi tên sheet
        const fileName = `Dashboard_Monthly_Data_Thang_${selectedMonth}_${formattedDate.replace(/\//g, '-')}_${formattedTime.replace(/:/g, '-')}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-4">
                <h1 className="text-center">Bảng kinh doanh doanh nghiệp</h1>

                {/* Chọn tháng */}
                <div className="text-center mt-4">
                    <label htmlFor="month-select">Chọn tháng: </label>
                    <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                        ))}
                    </select>
                </div>

                <div className="row mt-5">
                    <div className="col-md-6 mb-6">
                        <div className="info-box p-3">
                            <h4>Doanh thu tháng {selectedMonth}</h4>
                            <p>{monthlyData.revenue.toLocaleString('vi-VN')} VND</p>
                        </div>
                    </div>

                    <div className="col-md-6 mb-6">
                        <div className="info-box p-3">
                            <h4>Doanh số tháng {selectedMonth}</h4> {/* Cập nhật hiển thị */}
                            <p>{monthlyData.sales} đơn hàng</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button onClick={exportToExcel} className="btn btn-success">Xuất Excel</button>
                </div>

                <div className="row mt-5">
                    <div className="col-md-8 mb-4">
                        <div className="chart-box p-3">
                            <OrderRevenueChart month={selectedMonth} />
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="chart-box p-3">
                            <WeeklySalesPieChart month={selectedMonth} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
