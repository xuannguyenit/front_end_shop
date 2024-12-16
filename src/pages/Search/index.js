import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as productService from '~/apiService/productService';
import * as cartService from '~/apiService/cartService';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Search() {
    const location = useLocation();
    const { keyword } = location.state || {};

    const [products, setProducts] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [cartItem, setCartItem] = useState();

    useEffect(() => {
        if (keyword) {
            const fetchSearchResults = async () => {
                try {
                    setLoading(true);
                    const results = await productService.searchProduct(keyword);
                    setProducts(results);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Lỗi tìm kiếm sản phẩm:', error);
                    alert('Đã xảy ra lỗi trong quá trình tìm kiếm.');
                }
            };

            fetchSearchResults();
        }
    }, [keyword]);
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

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product__sale')}>
                <div className={cx('product__sale-title')}>
                    <h2>Kết quả tìm kiếm cho: {keyword}</h2>
                </div>
                {products.length > 0 ? (
                    <div className={cx('product__sale-item')}>
                        {products.map((product) => (
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
                ) : (
                    <p>Không tìm thấy sản phẩm nào: </p>
                )}
            </div>
        </div>
    );
}

export default Search;
