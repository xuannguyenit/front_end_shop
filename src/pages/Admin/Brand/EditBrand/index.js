import styles from './EditBrand.module.scss';
import classNames from 'classnames/bind';
import * as brandService from '~/apiService/brandService';
import * as imageService from '~/apiService/imageService';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function EditBrand() {
    const [images, setImages] = useState([]); // Danh sách các ảnh
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { brandId } = useParams(); // Đổi `id` thành `brandId`

    const [formData, setFormData] = useState({
        name: '',
        imageIds: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!brandId) {
                setErrors({ fetchData: 'ID thương hiệu không hợp lệ' });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const [imagesResults, brandResult] = await Promise.all([
                    imageService.getImages(),
                    brandService.getBrandById(brandId),
                ]);

                console.log('Danh sách ảnh:', imagesResults);
                console.log('Chi tiết thương hiệu:', brandResult);

                setImages(imagesResults || []);
                if (brandResult) {
                    setFormData({
                        name: brandResult.name || '',
                        imageIds: brandResult.imageIds?.map((image) => image.id) || [],
                    });
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                setErrors({ fetchData: 'Không thể tải dữ liệu từ máy chủ' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [brandId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageSelection = (imageId) => {
        setFormData((prev) => {
            const imageIds = prev.imageIds.includes(imageId)
                ? prev.imageIds.filter((id) => id !== imageId)
                : [...prev.imageIds, imageId];
            return { ...prev, imageIds };
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Tên thương hiệu là bắt buộc';
        if (!formData.imageIds.length) newErrors.imageIds = 'Ảnh là bắt buộc';

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            try {
                await brandService.updateBrand(brandId, {
                    name: formData.name,
                    imageIds: formData.imageIds,
                });
                setSuccessMessage('Cập nhật thương hiệu thành công');
                alert('Cập nhật thương hiệu thành công');
                navigate('/admin/brand');
            } catch (error) {
                console.error('Lỗi khi cập nhật thương hiệu:', error);
                setServerError(error.message || 'Lỗi xảy ra khi cập nhật thương hiệu');
            }
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    if (errors.fetchData) return <p className={cx('error-text')}>Lỗi: {errors.fetchData}</p>;

    return (
        <div className={cx('wrapper')}>
            <h2>Cập nhật thương hiệu</h2>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="name" className={cx('label__item')}>
                        Tên thương hiệu
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
                        {images.length === 0 ? (
                            <p>Không có ảnh nào để chọn</p>
                        ) : (
                            images.map((image) => (
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
                            ))
                        )}
                    </div>
                    {errors.imageIds && <p className={cx('error-text')}>{errors.imageIds}</p>}
                </div>

                <div className={cx('bottom_form')}>
                    <button type="submit" className={cx('btn', 'btn-primary')}>
                        Lưu thương hiệu
                    </button>
                </div>
            </form>
            {serverError && <p className={cx('error-text')}>{serverError}</p>}
            {successMessage && <p className={cx('success-text')}>{successMessage}</p>}
        </div>
    );
}

export default EditBrand;
