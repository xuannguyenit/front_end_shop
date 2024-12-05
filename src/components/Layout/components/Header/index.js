import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCartShopping, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.cjs';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(''); // Thêm state để lưu vai trò người dùng
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const username = localStorage.getItem('username'); // Lấy thông tin người dùng từ localStorage
            const userRole = localStorage.getItem('role'); // Lấy vai trò từ localStorage
            if (username && userRole) {
                setUserName(username);
                setRole(userRole); // Lưu vai trò vào state
                setIsLoggedIn(true);
            }
        }
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(savedCart.length); // Cập nhật số lượng mặt hàng trong giỏ
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role'); // Xóa vai trò khi đăng xuất
        setIsLoggedIn(false);
        setRole(''); // Đặt lại vai trò khi đăng xuất
        navigate('/');
    };

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
                            <li>
                                <Link to={'/profile'}>Profile</Link>
                            </li>
                            <li>
                                <Link to={'/upload'}>Home</Link>
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
                    <input className={cx('search__input')} placeholder="search" spellCheck={false} />
                    <button className={cx('search-clear')}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    <FontAwesomeIcon icon={faSpinner} className={cx('loading')} />
                    <Tippy content="Tìm kiếm" placement="right">
                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </Tippy>
                </div>
                {/* /input search */}
                {/* action */}
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
                    <Link to={`/cart/${userId}`}>
                        <div className={cx('cart')}>
                            <div className={cx('cart_icon')}>
                                <FontAwesomeIcon icon={faCartShopping} />
                            </div>
                            <span className={cx('cart__count')}>0</span>
                            <div className={cx('cart__title')}>Giỏ hàng</div>
                        </div>
                    </Link>
                </div>
                {/* /action */}
            </div>
            <div className={cx('mainmenu')}>
                <ul>
                    <li>
                        <Link to={'/'}>Trang chủ</Link>
                    </li>
                    <li>
                        <Link to={'/'}>Thương hiệu</Link>
                    </li>
                    <li>
                        <Link to={'/'}>Danh mục sản phẩm</Link>
                    </li>
                    <li>
                        <Link to={'/order/all/get'}>Thông tin mua sắm</Link>
                    </li>

                    {role === 'ROLE_ADMIN' && (
                        <li>
                            <Link to={'/admin/home'}>Đến trang quản trị</Link>
                        </li>
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
