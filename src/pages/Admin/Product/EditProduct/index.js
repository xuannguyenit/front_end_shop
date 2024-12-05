import React, { useState, useEffect, useCallback } from 'react';
import * as categoryService from '~/apiService/categoryService';
import * as brandService from '~/apiService/brandService';
import * as productService from '~/apiService/productService';
import * as imagesService from '~/apiService/imageService';
import * as discountService from '~/apiService/discountCodeService';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './EditProduct.module.scss';
import classNames from 'classnames/bind';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho Quill

const cx = classNames.bind(styles);

function EditProduct() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [images, setImages] = useState([]);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { productId } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        quantity: '',
        categoryId: '',
        brandId: '',
        imageIds: [],
        discountCodeId: '',
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const [categoriesData, brandsData, imagesData, discountsData, productData] = await Promise.all([
                categoryService.getAllCate(),
                brandService.getBrand(),
                imagesService.getImages(),
                discountService.getDiscountcode(),
                productService.getProductById(productId),
            ]);

            setCategories(categoriesData || []);
            setBrands(brandsData || []);
            setImages(imagesData || []);
            setDiscountCodes(discountsData || '');

            if (productData) {
                setFormData({
                    name: productData.name,
                    description: productData.description,
                    shortDescription: productData.shortDescription,
                    price: productData.price,
                    quantity: productData.quantity,
                    categoryId: productData.category?.id || '',
                    brandId: productData.brand?.id || '',
                    imageIds: productData.images?.map((image) => image.id) || [],
                    discountCodeId: productData.discountCode?.id || '',
                });
            }
        } catch (error) {
            setFetchError('Không thể tải dữ liệu. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageSelection = (imageId) => {
        setFormData((prev) => ({
            ...prev,
            imageIds: prev.imageIds.includes(imageId)
                ? prev.imageIds.filter((id) => id !== imageId)
                : [...prev.imageIds, imageId],
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Tên sản phẩm là bắt buộc';
        if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Giá sản phẩm phải lớn hơn 0';
        if (!formData.quantity || parseInt(formData.quantity, 10) <= 0) errors.quantity = 'Số lượng phải lớn hơn 0';
        if (!formData.categoryId) errors.categoryId = 'Danh mục là bắt buộc';
        if (!formData.brandId) errors.brandId = 'Thương hiệu là bắt buộc';
        if (!formData.imageIds.length) errors.imageIds = 'Chọn ít nhất một ảnh';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            try {
                const response = await productService.updateProduct(
                    productId,
                    formData.name,
                    formData.description,
                    formData.shortDescription,
                    formData.price,
                    formData.quantity,
                    formData.categoryId,
                    formData.brandId,
                    formData.imageIds,
                    formData.discountcodeId,
                );
                setSuccessMessage('Cập nhật sản phẩm thành công');
                console.log('Product response:', response);
                navigate('/admin/product');
            } catch (error) {
                setServerError(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật sản phẩm');
            }
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleShortDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, shortDescription: value }));
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (fetchError) return <p className={cx('error-text')}>{fetchError}</p>;

    return (
        <div className={cx('wrapper')}>
            <h2>Thay đổi thông tin sản phẩm</h2>
            <form onSubmit={handleSubmit} className={cx('main__form')}>
                <div className={cx('form-group')}>
                    <label htmlFor="name">Tên sản phẩm</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={cx('form-control')}
                    />
                    {formErrors.name && <p className={cx('error-text')}>{formErrors.name}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Mô tả chi tiết</label>
                    </div>
                    <ReactQuill
                        id="description"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        theme="snow"
                        className={cx('form-control', 'form-control--des')}
                    />
                    {formErrors.description && <p className={cx('error-text')}>{formErrors.description}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Mô tả ngắn</label>
                    </div>
                    <ReactQuill
                        id="shortdescription"
                        value={formData.shortDescription}
                        onChange={handleShortDescriptionChange}
                        theme="snow"
                        className={cx('form-control', 'form-control--des')}
                    />
                    {formErrors.shortDescription && <p className={cx('error-text')}>{formErrors.shortDescription}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Giá sản phẩm</label>
                    </div>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className={cx('form-control')}
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.price && <p className={cx('error-text')}>{formErrors.price}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="discountcodeId">Chọn mức khuyến mãi</label>
                    </div>
                    <select
                        id="discountcodeId"
                        name="discountcodeId"
                        className={cx('form-control')}
                        value={formData.discountcodeId}
                        onChange={handleChange}
                    >
                        <option value="">Không thêm khuyến mãi</option>
                        {discountCodes.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.discountPercentage} %
                            </option>
                        ))}
                    </select>
                    {formErrors.discountcodeId && <p className={cx('error-text')}>{formErrors.discountcodeId}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Số lượng</label>
                    </div>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className={cx('form-control')}
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.quantity && <p className={cx('error-text')}>{formErrors.quantity}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Danh mục</label>
                    </div>
                    <select
                        id="categoryId"
                        name="categoryId"
                        className={cx('form-control')}
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.categoryId && <p className={cx('error-text')}>{formErrors.categoryId}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">THương hiệu</label>
                    </div>
                    <select
                        id="brandId"
                        name="brandId"
                        className={cx('form-control')}
                        value={formData.brandId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.brandId && <p className={cx('error-text')}>{formErrors.brandId}</p>}
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">ảnh sản phẩm</label>
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
                    {formErrors.imageIds && <p className={cx('error-text')}>{formErrors.imageIds}</p>}
                </div>
                <div className={cx('bottom_form')}>
                    <button type="submit" className={cx('btn', 'btn-primary')}>
                        Lưu thay đổi
                    </button>
                    <button type="reset" className={cx('btn', 'btn-warning')}>
                        Thoát
                    </button>
                </div>
            </form>
            {serverError && <p className={cx('error-text')}>{serverError}</p>}
            {successMessage && <p className={cx('success-text')}>{successMessage}</p>}
        </div>
    );
}

export default EditProduct;
