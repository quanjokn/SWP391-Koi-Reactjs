import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Loading from "../loading";
import api from '../../config/axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlySalesPieChart = ({ month }) => {
    const [pieData, setPieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        const fetchPieData = async () => {
            setLoading(true);
            setNoData(false);

            try {
                const year = new Date().getFullYear();
                const response = await api.post('/dashBoard/productAndQuantiy', {
                    year,
                    month,
                });

                const salesData = response.data;

                // Kiểm tra dữ liệu trả về
                if (
                    !Array.isArray(salesData) ||
                    salesData.length === 0 ||
                    !salesData[0]?.productSalesDTOList ||
                    salesData[0].productSalesDTOList.length === 0
                ) {
                    setNoData(true);
                    setLoading(false); // Dừng loading khi không có dữ liệu
                    return;
                }

                const productSales = {};

                // Duyệt qua productSalesDTOList của từng tháng để cộng dồn số lượng sản phẩm
                salesData[0]?.productSalesDTOList.forEach(product => {
                    const { fishName, totalQuantity } = product;
                    productSales[fishName] = (productSales[fishName] || 0) + totalQuantity;
                });

                // Trích xuất label và data từ productSales
                const sortedProductSales = Object.entries(productSales)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([name, quantity]) => ({ name, quantity }));

                const labels = sortedProductSales.map(product => product.name);
                const data = sortedProductSales.map(product => product.quantity);

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
            } catch (error) {
                alert('Đã xảy ra lỗi khi tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        fetchPieData();
    }, [month]);

    if (loading) {
        return <Loading />;
    }

    if (noData) {
        return <p>Không có dữ liệu để hiển thị.</p>;
    }

    const totalQuantity = pieData.datasets[0].data.reduce((acc, val) => acc + val, 0);
    const percentages = pieData.datasets[0].data.map(value => ((value / totalQuantity) * 100).toFixed(2) + '%');

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const percentage = percentages[context.dataIndex] || '';
                        return `${label}: ${percentage}`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h4>Biểu đồ thể hiện sản phẩm trong tháng {month}</h4>
            <Pie data={pieData} options={options} />
        </div>
    );
};

export default MonthlySalesPieChart;
