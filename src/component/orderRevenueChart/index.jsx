import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OrderRevenueChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Giả lập dữ liệu đơn hàng theo tuần
        const fetchData = async () => {
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            const orders = [150, 200, 180, 220]; // Giả lập số lượng đơn hàng theo tuần
            const revenue = [4500, 6000, 5400, 6600]; // Giả lập doanh thu theo tuần

            setChartData({
                labels: weeks,
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: orders,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        yAxisID: 'y',
                    },
                    {
                        label: 'Revenue ($)',
                        data: revenue,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        yAxisID: 'y1',
                    },
                ],
            });
        };

        fetchData();
    }, []);

    if (!chartData) {
        return <p>Loading chart...</p>;
    }

    return (
        <div>
            <h4>Orders and Revenue by Week</h4>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Orders and Revenue by Week' },
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'Number of Orders' },
                        },
                        y1: {
                            type: 'linear',
                            position: 'right',
                            title: { display: true, text: 'Revenue ($)' },
                            grid: { drawOnChartArea: false },
                        },
                    },
                }}
            />
        </div>
    );
};

export default OrderRevenueChart;
