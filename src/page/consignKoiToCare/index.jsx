import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './consignKoiToCare.module.css';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';
import Footer from '../../component/footer';

const ConsignedKoiToCare = () => {
    const [fishData, setFishData] = useState({
        name: '',
        age: '',
        sex: '',
        size: '',
        ration: '',
        health_status: '',
        certificate: '',
        photo: '',
        video: ''
    });

    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");

    const handleStartDateChange = (event) => {
        const newDate = event.target.value;
        setStartDate(newDate);
    };   
    const handleEndDateChange = (event) => {
        const newDate = event.target.value;
        setEndDate(newDate);
    };   
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFishData({ ...fishData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Lấy file đầu tiên được chọn
        setFishData({
            ...fishData,
            photo: file,  // Cập nhật thuộc tính photo với file được chọn
            video: file,
            certificate: file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', fishData.name);
            formData.append('age', fishData.age);
            formData.append('photo', fishData.photo);
            formData.append('ration', fishData.ration);
            formData.append('sex', fishData.sex);
            formData.append('size', fishData.size);
            formData.append('certificate', fishData.certificate);
            formData.append('health_status', fishData.health_status);
            formData.append('video', fishData.video);
            await api.post('/api/consign-order', fishData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Gửi dữ liệu thành công!');
            setFishData({ name: '', age: '', price: '', description: '', photo: '', quantity: '', ration: '', sex: '', size: '', certificate: '', character: '', health_status: '', video: '' });
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };
    

    return (
        <>
            <Header />
            <Tagbar />
            <Masthead title="Kí gửi để chăm sóc" />  
                  
            <div className={`container ${styles.wrapper}`}>
                <h1> Kí gửi để chăm sóc </h1>
                <form onSubmit={handleSubmit} className={styles['date-form']}>
                    <label htmlFor="startDate">Ngày bắt đầu:  </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                        required // Bắt buộc chọn ngày
                    />
                    
                </form>
                <form onSubmit={handleSubmit} className={styles['date-form']}>
                    <label htmlFor="endDate">Ngày kết thúc:  </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={handleEndDateChange}
                        required // Bắt buộc chọn ngày
                    />
                    
                </form>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Tên cá"
                                value={fishData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="number"
                                className="form-control"
                                name="age"
                                placeholder="Tuổi cá"
                                value={fishData.age}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="file"
                                className="form-control"
                                name="photo"
                                placeholder="URL ảnh cá"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                placeholder="Số lượng"
                                value={fishData.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="sex"
                                placeholder="Giới tính"
                                value={fishData.sex}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="size"
                                placeholder="Size"
                                value={fishData.size}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="file"
                                className="form-control"
                                name="certificate"
                                placeholder="URL ảnh certificate"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="character"
                                placeholder="Tính cách cá"
                                value={fishData.character}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="health_status"
                                placeholder="Tình trạng sức khoẻ"
                                value={fishData.health_status}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="file"
                                className="form-control"
                                name="video"
                                placeholder="URL video về cá"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <textarea
                                className="form-control"
                                name="ration"
                                placeholder="Chế độ ăn của cá"
                                value={fishData.ration}
                                onChange={handleInputChange}
                                required
                                rows="5"
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <textarea
                                className="form-control"
                                name="description"
                                placeholder="Mô tả cá"
                                value={fishData.description}
                                onChange={handleInputChange}
                                required
                                rows="5"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <button type="submit" className={`btn btn-success ${styles.submitButton}`}>
                                Gửi
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default ConsignedKoiToCare;
