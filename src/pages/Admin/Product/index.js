import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Dropdown } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import * as productService from '~/apiService/productService';
import styles from './AllProduct.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Product() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [allProduct, setAllProduct] = useState([]);
    const [page, setPage] = useState(1); // Trang hiện tại
    const [size, setSize] = useState(30); // Kích thước trang
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const navigate = useNavigate();

    // Hàm gọi API lấy tất cả sản phẩm
    const fetchAllProducts = useCallback(async () => {
        setLoading(true);
        try {
            const results = await productService.getAllProduct('less', page, size);
            setAllProduct(results.data); // Cập nhật danh sách sản phẩm
            setTotalPages(results.totalPages); // Cập nhật tổng số trang
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // Hàm xử lý sửa sản phẩm
    const handleEditProduct = useCallback(
        (id) => {
            console.log('Sửa Sản phẩm với ID:', id);
            navigate(`/admin/product/edit/${id}`);
        },
        [navigate],
    );

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
                    <h2>Danh sách sản phẩm</h2>
                </div>

                {/* Hiển thị thông báo thành công khi xóa sản phẩm */}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <div className={cx('group__content')}>
                    {allProduct.length === 0 ? (
                        <p>Không có sản phẩm nào.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Short Description</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Images</th>
                                    <th>Create Date</th>
                                    <th>Discount Codes</th>
                                    <th>ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProduct.map((product) => (
                                    <tr key={product.id}>
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
                                        <td>{product.name}</td>
                                        <td dangerouslySetInnerHTML={{ __html: product.shortDescription }}></td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.category.name}</td>
                                        <td>{product.brand.name}</td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                    Xem ảnh
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {product.images && product.images.length > 0 ? (
                                                        product.images.map((image, index) => (
                                                            <Dropdown.Item key={index}>
                                                                <img
                                                                    src={`data:image/${image.type};base64,${image.data}`}
                                                                    alt="category-img"
                                                                    style={{
                                                                        width: '50px',
                                                                        height: '50px',
                                                                        objectFit: 'cover',
                                                                        marginRight: '10px',
                                                                    }}
                                                                />
                                                            </Dropdown.Item>
                                                        ))
                                                    ) : (
                                                        <Dropdown.Item>Không có ảnh</Dropdown.Item>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                        <td>{product.createDate}</td>
                                        <td>
                                            {product.discountCode ? product.discountCode.discountPercentage + '%' : 0}
                                        </td>
                                        <td>{product.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Product;
