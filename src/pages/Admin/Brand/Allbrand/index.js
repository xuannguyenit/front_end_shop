import styles from './AllBrand.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import * as branService from '~/apiService/brandService';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Dropdown } from 'react-bootstrap';

const cx = classNames.bind(styles);
function AllBrand() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // trang hiện tại
    const [size, setSize] = useState(20); // kích thước trang
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    // list thương hiệu
    const [brands, setbrands] = useState([]);

    const token = localStorage.getItem('token');

    // thực hiện call api get brand
    useEffect(() => {
        const fetchBrand = async () => {
            setLoading(true);
            try {
                const results = await branService.getAllBrand('less', page, size);
                const activeBrands = results.data.filter((brand) => !brand.deleted);
                setbrands(activeBrands); // Cập nhật với kết quả từ data
                setTotalPages(results.totalPages); // Cập nhật tổng số trang
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrand();
    }, [page, size]);

    // Hàm xử lý sửa và xóa cho Thương hiệu
    const handleEditBrand = (id) => {
        console.log('Sửa Thương hiệu với ID:', id);
        // Thêm logic gọi API sửa thương hiệu ở đây
        navigate(`/admin/brand/edit/${id}`);
    };

    const handleDeleteBrand = async (id) => {
        console.log('Xóa Thương hiệu với ID:', id);
        const username = localStorage.getItem('username');
        console.log('Username: ', username);

        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            const result = await branService.softDeleteBrand(id);

            if (result) {
                setSuccessMessage('Thương hiệu đã được xóa thành công.');
                setbrands((prev) => prev.filter((brand) => brand.id !== id));
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
            <div className={cx('title')}>
                <h2>Thương hiệu sản phẩm</h2>
            </div>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            Xem ảnh
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {brand.images && brand.images.length > 0 ? (
                                                brand.images.map((image, index) => (
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
        </div>
    );
}

export default AllBrand;
