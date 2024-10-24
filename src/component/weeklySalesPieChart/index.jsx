import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../config/axios'; // Đảm bảo rằng bạn đã cấu hình axios

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklySalesPieChart = () => {
    const [pieData, setPieData] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading

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
                console.log('Dữ liệu trả về:', salesData); // Kiểm tra dữ liệu

                // Kiểm tra cấu trúc dữ liệu
                if (!Array.isArray(salesData) || salesData.length === 0) {
                    throw new Error('Không có dữ liệu để hiển thị');
                }

                const productSales = {};

                // Duyệt qua từng tuần trong dữ liệu
                salesData.forEach(week => {
                    if (week.productSalesDTOList) { // Kiểm tra xem productSalesDTOList có tồn tại không
                        week.productSalesDTOList.forEach(product => {
                            const { fishName, totalQuantity } = product;

                            // Cộng dồn số lượng sản phẩm đã bán
                            productSales[fishName] = (productSales[fishName] || 0) + totalQuantity;
                        });
                    }
                });

                // Trích xuất label và data từ productSales
                const sortedProductSales = Object.entries(productSales)
                    .sort(([, a], [, b]) => b - a) // Sắp xếp giảm dần theo số lượng
                    .slice(0, 4) // Lấy tối đa 4 sản phẩm hàng đầu
                    .map(([name, quantity]) => ({ name, quantity })); // Chuyển đổi về dạng đối tượng

                // Xử lý dữ liệu cho biểu đồ
                const labels = sortedProductSales.map(product => product.name); // Lấy tất cả tên sản phẩm
                const data = sortedProductSales.map(product => product.quantity); // Lấy tất cả số lượng

                // Cập nhật trạng thái dữ liệu cho biểu đồ
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
                alert(error.message); // Hiển thị thông báo lỗi cho người dùng
            } finally {
                setLoading(false); // Đặt loading thành false sau khi hoàn thành
            }
        };

        fetchPieData();
    }, []);

    if (loading) {
        return <p>Đang tải biểu đồ...</p>; // Hiển thị thông báo đang tải
    }

    if (!pieData) {
        return <p>Không có dữ liệu để hiển thị.</p>; // Thông báo khi không có dữ liệu
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
            <h4>Biểu đồ thể hiện sản phẩm trong tháng</h4>
            <Pie data={pieData} options={options} />
        </div>
    );
};

export default WeeklySalesPieChart;
