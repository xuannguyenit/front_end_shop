import styles from './EditCategory.module.scss';
import classNames from 'classnames/bind';
import * as categoryService from '~/apiService/categoryService';
import * as imageService from '~/apiService/imageService';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function EditCategory() {
    const [images, setImages] = useState([]); // Danh sách ảnh
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        imageIds: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy danh sách ảnh và thông tin danh mục
                const [imagesResults, categoryResult] = await Promise.all([
                    imageService.getImages(),
                    categoryService.getCategoryById(categoryId),
                ]);

                console.log('Danh sách ảnh:', imagesResults);
                console.log('Chi tiết danh mục:', categoryResult);

                setImages(imagesResults || []);
                if (categoryResult) {
                    setFormData({
                        name: categoryResult.name || '',
                        imageIds: categoryResult.images?.map((image) => image.id) || [],
                    });
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                setErrors({ fetchData: 'Không thể tải dữ liệu' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageSelection = (imageId) => {
        setFormData((prevState) => {
            const imageIds = prevState.imageIds.includes(imageId)
                ? prevState.imageIds.filter((id) => id !== imageId)
                : [...prevState.imageIds, imageId];
            return { ...prevState, imageIds };
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Tên danh mục là bắt buộc';
        if (!formData.imageIds || formData.imageIds.length === 0) newErrors.imageIds = 'Ảnh là bắt buộc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            try {
                await categoryService.updateCategory(categoryId, {
                    name: formData.name,
                    imageIds: formData.imageIds,
                });
                setSuccessMessage('Cập nhật danh mục thành công');
                alert('Cập nhật danh mục thành công');
                navigate('/admin/home');
            } catch (error) {
                setServerError(error.message || 'Lỗi xảy ra khi cập nhật danh mục');
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
            <h2>Chỉnh sửa danh mục</h2>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="name" className={cx('label__item')}>
                        Tên danh mục
                    </label>
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
                    <label htmlFor="images" className={cx('label__item')}>
                        Chọn ảnh
                    </label>
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

                <button type="submit" className={cx('btn', 'btn-primary')}>
                    Lưu danh mục
                </button>
                {serverError && <p className={cx('error-text')}>{serverError}</p>}
                {successMessage && <p className={cx('success-text')}>{successMessage}</p>}
            </form>
        </div>
    );
}

export default EditCategory;
