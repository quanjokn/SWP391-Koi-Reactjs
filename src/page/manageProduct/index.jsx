import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/header/index';
import { UserContext } from '../../service/UserContext';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import api from '../../config/axios';
import styles from './manageProduct.module.css';
import Loading from '../../component/loading';

const ManageProduct = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [koi, setKoi] = useState([]);
    const [caredKoi, setCaredKoi] = useState([]);
    const [consignedKoi, setConsignedKoi] = useState([]);
    const [currentPageKoi, setCurrentPageKoi] = useState(1);
    const [currentPageCaredKoi, setCurrentPageCaredKoi] = useState(1);
    const [currentPageConsignedKoi, setCurrentPageConsignedKoi] = useState(1);
    const [fishPerPage] = useState(5);
    const [formData, setFormData] = useState({
        fishID: 25,
        name: '',
        quantity: 0,
        description: '',
        sex: '',
        age: '',
        character: '',
        size: '',
        price: 0,
        healthStatus: '',
        ration: '',
        photo: '',
        video: '',
        certificate: '',
        category: '',
        type: '',
        discount: 0,
        promotionPrice: 0,
        origin: 0,
        status: '',
        species: [],
    });

    const [isFormVisible, setIsFormVisible] = useState(false);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     if (name === 'species') {
    //         setFormData({
    //             ...formData,
    //             [name]: value.split(','), // Chuyển chuỗi thành mảng
    //         });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             [name]: value,
    //         });
    //     }
    // };
    const handleChange = (e) => {
        const { name, type, value, options } = e.target;
    
        if (type === 'select-multiple') {
            // Lấy các giá trị đã chọn trong select-multiple
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
    
            setFormData({
                ...formData,
                [name]: selectedValues, // Lưu mảng các giá trị đã chọn
            });
        } else {
            setFormData({
                ...formData,
                [name]: value, // Xử lý cho các input khác
            });
        }
    };
    

    const handleAddFish = async (e) => {
        e.preventDefault();

        const adjustedFormData = {
            ...formData,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            discount: formData.discount ? Number(formData.discount) : 0,
            promotionPrice: formData.promotionPrice ? Number(formData.promotionPrice) : 0,
            origin: Number(formData.origin),
            ...(formData.fishID && { fishID: Number(formData.fishID) }),
        };
        console.log(adjustedFormData);
        try {
            await api.post('/productList/addFish', adjustedFormData, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert('Fish added successfully!');
            setIsFormVisible(false); // Hide the form after submission
        } catch (error) {
            console.error('Error adding fish:', error);
            console.log(error.response?.data);
            alert('Failed to add fish.');
        }
    };

    const handleDelete = async (fishId) => {
        if (window.confirm('Are you sure you want to delete this fish?')) {
            try {
                await api.post(`/productList/deleteFish/${fishId}`);
                alert('Fish deleted successfully!');
                fetchFishData(); // Tải lại dữ liệu sau khi xóa
            } catch (error) {
                console.error('Error deleting fish:', error);
                alert('Failed to delete fish.');
            }
        }
    };

    const fetchFishData = async () => {
        try {
            const response = await api.get('/productList/allFish');
            const allFish = response.data;
            setKoi(allFish.fishDetailDTO);
            setCaredKoi(allFish.caredKois);
            setConsignedKoi(allFish.consignedKois);
        } catch (error) {
            console.error('Error fetching fish data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFishData();
        }
    }, [user]);

    const paginate = (type, pageNumber) => {
        switch (type) {
            case 'koi':
                setCurrentPageKoi(pageNumber);
                break;
            case 'caredKoi':
                setCurrentPageCaredKoi(pageNumber);
                break;
            case 'consignedKoi':
                setCurrentPageConsignedKoi(pageNumber);
                break;
            default:
                break;
        }
    };

    const indexOfLastKoi = currentPageKoi * fishPerPage;
    const indexOfFirstKoi = indexOfLastKoi - fishPerPage;
    const currentKoi = koi.slice(indexOfFirstKoi, indexOfLastKoi);

    const indexOfLastCaredKoi = currentPageCaredKoi * fishPerPage;
    const indexOfFirstCaredKoi = indexOfLastCaredKoi - fishPerPage;
    const currentCaredKoi = caredKoi.slice(indexOfFirstCaredKoi, indexOfLastCaredKoi);

    const indexOfLastConsignedKoi = currentPageConsignedKoi * fishPerPage;
    const indexOfFirstConsignedKoi = indexOfLastConsignedKoi - fishPerPage;
    const currentConsignedKoi = consignedKoi.slice(indexOfFirstConsignedKoi, indexOfLastConsignedKoi);

    const pageNumbersKoi = [];
    for (let i = 1; i <= Math.ceil(koi.length / fishPerPage); i++) {
        pageNumbersKoi.push(i);
    }

    const pageNumbersCaredKoi = [];
    for (let i = 1; i <= Math.ceil(caredKoi.length / fishPerPage); i++) {
        pageNumbersCaredKoi.push(i);
    }

    const pageNumbersConsignedKoi = [];
    for (let i = 1; i <= Math.ceil(consignedKoi.length / fishPerPage); i++) {
        pageNumbersConsignedKoi.push(i);
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <Tagbar />
            <div className={styles.container}>
                <h1>Quản lí cá Koi</h1>

                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className={styles.button}
                >
                    {isFormVisible ? 'Đóng' : 'Thêm cá '}
                </button>

                {isFormVisible && (
                    <form onSubmit={handleAddFish} className={styles.form}>
                        <div>
                            <label>Tên cá:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="0" 
                                required
                            />
                        </div>
                        <div>
                            <label>Mô tả:</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Giới tính:</label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>
                                    Chọn giới tính
                                </option>
                                <option value="Koi Đực">Đực</option>
                                <option value="Koi Cái">Cái</option>

                            </select>
                        </div>
                        <div>
                            <label>Tuổi:</label>
                            <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Tính cách:</label>
                            <input
                                type="text"
                                name="character"
                                value={formData.character}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Kích cỡ:</label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Giá:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0" 
                                required
                            />
                        </div>
                        <div>
                            <label>Tình trạng sức khỏe:</label>
                            <input
                                type="text"
                                name="healthStatus"
                                value={formData.healthStatus}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Chế độ ăn:</label>
                            <input
                                type="text"
                                name="ration"
                                value={formData.ration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Hình ảnh:</label>
                            <input
                                type="file"
                                name="photo"
                                value={formData.photo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Video:</label>
                            <input
                                type="text"
                                name="video"
                                placeholder="Nhập đường link URL "
                                value={formData.video}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Hình giấy chứng nhận:</label>
                            <input
                                type="file"
                                name="certificate"
                                value={formData.certificate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Loại:</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>
                                    Chọn loại
                                </option>
                                <option value="Koi">Cá thể</option>
                                <option value="Batch">Lô</option>

                            </select>
                        </div>
                        <div>
                            <label>Nguồn gốc:</label>
                            <select
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
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
                        <div>
                            <label>Giống loài:</label>
                            <select
                                className="form-control"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
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

                        <button type="submit" className={styles.button}>
                            Thêm
                        </button>
                    </form>
                )}

                {/* Koi Table */}
                <h2>Koi List</h2>
                {koi.length === 0 ? (
                    <div className={styles.noDataMessage}>No Koi available.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentKoi.map(fish => (
                                <tr key={fish.id}>
                                    <td>{fish.id}</td>
                                    <td>
                                        <img src={fish.photo} alt={fish.name} />
                                        {fish.name}
                                    </td>
                                    <td>{fish.price}</td>
                                    <td>
                                        <button onClick={() => {/* Handle Edit */ }}>Edit</button>
                                        <button onClick={handleDelete}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* Koi Pagination */}
                {koi.length > 0 && (
                    <nav>
                        <ul className="pagination">
                            {pageNumbersKoi.map(number => (
                                <li key={number} className={`page-item ${number === currentPageKoi ? 'active' : ''}`}>
                                    <button onClick={() => paginate('koi', number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* CareKois Table */}
                <h2>CareKois List</h2>
                {caredKoi.length === 0 ? (
                    <div className={styles.noDataMessage}>No Koi available.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên</th>
                                <th>Giá</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentCaredKoi.map(fish => (
                                <tr key={fish.id}>
                                    <td>{fish.id}</td>
                                    <td>
                                        <img src={fish.photo} alt={fish.name} />
                                        {fish.name}
                                    </td>
                                    <td>{fish.price}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* CareKois Pagination */}
                {caredKoi.length > 0 && (
                    <nav>
                        <ul className="pagination">
                            {pageNumbersCaredKoi.map(number => (
                                <li key={number} className={`page-item ${number === currentPageKoi ? 'active' : ''}`}>
                                    <button onClick={() => paginate('koi', number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                {/* ConsignKois Table */}
                <h2>ConsignKois List</h2>
                {consignedKoi.length === 0 ? (
                    <div className={styles.noDataMessage}>No Koi available.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên</th>
                                <th>Giá</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentConsignedKoi.map(fish => (
                                <tr key={fish.id}>
                                    <td>{fish.id}</td>
                                    <td>
                                        <img src={fish.photo} alt={fish.name} />
                                        {fish.name}
                                    </td>
                                    <td>{fish.price}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* ConsignKois Pagination */}
                {consignedKoi.length > 0 && (
                    <nav>
                        <ul className="pagination">
                            {pageNumbersConsignedKoi.map(number => (
                                <li key={number} className={`page-item ${number === currentPageKoi ? 'active' : ''}`}>
                                    <button onClick={() => paginate('koi', number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* Repeat similar structure for Cared Koi and Consigned Koi tables */}
            </div>


            <Footer />
        </>
    );
};

export default ManageProduct;
