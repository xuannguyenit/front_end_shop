import { Link, useParams } from 'react-router-dom';
import styles from './CategoryDetail.module.scss';
import classNames from 'classnames/bind';
import * as productService from '~/apiService/productService';
import * as cartService from '~/apiService/cartService';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
function CategoryDetail() {
    const { cateId } = useParams(); // Lấy productId từ URL

    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [cartItem, setCartItem] = useState();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await productService.getProductByCategoryId(cateId);
                setListProduct(res.data); // Cập nhật danh sách sản phẩm liên quan
            } catch (error) {
                setError(error); // Cập nhật lỗi
            } finally {
                setLoading(false); // Kết thúc trạng thái tải
            }
        };

        fetchProduct(); // Gọi hàm lấy sản phẩm
    }, [cateId]);

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
        return <p>Đang tải dữ liệu sản phẩm...</p>;
    }

    if (error) {
        return <p>Lỗi: {error.message}</p>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product__sale')}>
                <div className={cx('product__sale-title')}>
                    <h2>Danh sách sản phẩm</h2>
                </div>
                <div className={cx('product__sale-item')}>
                    {listProduct.map((product) => (
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
            </div>
        </div>
    );
}

export default CategoryDetail;
