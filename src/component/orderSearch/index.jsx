import React, { useState } from 'react';
import './orderSearch.css'; // Thêm file CSS riêng cho styling

const OrderSearch = ({ onSearch }) => {
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    const handleSearch = () => {
        onSearch(searchDate, searchStatus);
    };

    return (
        <div className="order-search-container">
            <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="form-control me-2 search-input"
                placeholder="Tìm kiếm theo ngày"
            />
            <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="form-select me-2 search-select"
            >
                <option value="">Tất cả trạng thái</option>
                <option value="Pending_confirmation">Đợi xác nhận</option>
                <option value="Preparing">Đang chuẩn bị</option>
                <option value="Shipping">Đang vận chuyển</option>
                <option value="Completed">Đã hoàn thành</option>
                <option value="Rejected">Đã bị từ chối</option>
            </select>
            <button className="btn btn-primary search-button" onClick={handleSearch}>
                Tìm kiếm
            </button>
        </div>
    );
};

export default OrderSearch;
