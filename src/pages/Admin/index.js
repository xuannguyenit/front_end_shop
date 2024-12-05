import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import * as productService from '~/apiService/productService';
import * as categoryService from '~/apiService/categoryService';
import * as branService from '~/apiService/brandService';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';

const cx = classNames.bind(styles);

function HomeAdmin() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // trang hiện tại
    const [size, setSize] = useState(10); // kích thước trang
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [images, setIamges] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // tất cả sản phẩm và dc phân trang
    const [allProduct, setAllProduct] = useState([]);
    // list danh mục
    const [categorys, setCategorys] = useState([]);
    // list thương hiệu
    const [brands, setbrands] = useState([]);

    // thực hiện call api get category
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const results = await categoryService.getAllCategory('less', page, size);
                setCategorys(results.data); // Cập nhật với kết quả từ data
                setTotalPages(results.totalPages); // Cập nhật tổng số trang
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [page, size]);

    // thực hiện call api get brand
    useEffect(() => {
        const fetchBrand = async () => {
            setLoading(true);
            try {
                const results = await branService.getAllBrand('less', page, size);
                setbrands(results.data); // Cập nhật với kết quả từ data
                setTotalPages(results.totalPages); // Cập nhật tổng số trang
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrand();
    }, [page, size]);

    // thực hiện gọi api get tất cả sản phẩm và phân trang
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const results = await productService.getAllProduct('less', page, size);
                setAllProduct(results.data); // Cập nhật với kết quả từ data
                setTotalPages(results.totalPages); // Cập nhật tổng số trang
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, [page, size]);

    // xử lý sửa xóa danh mục thương hiệu và sản phẩm
    // Hàm xử lý sửa và xóa cho Danh mục
    const handleEditCategory = (id) => {
        console.log('Sửa Danh mục với ID:', id);

        navigate(`/admin/category/edit/${id}`);
    };

    const handleDeleteCategory = (id) => {
        console.log('Xóa Danh mục với ID:', id);
        // Thêm logic gọi API xóa danh mục ở đây
    };

    // Hàm xử lý sửa và xóa cho Thương hiệu
    const handleEditBrand = (id) => {
        console.log('Sửa Thương hiệu với ID:', id);
        // Thêm logic gọi API sửa thương hiệu ở đây
        navigate(`/admin/brand/edit/${id}`);
    };

    const handleDeleteBrand = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
            try {
                const result = await branService.deleBrand(id);
                if (result) {
                    setSuccessMessage('Thương hiệu được xóa thành công');
                    setbrands((prev) => prev.filter((brand) => brand.id !== id)); // Cập nhật lại danh sách sau khi xóa
                }
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm.');
            }
        }
    };

    // Hàm xử lý sửa và xóa cho Sản phẩm
    const handleEditProduct = (id) => {
        console.log('Sửa Sản phẩm với ID:', id);
        // Thêm logic gọi API sửa sản phẩm ở đây
        navigate(`/admin/product/edit/${id}`);
    };

    // Hàm xử lý xóa sản phẩm
    const handleDeleteProduct = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                const result = await productService.removeProduct(id);
                if (result) {
                    setSuccessMessage('Sản phẩm đã được xóa thành công.');
                    setAllProduct((prev) => prev.filter((product) => product.id !== id)); // Cập nhật lại danh sách sau khi xóa
                }
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm.');
            }
        }
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {error.message}</p>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('title')}>
                    <h2>Danh mục sản phẩm</h2>
                </div>
                <div className={cx('group__content')}>
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Tên danh mục</th>
                                <th>Logo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        {categorys.map((cate) => (
                            <tbody key={cate.id}>
                                <tr>
                                    <td>{cate.id}</td>
                                    <td>{cate.name}</td>
                                    <td>logo</td>
                                    <td>
                                        <div className={cx('action__table')}>
                                            <Button
                                                onClick={() => handleEditCategory(cate.id)}
                                                className={cx('btn_action')}
                                                variant="warning"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteCategory(cate.id)}
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
                {/* thuong hiệu sản phẩm */}
                <div className={cx('title')}>
                    <h2>Thương hiệu sản phẩm</h2>
                </div>
                <div className={cx('group__content')}>
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Tên Thương Hiệu</th>
                                <th>Logo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        {brands.map((brand) => (
                            <tbody key={brand.id}>
                                <tr>
                                    <td>{brand.id}</td>
                                    <td>{brand.name}</td>
                                    <td>logo</td>
                                    <td>
                                        <div className={cx('action__table')}>
                                            <Button
                                                onClick={() => handleEditBrand(brand.id)}
                                                className={cx('btn_action')}
                                                variant="warning"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteBrand(brand.id)}
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
                <div className={cx('title')}>
                    <h2>Sản phẩm</h2>
                </div>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <div className={cx('group__content')}>
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Tên sản phẩm</th>
                                <th>shortDescription</th>
                                <th>price</th>
                                <th>quantity</th>
                                <th>category</th>
                                <th>brand</th>
                                <th>images</th>
                                <th>createDate</th>
                                <th>discountCodes</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProduct.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td dangerouslySetInnerHTML={{ __html: product.shortDescription }}></td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.category.name}</td>
                                    <td>{product.brand.name}</td>
                                    <td>
                                        <select
                                            id="categoryId"
                                            name="categoryId"
                                            className="form-control"
                                            value={product.images.id}
                                        >
                                            <option value="">Danh sách ảnh</option>
                                            {product.images.map((image) => (
                                                <option key={image.id} value={image.id}>
                                                    {image.id}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{product.createDate}</td>
                                    <td>{product.discountCode ? product.discountCode.discountPercentage + '%' : 0}</td>
                                    <td>
                                        <div className={cx('action__table')}>
                                            <Button
                                                onClick={() => handleEditProduct(product.id)}
                                                className={cx('btn_action')}
                                                variant="warning"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className={cx('btn_action')}
                                                variant="danger"
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default HomeAdmin;
