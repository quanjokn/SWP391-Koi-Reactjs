import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../config/axios'; // Đảm bảo rằng bạn đã cấu hình axios

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklySalesPieChart = () => {
    const [pieData, setPieData] = useState(null);

    useEffect(() => {
        const fetchPieData = async () => {
            try {
                const year = new Date().getFullYear(); // Lấy năm hiện tại
                const month = new Date().getMonth() + 1; // Lấy tháng hiện tại (tháng 0-11)

                // Gửi yêu cầu đến API để lấy dữ liệu doanh số
                const response = await api.post('/dashBoard/productAndQuantiy', {
                    year,
                    month,
                });

                const salesData = response.data; // Dữ liệu trả về từ API
                console.log(response.data);
                // Tạo một đối tượng để lưu trữ tổng số lượng sản phẩm đã bán
                const productSales = {};

                // Duyệt qua từng tuần trong dữ liệu
                salesData.forEach(week => {
                    week.productSalesDTOList.forEach(product => {
                        const { fishName, totalQuantity } = product; // Thay đổi từ productName và quantity thành fishName và totalQuantity

                        // Cộng dồn số lượng sản phẩm đã bán
                        if (productSales[fishName]) {
                            productSales[fishName] += totalQuantity;
                        } else {
                            productSales[fishName] = totalQuantity;
                        }
                    });
                });

                // Trích xuất label và data từ productSales
                const sortedProductSales = Object.entries(productSales)
                    .sort(([, a], [, b]) => b - a) // Sắp xếp giảm dần theo số lượng
                    .map(([name, quantity]) => ({ name, quantity })); // Chuyển đổi về dạng đối tượng

                const topProducts = sortedProductSales.slice(0, 3); // Lấy 3 sản phẩm hàng đầu

                // Tạo labels và data cho biểu đồ
                const labels = topProducts.map(product => product.name);
                const data = topProducts.map(product => product.quantity);

                // Chỉ thêm 'Others' nếu có 4 sản phẩm khác nhau
                if (sortedProductSales.length > 3) {
                    const otherProductsQuantity = sortedProductSales.slice(3).reduce((acc, { quantity }) => acc + quantity, 0); // Tính tổng số lượng cho nhóm còn lại
                    labels.push('Others');
                    data.push(otherProductsQuantity);
                }
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
                console.error('Error fetching weekly sales data:', error);
            }
        };

        fetchPieData();
    }, []);

    if (!pieData) {
        return <p>Loading chart...</p>;
    }

    // Tính toán phần trăm cho mỗi mục
    const totalQuantity = pieData.datasets[0].data.reduce((acc, val) => acc + val, 0);
    const percentages = pieData.datasets[0].data.map(value => ((value / totalQuantity) * 100).toFixed(2) + '%');

    // Tùy chỉnh tooltip để hiển thị phần trăm
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
            <h4>Biểu đồ thể hiện top sản phẩm của tháng</h4>
            <Pie data={pieData} options={options} />
        </div>
    );
};

export default WeeklySalesPieChart;
