import React, { useState, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './consignKoi.module.css';
import api from '../../config/axios';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Masthead from '../../component/masthead';
import Footer from '../../component/footer';
import { UserContext } from '../../service/UserContext';
import { useNavigate } from 'react-router-dom';

const ConsignedKoiToSell = () => {
    const [fishForm, setFishForm] = useState([{
        name: '',
        quantity: '',
        description: '',
        sex: '',
        age: '',
        character: '',
        size: '',
        price: '',
        healthStatus: '',
        ration: '',
        photo: '',
        video: '',
        certificate: '',
        category: '',
        origin: '',
        species: ''
    }]);

    const [date, setDate] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setDate(newDate);
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

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedForms = [...fishForm];
        updatedForms[index][name] = value;
        setFishForm(updatedForms);
    };


    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const updatedForms = [...fishForm];
        updatedForms[index][event.target.name] = file;
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
                date: date,
                totalPrice: 0,
                commission: 0,
                ConsignList: fishForm.map(fishData => ({
                    name: fishData.name,
                    quantity: fishData.quantity,
                    description: fishData.description,
                    sex: fishData.sex,
                    age: fishData.age,
                    character: fishData.character,
                    size: fishData.size,
                    price: fishData.price,
                    healthStatus: fishData.healthStatus,
                    ration: fishData.ration,
                    photo: fishData.photo ? fishData.photo.name : '',
                    video: fishData.video ? fishData.video.name : '',
                    certificate: fishData.certificate ? fishData.certificate.name : '',
                    category: fishData.category,
                    origin: fishData.origin,
                    species: [fishData.species]
                }))
            };
            console.log("Fish data being sent:", JSON.stringify(fishData, null, 2));
            await api.post(`/consignOrder/add/${userId}`, fishData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Gửi dữ liệu thành công!');
            setFishForm([{ name: '', quantity: '', description: '', sex: '', age: '', character: '', size: '', price: '', healthStatus: '', ration: '', photo: '', video: '', certificate: '', category: '', origin: '', species: '' }]);
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
                <h1> Kí gửi để bán </h1>
                <form onSubmit={handleSubmit} className={styles['date-form']}>
                    <label htmlFor="date">Ngày bắt đầu:  </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={handleDateChange}
                        required // Bắt buộc chọn ngày
                    />
                </form>
                <div >
                    {fishForm.map((fishData, index) => (
                        <form onSubmit={handleSubmit} className={styles['fish-form']}>
                            <div key={index}>
                                <div>
                                    <span className={styles['title']}> Thông tin cá {index + 1}</span>
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
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            placeholder="Giá cá (VNĐ)"
                                            value={fishData.price}
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
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="quantity"
                                            placeholder="Số lượng"
                                            value={fishData.quantity}
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
                                            type="text"
                                            className="form-control"
                                            name="size"
                                            placeholder="Size"
                                            value={fishData.size}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="certificate"
                                            placeholder="URL ảnh certificate"
                                            onChange={(e) => handleFileChange(index, e)}
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
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
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
                                            name="video"
                                            placeholder="URL video về cá"
                                            onChange={(e) => handleFileChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="origin"
                                            placeholder="Nguồn gốc"
                                            value={fishData.origin}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="species"
                                            placeholder="Giống loài"
                                            value={fishData.species}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="category"
                                            placeholder="Loại cá"
                                            value={fishData.category}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <input
                                            className="form-control"
                                            name="ration"
                                            placeholder="Chế độ ăn của cá"
                                            value={fishData.ration}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
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
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                            rows="5"
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

export default ConsignedKoiToSell;
