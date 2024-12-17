import { useState, useEffect } from 'react';
import * as brandService from '~/apiService/brandService';
import * as productService from '~/apiService/productService';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Siderbar() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // trang hiện tại
    const [size, setSize] = useState(10); // kích thước trang
    const [productSale, setProductSale] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // brand
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const results = await brandService.getAllBrand('less', page, size);
            setBrand(results.data);
            setLoading(false);
        };
        fetchApi();
    }, []);
    useEffect(() => {
        const fetchProductSale = async () => {
            setLoading(true);
            try {
                const results = await productService.getProductSale('less', page, size);
                setProductSale(results.data); // Cập nhật với kết quả từ data
                setTotalPages(results.totalPages); // Cập nhật tổng số trang
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductSale();
    }, [page, size]);
    // ------------------
    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {setError(error)}</p>;
    }

    return (
        <aside className={cx('wrapper')}>
            <div className={cx('sidebar__list')}>
                <div className={cx('title')}>
                    <h2>Các thương hiệu nổi bật</h2>
                </div>
                <ul>
                    {brand.map((b) => (
                        <div className={cx('sidebar__list-item')} key={b.id}>
                            <Link to={`/product/brand/${b.id}`}>
                                <li>{b.name}</li>
                            </Link>
                        </div>
                    ))}
                </ul>
                <div className={cx('title')}>
                    <h2>Các sản phẩm nổi bật</h2>
                </div>
                <ul>
                    {productSale.map((product) => (
                        <div className={cx('sidebar__list-item')} key={product.id}>
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <li>{product.name}</li>
                            </Link>
                        </div>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default Siderbar;
