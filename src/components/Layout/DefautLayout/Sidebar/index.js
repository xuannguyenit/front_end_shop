import { useState, useEffect } from 'react';
import * as brandService from '~/apiService/brandService';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Siderbar() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // brand
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const results = await brandService.getBrand();
            setBrand(results);
            setLoading(false);
        };
        fetchApi();

        // gọi cho product
        fetch('http://localhost:8888/api/v1/product/prod/')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Kết nối mạng không ổn định');
                }
                return res.json();
            })
            .then((data) => {
                setProducts(data.result); // Lấy mảng `result` từ phản hồi
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
        ///
    }, []);
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
                            <Link to={'/'}>
                                <li>{b.name}</li>
                            </Link>
                        </div>
                    ))}
                </ul>
                <div className={cx('title')}>
                    <h2>Các sản phẩm nổi bật</h2>
                </div>
                <ul>
                    {products.map((product) => (
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
