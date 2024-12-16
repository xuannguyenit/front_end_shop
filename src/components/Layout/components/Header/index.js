import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCartShopping, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.cjs';
import * as brandService from '~/apiService/brandService';
import * as categoryService from '~/apiService/categoryService';
import * as cartService from '~/apiService/cartService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(''); // Thêm state để lưu vai trò người dùng
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const [page, setPage] = useState(1); // trang hiện tại
    const [size, setSize] = useState(10); // kích thước trang

    const [brand, setBrand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listCate, setListCate] = useState([]);
    const token = localStorage.getItem('token');
    const [keyword, setKeyword] = useState('');
    const [listItem, setListItem] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartData = async () => {
            setLoading(true);
            try {
                const result = await cartService.getCartById(userId);
                if (Array.isArray(result)) {
                    setListItem(result);
                    const totalQuantity = result.reduce((sum, item) => {
                        // Kiểm tra nếu quantity là một số hợp lệ, nếu không thì coi như 0
                        return sum + Number(item.productQuantity);
                    }, 0);
                    setCartCount(totalQuantity);
                } else {
                    setListItem([]);
                    setCartCount(0);
                }
                console.log('giỏ hàng: ', result);
            } catch (err) {
                setError('Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.');

                console.error('Error fetching cart:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [userId]);

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
        const fetchApi = async () => {
            setLoading(true);
            const results = await categoryService.getAllCategory('less', page, size);
            setListCate(results.data);
            setLoading(false);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        if (token) {
            const username = localStorage.getItem('username'); // Lấy thông tin người dùng từ localStorage
            const userRole = localStorage.getItem('role'); // Lấy vai trò từ localStorage
            if (username && userRole) {
                setUserName(username);
                setRole(userRole); // Lưu vai trò vào state
                setIsLoggedIn(true);
            }
            console.log('ROLE:', userRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role'); // Xóa vai trò khi đăng xuất
        setIsLoggedIn(false);
        setRole(''); // Đặt lại vai trò khi đăng xuất
        navigate('/');
    };

    const actionSearch = (keyword) => {
        if (!keyword.trim()) {
            alert('Vui lòng nhập từ khóa tìm kiếm!');
            return;
        }

        // Chỉ chuyển keyword qua navigate
        navigate('/search', { state: { keyword } });
    };
    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('inner__menu')}>
                    <div className={cx('inner__menu-icon')}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <div className={cx('inner__menu-title')}>
                        <p>Danh mục</p>
                    </div>
                    <div className={cx('inner__menu-list')}>
                        <ul>
                            <li>
                                <Link to={'/'}>Trang chủ</Link>
                            </li>
                            <li>
                                <Link to={'/order/all/get'}>Thông tin mua sắm</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* logo */}
                <div className={cx('inner__logo')}>
                    <Link to={'/'}>
                        <img src={require('~/assets/images/logo.webp')} alt="logo" />
                    </Link>
                </div>
                {/* /logo */}
                {/* input search */}
                <div className={cx('inner__search')}>
                    <input
                        className={cx('search__input')}
                        placeholder="Tìm kiếm sản phẩm"
                        spellCheck={false}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // Lưu từ khóa vào state
                    />
                    <button className={cx('search-clear')} onClick={() => setKeyword('')}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    <FontAwesomeIcon icon={faSpinner} className={cx('loading')} />
                    <Tippy content="Tìm kiếm" placement="right">
                        <button className={cx('search-btn')} onClick={() => actionSearch(keyword)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </Tippy>
                </div>

                <div className={cx('inner__action')}>
                    <div className={cx('account')}>
                        <div className={cx('account__icon')}>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className={cx('account__action')}>
                            <ul>
                                {isLoggedIn ? (
                                    <>
                                        <li>
                                            <span>Hi, {userName}</span>
                                        </li>
                                        <li onClick={handleLogout}>Đăng xuất</li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link to={'/login'}>Đăng nhập</Link>
                                        </li>
                                        <li>
                                            <Link to={'/register'}>Đăng ký</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    {token === null ? (
                        <Link to={'/login'}>
                            <div className={cx('cart')}>
                                <div className={cx('cart_icon')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                </div>
                                <span className={cx('cart__count')}>{0}</span>
                                <div className={cx('cart__title')}>Giỏ hàng</div>
                            </div>
                        </Link>
                    ) : (
                        <Link to={`/cart/${userId}`}>
                            <div className={cx('cart')}>
                                <div className={cx('cart_icon')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                </div>
                                <span className={cx('cart__count')}>{cartCount}</span>
                                <div className={cx('cart__title')}>Giỏ hàng</div>
                            </div>
                        </Link>
                    )}
                </div>
                {/* /action */}
            </div>
            <div className={cx('mainmenu')}>
                <ul>
                    <Link to={'/'}>
                        <li>Trang chủ</li>
                    </Link>

                    <li className={cx('menu_dropdown')}>
                        <span>Thương hiệu</span>
                        <div className={cx('dropdown_item')}>
                            <ul>
                                {brand.map((brand) => (
                                    <Link key={brand.id} to={`/product/brand/${brand.id}`}>
                                        <li>{brand.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </li>
                    <li className={cx('menu_dropdown')}>
                        <span>Danh mục</span>
                        <div className={cx('dropdown_item')}>
                            <ul>
                                {listCate.map((cate) => (
                                    <Link to={`/category/${cate.id}`} key={cate.id}>
                                        <li>{cate.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </li>

                    <Link to={'/order/all/get'}>
                        <li>Lịch sử mua hàng</li>
                    </Link>

                    {role && role.includes('ROLE_ADMIN') && (
                        <Link to={'/admin/dashboard'}>
                            <li>Đến trang quản trị</li>
                        </Link>
                    )}
                </ul>
            </div>
            <div className={cx('banner')}>
                <div>
                    <img src={require('~/assets/images/slider.webp')} alt="Banner 1" />
                </div>
            </div>
        </header>
    );
}

export default Header;
