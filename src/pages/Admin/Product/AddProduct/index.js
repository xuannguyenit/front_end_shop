import React, { useState, useEffect } from 'react';
import * as categoryService from '~/apiService/categoryService';
import * as brandService from '~/apiService/brandService';
import * as productService from '~/apiService/productService';
import * as imagesService from '~/apiService/imageService';
import * as discountcodeService from '~/apiService/discountCodeService';
import { useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho Quill

import styles from './AddProduct.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [images, setImages] = useState([]);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        quantity: '',
        categoryId: '',
        brandId: '',
        imageIds: [],
        discountcodeId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoryResults = await categoryService.getAllCate();
                const brandResults = await brandService.getBrand();
                const imageResults = await imagesService.getImages();
                const discountResult = await discountcodeService.getDiscountcode();
                setCategories(categoryResults || []);
                setBrands(brandResults || []);
                setImages(imageResults || []);
                setDiscountCodes(discountResult || []);
            } catch (err) {
                setErrors({ ...errors, fetchData: 'Lỗi khi tải dữ liệu' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageSelection = (imageId) => {
        const updatedImageIds = formData.imageIds.includes(imageId)
            ? formData.imageIds.filter((id) => id !== imageId)
            : [...formData.imageIds, imageId];
        setFormData({ ...formData, imageIds: updatedImageIds });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
        if (!formData.quantity || parseInt(formData.quantity, 10) <= 0) newErrors.quantity = 'Số lượng phải lớn hơn 0';
        if (!formData.categoryId) newErrors.categoryId = 'Danh mục là bắt buộc';
        if (!formData.brandId) newErrors.brandId = 'Thương hiệu là bắt buộc';
        if (!formData.imageIds.length) newErrors.imageIds = 'Chọn ít nhất một ảnh';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            try {
                const response = await productService.addProduct(
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
                setSuccessMessage('Thêm thành công sản phẩm');
                console.log('sản phẩm được thêm: ', response);
                navigate('/admin/product/add');
            } catch (error) {
                setServerError(error.response?.data?.message || 'Đã xảy ra lỗi khi thêm sản phẩm');
            }
        }
    };

    // const handleDescriptionChange = (value) => {
    //     setFormData({ ...formData, description: value });
    // };

    // const handleShortDescriptionChange = (value) => {
    //     setFormData({ ...formData, shortDescription: value });
    // };
    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };
    const handleShortDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, shortDescription: value }));
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (errors.fetchData) {
        return <p>Lỗi: {errors.fetchData}</p>;
    }

    return (
        <div className={cx('wrapper')}>
            <h2>Thêm sản phẩm mới</h2>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="name">Tên sản phẩm</label>
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
                        <label htmlFor="description">Mô tả chi tiết</label>
                    </div>
                    <ReactQuill
                        id="description"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        theme="snow"
                        className={cx('form-control', 'form-control--des')}
                    />
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="shortdescription">Mô tả ngắn</label>
                    </div>
                    <ReactQuill
                        id="shortdescription"
                        value={formData.shortDescription}
                        onChange={handleShortDescriptionChange}
                        theme="snow"
                        className={cx('form-control', 'form-control--des')}
                    />
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="price">Giá sản phẩm</label>
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
                    {errors.price && <p className={cx('error-text')}>{errors.price}</p>}
                </div>

                {/* <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="discountcodeId">Chọn khuyến mãi</label>
                    </div>
                    <select
                        id="discountcodeId"
                        name="discountcodeId"
                        className={cx('form-control')}
                        value={formData.discountcodeId}
                        onChange={handleChange}
                    >
                        <option value="">Không chọn khuyến mãi</option>
                        {discountCodes.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.discountPercentage} %
                            </option>
                        ))}
                    </select>
                    {errors.discountcodeId && <p className={cx('error-text')}>{errors.discountcodeId}</p>}
                </div> */}
                {/* <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="discountcodeId">Chọn khuyến mãi</label>
                    </div>
                    <select
                        id="discountcodeId"
                        name="discountcodeId"
                        className={cx('form-control')}
                        value={formData.discountcodeId || ''}
                        onChange={handleChange}
                    >
                        <option value={null}>Không chọn khuyến mãi</option>
                        {discountCodes.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.discountPercentage} %
                            </option>
                        ))}
                    </select>
                    {errors.discountcodeId && <p className={cx('error-text')}>{errors.discountcodeId}</p>}
                </div> */}
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
                    {errors.discountcodeId && <p className={cx('error-text')}>{errors.discountcodeId}</p>}
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="quantity">Số lượng</label>
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
                    {errors.quantity && <p className={cx('error-text')}>{errors.quantity}</p>}
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="categoryId">Danh mục sản phẩm</label>
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
                    {errors.categoryId && <p className={cx('error-text')}>{errors.categoryId}</p>}
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="brandId">Thương hiệu sản phẩm</label>
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
                    {errors.brandId && <p className={cx('error-text')}>{errors.brandId}</p>}
                </div>

                <div className={cx('form-group')}>
                    <div className={cx('label__item')}>
                        <label htmlFor="imageIds">Chọn hình ảnh</label>
                    </div>
                    {images.map((image) => (
                        <div key={image.id} className={cx('image-selection')}>
                            <input
                                type="checkbox"
                                id={`image-${image.id}`}
                                checked={formData.imageIds.includes(image.id)}
                                onChange={() => handleImageSelection(image.id)}
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
                    {errors.imageIds && <p className={cx('error-text')}>{errors.imageIds}</p>}
                </div>

                {serverError && <p className={cx('error-text')}>{serverError}</p>}
                {successMessage && <p className={cx('success-text')}>{successMessage}</p>}

                <button type="submit" className={cx('submit-btn')}>
                    Thêm sản phẩm
                </button>
            </form>
        </div>
    );
}

export default AddProduct;
