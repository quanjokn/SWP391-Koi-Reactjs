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
        type: '',
        origin: '',
        species: [],
        otherSpecies: ''
    }]);

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleAddNewForm = () => {
        setFishForm([...fishForm, {
            name: '', quantity: '', description: '', sex: '', age: '', character: '', size: '', price: '', healthStatus: '', ration: '', photo: '', video: '', certificate: '', type: '', origin: '', species: [], otherSpecies: ''
        }]);
    };
    const handleRemoveForm = (index) => {
        if (fishForm.length > 1) {
            const updatedForms = fishForm.filter((_, i) => i !== index); // Xóa form tại index
            setFishForm(updatedForms);
        }
    };

    const handleInputChange = (index, e) => {
        const { name, type, value, options } = e.target;
        const updatedForms = [...fishForm];

        if (type === 'select-multiple') {
            // Handle multi-select input
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            updatedForms[index][name] = selectedValues; // Store as an array
            // Xóa giá trị khác nếu chọn "Khác"
            if (selectedValues.includes('other')) {
                updatedForms[index].otherSpecies = ''; // Reset otherSpecies
            }
        } else {
            // Handle other input types (e.g., text, number)
            updatedForms[index][name] = value;
        }
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
        // Kiểm tra tính hợp lệ của form
        const form = e.target;
        if (!form.checkValidity()) {
            alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
            return; // Dừng lại nếu form không hợp lệ
        }
        try {
            const totalPrice = fishForm.reduce((total, fishData) => total + (fishData.price * fishData.quantity), 0);
            const commission = totalPrice * 0.1;
            const fishData = {
                totalPrice: totalPrice,
                commission: commission,
                ConsignList: fishForm.map(fishData => {
                    // Tạo mảng species mới bao gồm giá trị của otherSpecies (nếu có)
                    const combinedSpecies = [...fishData.species];

                    // Nếu người dùng đã nhập giống loài khác, thêm nó vào mảng species
                    if (fishData.otherSpecies) {
                        combinedSpecies.push(fishData.otherSpecies);
                    }
                    return {
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
                        type: fishData.type,
                        origin: fishData.origin,
                        species: combinedSpecies
                    };
                })
            };
            console.log("Fish data being sent:", JSON.stringify(fishData, null, 2));
            await api.post(`/consignOrder/add/${userId}`, fishData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Gửi dữ liệu thành công!');
            setFishForm([{ name: '', quantity: '', description: '', sex: '', age: '', character: '', size: '', price: '', healthStatus: '', ration: '', photo: '', video: '', certificate: '', category: '', origin: '', species: [], otherSpecies: '' }]);
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            alert('Vui lòng điền đầy đủ thông tin');
        }
    };

    return (
        <>
            <Header />
            <Tagbar />
            <Masthead title="Kí gửi để bán" />
            <div className={`container ${styles.wrapper}`}>
                <h1>Điền thông tin kí gửi để bán </h1>
                <div >

                    <form onSubmit={handleSubmit} className={styles['fish-form']}>
                        {fishForm.map((fishData, index) => (
                            <div key={index}>
                                <div className={styles['title2']} >
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
                                        <label>Tên cá:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={fishData.name}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Tuổi cá:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="age"
                                            min="1"
                                            max="10"
                                            value={fishData.age}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Giá cá:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            placeholder="VNĐ"
                                            value={fishData.price}
                                            onChange={(e) => handleInputChange(index, e)}
                                            min="100000"
                                            max="100000000"
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Hình ảnh cá:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="photo"
                                            onChange={(e) => handleFileChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Số lượng:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="quantity"
                                            value={fishData.quantity}
                                            onChange={(e) => handleInputChange(index, e)}
                                            min="1"
                                            max="10"
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Giới tính:</label>
                                        <select
                                            name="sex"
                                            value={fishData.sex}
                                            className="form-control"
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Chọn giới tính
                                            </option>
                                            <option value="Koi Đực">Đực</option>
                                            <option value="Koi Cái">Cái</option>

                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Kích thước:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="size"
                                            min="10"
                                            max="100"
                                            placeholder="(cm)"
                                            value={fishData.size}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Hình ảnh giấy chứng nhận:</label>
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
                                        <label>Tính cách:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="character"
                                            value={fishData.character}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label>Tình trạng sức khoẻ:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="healthStatus"
                                            value={fishData.healthStatus}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label > Video: </label>                                        
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="video"
                                            placeholder="Nhập đường link URL"
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label > Nguồn gốc: </label>
                                        <select
                                            className="form-control"
                                            name="origin"
                                            value={fishData.origin}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Chọn nguồn gốc
                                            </option>
                                            <option value="1">Thuần chủng nhập khẩu</option>
                                            <option value="2">Thuần chủng Việt</option>
                                            <option value="3">Lai F1</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label > Loại: </label>
                                        <select
                                            className="form-control"
                                            name="type"
                                            value={fishData.type}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Chọn loại
                                            </option>
                                            <option value="Cá thể">Cá thể</option>
                                            <option value="Lô">Lô</option>

                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label > Chế độ ăn: </label>
                                        <input
                                            className="form-control"
                                            name="ration"
                                            value={fishData.ration}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                        <label > Giống loài: </label>
                                        <select
                                            className="form-control"
                                            name="species"
                                            value={fishData.species}
                                            onChange={(e) => handleInputChange(index, e)}
                                            size={2}
                                            multiple={true}
                                            required
                                        >
                                            <option value="" disabled>
                                                Chọn giống loài
                                            </option>
                                            <option value="Koi Ogon">Koi Ogon</option>
                                            <option value="Koi Showa">Koi Showa</option>
                                            <option value="Koi Tancho">Koi Tancho</option>
                                            <option value="Koi Bekko">Koi Bekko</option>
                                            <option value="Koi Kohaku">Koi Kohaku</option>
                                            <option value="Koi Platinum">Koi Platinum</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                    {fishData.species.includes('other') && (
                                        <div>
                                            <label className={styles["khac"]}>Vui lòng nhập tên loài:</label>
                                            <input
                                                type="text"
                                                name="otherSpecies"
                                                value={fishData.otherSpecies}
                                                onChange={(e) => handleInputChange(index, e)}
                                            />
                                        </div>
                                    )}

                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label > Mô tả: </label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={fishData.description}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                            rows="5"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* button */}
                        <div>
                            <button type="button" className={`btn btn-success ${styles.submitButton}`} onClick={handleAddNewForm}>
                                <i className="fa-solid fa-plus"></i> Thêm cá để kí gửi
                            </button>
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

            </div>
            <br/>
            <Footer />
        </>
    );
};

export default ConsignedKoiToSell;
