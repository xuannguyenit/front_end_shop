import { useState, useEffect } from 'react';
// import axios from 'axios';
import * as productService from '~/apiService/productService';
import * as categoryService from '~/apiService/categoryService';
import * as cartService from '~/apiService/cartService';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1); // trang hiện tại
    const [size, setSize] = useState(10); // kích thước trang
    const [totalPages, setTotalPages] = useState(1);

    const [pageAll, setPageAll] = useState(1); // trang hiện tại
    const [sizeAll, setSizeAll] = useState(10); // kích thước trang
    const [totalPagesAll, setTotalPagesAll] = useState(1);
    // sản phẩm sale
    const [productSale, setProductSale] = useState([]);

    // tất cả sản phẩm và dc phân trang
    const [allProduct, setAllProduct] = useState([]);
    // list danh mục
    const [categorys, setCategorys] = useState([]);
    const [cartItem, setCartItem] = useState();

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

    // ------------------
    // thực hiện gọi api sản phẩm sale
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

    // thực hiện gọi api get tất cả sản phẩm và phân trang
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const results = await productService.getAllProduct('less', pageAll, sizeAll);
                setAllProduct(results.data); // Cập nhật với kết quả từ data
                setTotalPagesAll(results.totalPages); // Cập nhật tổng số trang
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, [pageAll, sizeAll]);
    // thực hiện gọi api thêm sản phẩm vào giỏ hàng
    // Hàm gọi API thêm sản phẩm vào giỏ hàng
    const addToCart = async (productId) => {
        setLoading(true);
        try {
            const result = await cartService.addToCart(productId);
            setCartItem(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {error.message}</p>;
    }

    return (
        <nav className={cx('wrapper')}>
            <div className={cx('product__sale')}>
                <div className={cx('product__sale-title')}>
                    <h2>Flast Sale</h2>
                </div>
                <div className={cx('product__sale-item')}>
                    {productSale.map((product) => (
                        <div key={product.id} className={cx('product__item')}>
                            <Link to={`/product/${product.id}`}>
                                <div className={cx('product__image')}>
                                    {product.images && product.images.length > 0 && (
                                        <img
                                            src={`data:image/${product.images[0].type};base64,${product.images[0].data}`}
                                            alt={product.name}
                                        />
                                    )}
                                </div>
                                <div className={cx('product__name')}>
                                    <p>{product.name}</p>
                                </div>
                            </Link>
                            <div className={cx('product__price')}>
                                <p>
                                    {product.discountCode
                                        ? (
                                              product.price *
                                              (1 - product.discountCode.discountPercentage / 100)
                                          ).toLocaleString()
                                        : product.price.toLocaleString()}
                                </p>
                                <span>--vnd</span>
                            </div>
                            <div className={cx('product__price-sale')}>
                                {product.discountCode ? (
                                    <p key={product.discountCode.id}>{product.discountCode.discountPercentage} %</p>
                                ) : (
                                    <p>0 %</p>
                                )}
                            </div>
                            <div className={cx('product__status')}>
                                <p>{product.status}</p>
                            </div>
                            <div className={cx('add__cart')}>
                                {product.quantity < 1 ? (
                                    <button style={{ color: 'white' }}>Add to cart</button>
                                ) : (
                                    <button onClick={() => addToCart(product.id)}>Add to cart</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={cx('pagination')}>
                    <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                        {'<'}
                    </button>
                    <span>
                        {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
            <div className={cx('category__future')}>
                <div className={cx('category__future-title')}>
                    <h2>Danh mục</h2>
                </div>
                <div className={cx('category__future-item')}>
                    {categorys.map((cate) => (
                        <Link to={`/category/${cate.id}`} key={cate.id}>
                            <div className={cx('category__item')}>
                                <div className={cx('category__image')}>
                                    {cate.images && cate.images.length > 0 && (
                                        <img
                                            src={`data:image/${cate.images[0].type};base64,${cate.images[0].data}`}
                                            alt={cate.name}
                                        />
                                    )}
                                </div>
                                <div className={cx('category__name')}>
                                    <p>{cate.name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className={cx('product__sale')}>
                <div className={cx('product__sale-title')}>
                    <h2>Các sản phẩm khác</h2>
                </div>
                <div className={cx('product__sale-item')}>
                    {allProduct.map((product) => (
                        <div className={cx('product__item')} key={product.id}>
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <div className={cx('product__image')}>
                                    {product.images && product.images.length > 0 && (
                                        <img
                                            src={`data:image/${product.images[0].type};base64,${product.images[0].data}`}
                                            alt={product.name}
                                        />
                                    )}
                                </div>
                                <div className={cx('product__name')}>
                                    <p>{product.name}</p>
                                </div>
                            </Link>

                            <div className={cx('product__price')}>
                                <p>
                                    {product.discountCode
                                        ? (
                                              product.price *
                                              (1 - product.discountCode.discountPercentage / 100)
                                          ).toLocaleString()
                                        : product.price.toLocaleString()}
                                </p>
                                <span>--vnd</span>
                            </div>
                            <div className={cx('product__price-sale')}>
                                {product.discountCode ? (
                                    <p key={product.discountCode.id}>{product.discountCode.discountPercentage} %</p>
                                ) : (
                                    <p>0 %</p>
                                )}
                            </div>
                            <div className={cx('product__status')}>
                                <p>{product.quantity > 0 ? 'còn hàng' : 'hết hàng'}</p>
                            </div>
                            <div className={cx('add__cart')}>
                                {product.quantity < 1 ? (
                                    <button style={{ color: 'white' }}>Add to cart</button>
                                ) : (
                                    <button onClick={() => addToCart(product.id)}>Add to cart</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={cx('pagination')}>
                    <button onClick={() => setPageAll((prev) => Math.max(prev - 1, 1))} disabled={pageAll === 1}>
                        {'<'}
                    </button>
                    <span>
                        {pageAll} / {totalPagesAll}
                    </span>
                    <button
                        onClick={() => setPageAll((prev) => Math.min(prev + 1, totalPagesAll))}
                        disabled={pageAll === totalPagesAll}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Home;
