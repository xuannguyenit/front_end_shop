import styles from './AllCategory.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import * as categoryService from '~/apiService/categoryService';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown, Alert } from 'react-bootstrap';

const cx = classNames.bind(styles);
function AllCategory() {
    const [categorys, setCategorys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1); // trang hiện tại
    const [size, setSize] = useState(40); // kích thước trang
    const [totalPages, setTotalPages] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // thực hiện call api get category
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const results = await categoryService.getAllCategory('less', page, size);
                setCategorys(results.data); // Cập nhật với kết quả từ data
                setTotalPages(results.totalPages); // Cập nhật tổng số trang

                console.log('danh sách resule: ', results);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
        console.log('danh sách cate: ', categorys);
    }, [page, size]);

    // Hàm xử lý sửa và xóa cho Danh mục
    // Hàm xử lý sửa và xóa cho Danh mục
    const handleEditCategory = (id) => {
        console.log('Sửa Danh mục với ID:', id);

        navigate(`/admin/category/edit/${id}`);
    };

    const handleDeleteCategory = async (id) => {
        console.log('Xóa Danh mục với ID:', id);
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            const result = await categoryService.softDeleteCategory(id);

            if (result) {
                setSuccessMessage('Thương hiệu đã được xóa thành công.');
                setCategorys((prev) => prev.filter((brand) => brand.id !== id));
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
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <div className={cx('group__content')}></div>
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
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                Xem ảnh
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {cate.images && cate.images.length > 0 ? (
                                                    cate.images.map((image, index) => (
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
            </div>
        </div>
    );
}

export default AllCategory;
