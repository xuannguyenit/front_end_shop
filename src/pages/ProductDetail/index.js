import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Để lấy productId từ URL
import * as productService from '~/apiService/productService'; // Đường dẫn tới apiService
import * as cartService from '~/apiService/cartService';
import styles from './ProductDetail.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function ProductDetail() {
    const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null); // Trạng thái lưu thông tin sản phẩm
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [cartItem, setCartItem] = useState();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const result = await productService.getProductById(productId);
                setProduct(result); // Cập nhật sản phẩm
                // Lấy danh sách sản phẩm liên quan theo `category.id` từ `result`
                if (result && result.category) {
                    const res = await productService.getProductByCategoryId(result.category.id);
                    setListProduct(res.data); // Cập nhật danh sách sản phẩm liên quan
                }
            } catch (error) {
                setError(error); // Cập nhật lỗi
            } finally {
                setLoading(false); // Kết thúc trạng thái tải
            }
        };

        fetchProduct(); // Gọi hàm lấy sản phẩm
    }, [productId]);

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

    if (!product) {
        return <p>Sản phẩm không tồn tại.</p>; // Nếu không có sản phẩm
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <div className={cx('product__title')}>
                    <h2>{product.name}</h2>
                </div>
                <div className={cx('product__skucode')}>
                    <p>SKU: {product.id}</p>
                </div>

                <div className={cx('product__detail')}>
                    <div className={cx('thumnail')}>
                        {product.images && product.images.length > 0 && (
                            <img
                                src={`data:image/${product.images[0].type};base64,${product.images[0].data}`}
                                alt={product.name}
                            />
                        )}
                        <div className={cx('list_image')}>
                            {product.images.map((img, index) => (
                                <div key={index} className="image__item">
                                    <img
                                        src={`data:image/${img.type};base64,${img.data}`}
                                        alt={`${product.name} - image ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={cx('detail__item')}>
                        <div className={cx('detail__item-brandname')}>
                            <h3>Thương hiệu sản phẩm: {product.brand.name}</h3>
                        </div>
                        <div
                            className={cx('detail__item-shortdescription')}
                            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                        ></div>

                        <div className={cx('detail__item-price')}>
                            <p>Giá gốc: {product.price.toLocaleString()} VNĐ</p>
                        </div>
                        <div className={cx('detail__item-price')}>
                            <h3>
                                Giá khuyến mãi:
                                {product.discountCode
                                    ? (
                                          product.price *
                                          (1 - product.discountCode.discountPercentage / 100)
                                      ).toLocaleString()
                                    : product.price.toLocaleString()}{' '}
                                VNĐ
                            </h3>
                        </div>

                        <div className={cx('detail__item-ather')}>
                            <p>Các thông tin khác</p>
                        </div>
                        <div className={cx('detail__item-action')}>
                            <button className={cx('btn__addtocart')} onClick={() => addToCart(product.id)}>
                                Thêm vào giỏ hàng
                            </button>
                            <button className={cx('btn__buynow')}>Mua ngay</button>
                        </div>
                    </div>
                </div>

                <div className={cx('description__content')}>
                    <div>
                        <h3>Chi tiết mô tả sản phẩm</h3>
                    </div>
                    <div className={cx('content')} dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </div>

                <div className={cx('product__ather')}>
                    <div className={cx('product__sale')}>
                        <div className={cx('product__sale-title')}>
                            <h2>Danh sách sản phẩm liên quan</h2>
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
                                            <p key={product.discountCode.id}>
                                                {product.discountCode.discountPercentage} %
                                            </p>
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
            </div>
        </div>
    );
}

export default ProductDetail;
