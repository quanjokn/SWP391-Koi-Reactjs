import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../config/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OrderRevenueChart = ({ month }) => { // Nhận props month từ Dashboard
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        setChartData(null);

        const fetchData = async () => {
            try {
                const response = await api.post('/dashBoard/orderAndRevenue', {
                    year: new Date().getFullYear(),
                    month: month
                });

                if (response.data.ordersRevenueList.length === 0) {
                    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                    const orders = [0, 0, 0, 0];
                    const revenue = [0, 0, 0, 0];

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
                    const weeks = response.data.ordersRevenueList.map(item =>
                        `Tuần ${item.weekofMonth}`
                    );
                    const orders = response.data.ordersRevenueList.map(item => item.totalOrders);
                    const revenue = response.data.ordersRevenueList.map(item => item.totalRevenueOfWeek);

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
                setChartData(null);
            }
        };

        fetchData();
    }, [month]); // Thêm month vào dependency để biểu đồ cập nhật khi tháng thay đổi

    if (!chartData) {
        return <p>Không có dữ liệu hiển thị</p>;
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
                        title: { display: true, text: 'Đơn hàng và lợi nhuận theo tuần' },
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'Số lượng đơn hàng' },
                            ticks: {
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
