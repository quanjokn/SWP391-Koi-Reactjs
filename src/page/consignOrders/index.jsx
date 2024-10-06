import React, { useState, useEffect } from 'react';
import Header from '../../component/header';
import Footer from '../../component/footer';
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';


const ConsignOrders = () => {
    // Giả lập đơn hàng sau khi được gửi
    const [orders, setOrders] = useState([]);

    // Tạo một số dữ liệu mẫu cho các form
    useEffect(() => {
        // Giả lập dữ liệu đơn hàng từ backend
        const sampleOrders = [
            { id: 1,type:'Ky gui cham soc', date: '2024-10-05', status: 'Chờ xác nhận' },
            { id: 2,type:'Ky gui ban', date: '2024-10-04', status: 'Chờ xác nhận' },
        ];
        setOrders(sampleOrders);
    }, []);

    return (
        <>
        <Header/>
        <Tagbar/>
        <Masthead title={"đơn ký gửi"}/>
        <div className="container">
            <h2 className="my-4">Danh sách đơn hàng ký gửi</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Số thứ tự</th>
                        <th>Loại form</th>
                        <th>Ngày gửi</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.type}</td>
                            <td>{order.date}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Footer/>
        </>
    );
};

export default ConsignOrders;
