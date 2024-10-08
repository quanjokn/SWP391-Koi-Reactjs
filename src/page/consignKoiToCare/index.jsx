import React, { useState, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './consignKoiToCare.module.css';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';
import Footer from '../../component/footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserContext } from '../../service/UserContext';
import { useNavigate } from 'react-router-dom';

const ConsignedKoiToCare = () => {
    const [fishForm, setFishForm] = useState([{
            name: '',
            sex: '',
            age: '',
            size: '',
            ration: '',
            healthStatus: '',
            photo: ''
        }
    ]);
    const { user } = useContext(UserContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    const handleStartDateChange = (event) => {
        const newDate = event.target.value;
        setStartDate(newDate);
    };
    const handleEndDateChange = (event) => {
        const newDate = event.target.value;
        setEndDate(newDate);
    };


    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedForms = [...fishForm];
        updatedForms[index][name] = value; // Cập nhật form theo index
        setFishForm(updatedForms);
    };

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const updatedForms = [...fishForm];
        updatedForms[index][event.target.name] = file; // Cập nhật file theo index
        setFishForm(updatedForms);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = user ? user.id : null;
        if (!userId) {
            console.error("User not logged in!");
            return navigate('/login');
        }
        try {
            const fishData = {
                startDate: startDate,
                endDate: endDate,
                totalPrice: 0, // Bạn có thể tính toán giá trị này nếu cần
                CaredKoiList: fishForm.map(fishData => ({
                    name: fishData.name,
                    sex: fishData.sex,
                    age: fishData.age,
                    size: fishData.size,
                    ration: fishData.ration,
                    healthStatus: fishData.healthStatus,
                    photo: fishData.photo ? fishData.photo.name : '' // Chỉ gửi tên tệp
                }))
            };
            await api.post(`/caringOrder/add/${userId}`, fishData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Gửi dữ liệu thành công!');
            setFishForm([{ name: '', sex: '', age: '', size: '', ration: '', healthStatus: '', photo: '' }]);
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };
    const handleAddNewForm = () => {
        setFishForm([...fishForm, {
            name: '', sex: '', age: '', size: '', ration: '', healthStatus: '', photo: ''
        }]);
    };
    const handleRemoveForm = (index) => {
        if (fishForm.length > 1) {
            const updatedForms = fishForm.filter((_, i) => i !== index); // Xóa form tại index
            setFishForm(updatedForms);
        }
    };


    return (
        <>
            <Header />
            <Tagbar />
            <Masthead title="Kí gửi để chăm sóc" />

            <div className={`container ${styles.wrapper}`} >
                <div className={styles['form-container']}>
                    <h1 className={styles['title']}> Kí gửi để chăm sóc </h1>
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

                    {fishForm.map((fishData, index) => (
                        <form onSubmit={handleSubmit} className={styles['fish-form']}>
                            <div key={index}>
                                <div className={styles['head-form']}>
                                    <span className={styles['title']}>Thông tin cá {index + 1}</span>
                                    {fishForm.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveForm(index)}
                                            className={styles['closeButton']}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    )}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Tên cá"
                                            value={fishData.name}
                                            onChange={(e) => handleInputChange(index, e)}
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
                                            onChange={(e) => handleInputChange(index, e)}
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
                                            onChange={(e) => handleInputChange(index, e)}
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
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <textarea
                                                className="form-control"
                                                name="ration"
                                                placeholder="Chế độ ăn của cá"
                                                value={fishData.ration}
                                                onChange={(e) => handleInputChange(index, e)}
                                                required
                                                rows="5"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="healthStatus"
                                            placeholder="Tình trạng sức khoẻ"
                                            value={fishData.healthStatus}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="photo"
                                            placeholder="URL ảnh cá"
                                            onChange={(e) => handleFileChange(index, e)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    ))}

                    <div>
                        <button type="button" className={styles['btAdd']} onClick={handleAddNewForm}>
                            <i className="fa-solid fa-plus"></i> Thêm cá để kí gửi
                        </button>
                    </div>

                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <button onClick={handleSubmit} type="submit" className={`btn btn-success ${styles.submitButton}`}>
                                Gửi
                            </button>
                        </div>
                    </div>

                </div>

            </div>
            <Footer />
        </>
    );
};

export default ConsignedKoiToCare;
