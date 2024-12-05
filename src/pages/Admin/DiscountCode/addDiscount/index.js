import styles from './AddDiscount.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as discountService from '~/apiService/discountCodeService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown } from 'react-bootstrap';
const cx = classNames.bind(styles);
function AddDiscountCode() {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [discountList, setDiscountList] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const discountListResult = await discountService.getDiscountcode();
                setDiscountList(discountListResult || null);
            } catch (error) {
                setErrors({ ...errors, fetchData: 'Lỗi khi tải dữ liệu' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleEdit = (id) => {
        console.log('Sửa Danh mục với ID:', id);
        // Thêm logic gọi API sửa danh mục ở đây
    };

    const handleDelete = (id) => {
        console.log('Xóa Danh mục với ID:', id);
        // Thêm logic gọi API xóa danh mục ở đây
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.code) newErrors.code = 'mã giảm giá không được trống';
        if (!formData.discountPercentage) newErrors.discountPercentage = 'Mức giảm giá không được trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setServerError('');
    //     setSuccessMessage('');

    //     if (validateForm()) {
    //         // Kiểm tra trùng lặp mã giảm giá
    //         const isDuplicate = discountList.some((dis) => dis.code === formData.code);
    //         if (isDuplicate) {
    //             setErrors({ ...errors, code: 'Mã giảm giá đã tồn tại' });
    //             return;
    //         }
    //         try {
    //             await discountService.addDiscount(formData.code, formData.discountPercentage);
    //             // Lấy lại danh sách mã giảm giá từ server sau khi thêm mới
    //             const discountListResult = await discountService.getDiscountcode();
    //             setDiscountList(discountListResult || []);
    //             setSuccessMessage('Thêm mã giảm giá thành công');
    //             navigate('/admin/discount');
    //         } catch (error) {
    //             setServerError('Có lỗi xảy ra khi thêm mã giảm giá');
    //         }
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            const isDuplicate = discountList.some((dis) => dis.code === formData.code);
            if (isDuplicate) {
                setErrors({ ...errors, code: 'Mã giảm giá đã tồn tại' });
                return;
            }

            const discountValue = parseFloat(formData.discountPercentage);
            if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
                setErrors({ ...errors, discountPercentage: 'Mức giảm giá phải từ 0 đến 100' });
                return;
            }

            try {
                // Gọi API để thêm mã giảm giá
                const addedDiscount = await discountService.addDiscount({
                    code: formData.code,
                    discountPercentage: discountValue,
                });

                // Cập nhật danh sách mã giảm giá
                setDiscountList((prevList) => [...prevList, addedDiscount]);
                setFormData({ code: '', discountPercentage: '' });
                setSuccessMessage('Thêm mã giảm giá thành công');
            } catch (error) {
                setServerError('Có lỗi xảy ra khi thêm mã giảm giá. Vui lòng thử lại sau.');
            }
        }
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (errors.fetchData) {
        return <p>Lỗi: {errors.fetchData}</p>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('form')}>
                <h2>Thêm chương trình giảm giá</h2>
                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <div className={cx('label__item')}>
                            <label htmlFor="name">Mã code</label>
                        </div>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            className={cx('form-control')}
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                        {errors.code && <p className={cx('error-text')}>{errors.code}</p>}
                    </div>

                    <div className={cx('form-group')}>
                        <div className={cx('label__item')}>
                            <label htmlFor="name">Mức giảm phần trăm</label>
                        </div>
                        <input
                            type="number"
                            id="discountPercentage"
                            name="discountPercentage"
                            className={cx('form-control')}
                            value={formData.discountPercentage}
                            onChange={handleChange}
                            required
                        />
                        {errors.discountPercentage && <p className={cx('error-text')}>{errors.discountPercentage}</p>}
                    </div>

                    <div className={cx('bottom_form')}>
                        <button type="submit" className={cx('btn', 'btn-primary')}>
                            Lưu mã giảm giá
                        </button>
                    </div>
                </form>
            </div>
            <div className={cx('container')}>
                <div className={cx('title')}>
                    <h2>Danh sách giảm giá</h2>
                </div>
                <div className={cx('group__content')}>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã Code</th>
                                <th>Mức giảm giá</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        {discountList.map((dis) => (
                            <tbody key={dis.id}>
                                <tr>
                                    <td>{dis.code}</td>
                                    <td>{dis.discountPercentage}</td>

                                    <td>
                                        <div className={cx('action__table')}>
                                            <Button
                                                onClick={() => handleEdit(dis.id)}
                                                className={cx('btn_action')}
                                                variant="warning"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(dis.id)}
                                                className={cx('btn_action')}
                                                variant="danger"
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AddDiscountCode;
