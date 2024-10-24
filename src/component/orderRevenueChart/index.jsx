import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../config/axios'; // Đảm bảo rằng bạn có axios đã được cấu hình

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OrderRevenueChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.post('/dashBoard/orderAndRevenue', {
                    year: new Date().getFullYear(), // Lấy năm hiện tại
                    month: new Date().getMonth() + 1 // Lấy tháng hiện tại (tháng 0-11)
                });
                // Kiểm tra nếu không có dữ liệu cho tháng hiện tại
                if (response.data.length === 0) {
                    // Nếu không có dữ liệu, có thể thêm dữ liệu mặc định hoặc thông báo
                    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                    const orders = [0, 0, 0, 0]; // Giả sử không có đơn hàng nào
                    const revenue = [0, 0, 0, 0]; // Giả sử không có doanh thu

                    setChartData({
                        labels: weeks,
                        datasets: [
                            {
                                label: 'Số lượng đơn hàng',
                                data: orders,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                yAxisID: 'y',
                            },
                            {
                                label: 'Lợi nhuận (VND)',
                                data: revenue,
                                borderColor: 'rgba(153, 102, 255, 1)',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                yAxisID: 'y1',
                            },
                        ],
                    });
                } else {
                    // Dữ liệu hợp lệ, xử lý dữ liệu như trước
                    const weeks = response.data.map(item => `Tuần ${item.weekofMonth}`);
                    const orders = response.data.map(item => item.totalOrders);
                    const revenue = response.data.map(item => item.totalRevenue);

                    setChartData({
                        labels: weeks,
                        datasets: [
                            {
                                label: 'Số lượng đơn hàng',
                                data: orders,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                yAxisID: 'y',
                            },
                            {
                                label: 'Lợi nhuận (VND)',
                                data: revenue,
                                borderColor: 'rgba(153, 102, 255, 1)',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                yAxisID: 'y1',
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching order revenue data:', error);
            }
        };

        fetchData();
    }, []);

    if (!chartData) {
        return <p>Loading chart...</p>;
    }

    return (
        <div>
            <h4>Số lượng đơn hàng và lợi nhuận trong tháng</h4>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Đơn hàng and lợi nhuận theo tuần' },
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'Số lượng đơn hàng' },
                            ticks: {
                                // Chỉ hiển thị số nguyên
                                callback: function (value) {
                                    return Number.isInteger(value) ? value : '';
                                },
                            },
                        },
                        y1: {
                            type: 'linear',
                            position: 'right',
                            title: { display: true, text: 'Lợi nhuận (VND)' },
                            grid: { drawOnChartArea: false },
                        },
                    },
                }}
            />
        </div>
    );
};

export default OrderRevenueChart;
