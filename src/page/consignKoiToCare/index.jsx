import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './consignKoi.module.css';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';
import Footer from '../../component/footer';

const ConsignedKoiToSell = () => {
    const [fishData, setFishData] = useState({
        name: '',
        age: '',
        price: '',
        description: '',
        photo: '',
        quantity: '',
        ration: '',
        sex: '',
        size: '',
        certificate: '',
        character: '',
        health_status: '',
        video: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFishData({ ...fishData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/consigned-kois', fishData);
            alert('Gửi dữ liệu thành công!');
            setFishData({ name: '', age: '', price: '', description: '', photo: '' });
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <Masthead title="Kí gửi để bán" />
            <div className={`container ${styles.wrapper}`}>
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
                                type="number"
                                className="form-control"
                                name="price"
                                placeholder="Giá cá (VNĐ)"
                                value={fishData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="photo"
                                placeholder="URL ảnh cá"
                                value={fishData.photo}
                                onChange={handleInputChange}
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
                                type="text"
                                className="form-control"
                                name="certificate"
                                placeholder="URL ảnh certificate"
                                value={fishData.certificate}
                                onChange={handleInputChange}
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
                                type="text"
                                className="form-control"
                                name="video"
                                placeholder="URL video về cá"
                                value={fishData.video}
                                onChange={handleInputChange}
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

export default ConsignedKoiToSell;
