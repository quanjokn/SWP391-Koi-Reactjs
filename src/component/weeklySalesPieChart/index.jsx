import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklySalesPieChart = () => {
    const [pieData, setPieData] = useState(null);

    useEffect(() => {
        // Giả lập dữ liệu phần trăm sản phẩm bán được
        const fetchPieData = async () => {
            const data = [30, 20, 25, 25]; // Giả lập phần trăm sản phẩm bán được
            const labels = ['Product A', 'Product B', 'Product C', 'Product D'];

            setPieData({
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                    },
                ],
            });
        };

        fetchPieData();
    }, []);

    if (!pieData) {
        return <p>Loading chart...</p>;
    }

    return (
        <div>
            <h4>Weekly Sales Distribution</h4>
            <Pie data={pieData} />
        </div>
    );
};

export default WeeklySalesPieChart;
