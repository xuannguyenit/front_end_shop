import styles from './SidebarAdmin.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SidebarAdmin() {
    const [openCategory, setOpenCategory] = useState(false);
    const [openBrands, setOpenBrands] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);
    const [openDiscount, setOpenDiscount] = useState(false);
    const [openUser, setOpenUser] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);

    return (
        <div className={cx('wrapper')}>
            <aside className={cx('sidebar')}>
                <div className={cx('siderbar__title')}>
                    <h2>Admin Panel</h2>
                </div>
                <div className={cx('menu__siderbar')}>
                    <ul>
                        <li>Dashboard</li>

                        <li>
                            <Link to={'/admin/addimage'}>UpLoad Images</Link>
                        </li>
                        <li className={cx({ open: openUser })} onClick={() => setOpenUser(!openUser)}>
                            <span>Users</span>
                            {openUser && (
                                <ul>
                                    <Link to={'/admin/users'}>
                                        <li>All_user</li>
                                    </Link>
                                    <Link to={'/admin/users/add'}>
                                        <li>Add_user</li>
                                    </Link>
                                </ul>
                            )}
                        </li>
                        <li className={cx({ open: openOrder })} onClick={() => setOpenOrder(!openOrder)}>
                            <span>Order manager</span>
                            {openOrder && (
                                <ul>
                                    <Link to={'/admin/order/all'}>
                                        <li>All Orders</li>
                                    </Link>
                                </ul>
                            )}
                        </li>

                        <li className={cx({ open: openCategory })} onClick={() => setOpenCategory(!openCategory)}>
                            <span>Category</span>
                            {openCategory && (
                                <ul>
                                    <Link to={'/admin/category/add'}>
                                        <li>add_category</li>
                                    </Link>
                                    <Link to={'/admin/category'}>
                                        <li>all_category</li>
                                    </Link>
                                </ul>
                            )}
                        </li>

                        <li className={cx({ open: openBrands })} onClick={() => setOpenBrands(!openBrands)}>
                            <span>Brands</span>
                            {openBrands && (
                                <ul>
                                    <Link to={'/admin/brand/add'}>
                                        <li>add_brand</li>
                                    </Link>
                                    <Link to={'/admin/brand'}>
                                        <li>all_brand</li>
                                    </Link>
                                </ul>
                            )}
                        </li>
                        <li className={cx({ open: openDiscount })} onClick={() => setOpenDiscount(!openDiscount)}>
                            <span>DiscountCode</span>
                            {openDiscount && (
                                <ul>
                                    <Link to={'/admin/discount'}>
                                        <li>add_brand</li>
                                    </Link>
                                </ul>
                            )}
                        </li>

                        <li className={cx({ open: openProduct })} onClick={() => setOpenProduct(!openProduct)}>
                            <span>Product</span>
                            {openProduct && (
                                <ul>
                                    <Link to={'/admin/product/add'}>
                                        <li>add_Product</li>
                                    </Link>

                                    <Link to={'/admin/product'}>
                                        <li>All_product</li>
                                    </Link>
                                </ul>
                            )}
                        </li>

                        <li>Orders</li>
                        <li>Settings</li>
                        <li>Logout</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default SidebarAdmin;
