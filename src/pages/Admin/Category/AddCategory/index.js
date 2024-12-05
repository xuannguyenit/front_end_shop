import { useEffect, useState } from 'react';
import styles from './AddCategory.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import * as imagesService from '~/apiService/imageService';
import * as categoryService from '~/apiService/categoryService';

const cx = classNames.bind(styles);

function AddCategory() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        imageIds: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const imageResult = await imagesService.getImages();
                setImages(imageResult || []);
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

    const handleImageSelection = (imageId) => {
        const updatedImageIds = formData.imageIds.includes(imageId)
            ? formData.imageIds.filter((id) => id !== imageId)
            : [...formData.imageIds, imageId];
        setFormData({ ...formData, imageIds: updatedImageIds });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Tên danh mục là bắt buộc';
        if (formData.imageIds.length === 0) newErrors.imageIds = 'Ảnh không được rỗng';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            try {
                await categoryService.createCategory(formData.name, formData.imageIds);
                setSuccessMessage('Thêm danh mục thành công');
                navigate('/admin/category');
            } catch (error) {
                setServerError('Có lỗi xảy ra khi thêm danh mục');
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
            <h2>Thêm mới danh mục</h2>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Tên danh mục</label>
                    </div>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={cx('form-control')}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <p className={cx('error-text')}>{errors.name}</p>}
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Ảnh danh mục</label>
                    </div>
                    <div className={cx('image-selection')}>
                        {images.map((image) => (
                            <div key={image.id} className={cx('image-item')}>
                                <input
                                    type="checkbox"
                                    checked={formData.imageIds.includes(image.id)}
                                    onChange={() => handleImageSelection(image.id)}
                                    id={`image-${image.id}`}
                                />
                                <label htmlFor={`image-${image.id}`} className={cx('image-preview')}>
                                    <img
                                        className={cx('image__product')}
                                        src={`data:image/${image.type};base64,${image.data}`}
                                        alt="img"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.imageIds && <p className={cx('error-text')}>{errors.imageIds}</p>}
                </div>

                <div className={cx('bottom_form')}>
                    <button type="submit" className={cx('btn', 'btn-primary')}>
                        Lưu danh mục
                    </button>
                </div>
            </form>
            {serverError && <p className={cx('error-text')}>{serverError}</p>}
            {successMessage && <p className={cx('success-text')}>{successMessage}</p>}
        </div>
    );
}

export default AddCategory;
