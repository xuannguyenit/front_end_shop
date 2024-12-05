import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import * as cartService from '~/apiService/cartService'; // Import hàm gọi API
import styles from './Cart.module.scss';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Cart() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Thêm trạng thái xử lý hành động
    const [error, setError] = useState(null);
    const [listItem, setListItem] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    // Hàm tính tổng giá trị giỏ hàng
    const calculateTotalPrice = (items) => {
        return items.reduce((acc, item) => acc + item.totalPrice * item.productQuantity, 0);
    };

    // Gọi API để lấy giỏ hàng
    useEffect(() => {
        const fetchCartData = async () => {
            setLoading(true);
            try {
                const result = await cartService.getCartById(userId);
                console.log('API response:', result); // Kiểm tra cấu trúc dữ liệu trả về
                if (Array.isArray(result)) {
                    // Kiểm tra nếu result là một mảng
                    setListItem(result);
                    const total = calculateTotalPrice(result); // Tính tổng giá trị từ mảng result
                    setTotalPrice(total);
                } else {
                    setListItem([]); // Nếu không phải mảng, đặt thành mảng trống
                    setError('Dữ liệu giỏ hàng không hợp lệ.');
                }
            } catch (err) {
                setError('Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.');
                console.error('Error fetching cart:', err.message);
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [userId]);
    // thay đổi số lượng sản phẩm trong giỏ hàng

    const handleQuantityChange = async (itemId, action) => {
        // Đặt trạng thái đang xử lý để ngăn người dùng nhấp quá nhanh
        setActionLoading(true);

        // Tìm sản phẩm được cập nhật
        const currentItem = listItem.find((item) => item.id === itemId);
        if (!currentItem) {
            alert('Không tìm thấy sản phẩm trong giỏ hàng!');
            setActionLoading(false);
            return;
        }

        // Tính số lượng mới
        const newQuantity = action === 'increase' ? currentItem.productQuantity + 1 : currentItem.productQuantity - 1;

        // Không cho phép số lượng nhỏ hơn 1
        if (newQuantity < 1) {
            alert('Số lượng sản phẩm không thể nhỏ hơn 1.');
            setActionLoading(false);
            return;
        }

        try {
            await cartService.updateCart(itemId, newQuantity); // Gọi API cập nhật số lượng
            const updatedList = listItem.map((item) =>
                item.id === itemId ? { ...item, productQuantity: newQuantity } : item,
            );
            setListItem(updatedList);
            setTotalPrice(calculateTotalPrice(updatedList)); // Tính lại tổng tiền
        } catch (error) {
            console.error('Error updating cart item:', error.message);
            alert('Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setActionLoading(false); // Hoàn thành xử lý
        }
    };

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = async (itemId) => {
        setActionLoading(true);
        try {
            const isDeleted = await cartService.deleteCartItem(itemId);
            if (isDeleted) {
                const updatedList = listItem.filter((item) => item.id !== itemId);
                setListItem(updatedList);
                setTotalPrice(calculateTotalPrice(updatedList));
                alert('Sản phẩm đã được xóa thành công.');
            } else {
                alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại!');
        } finally {
            setActionLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // phần form đặt hàng
    const [orderDetails, setOrderDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        totalPrice: 0,
        shippingMethod: '',
        shippingAddress: '',
        trackingNumber: '',
        paymentMethod: '',
    });

    // Validate form khi submit
    const validateForm = () => {
        const { fullName, email, phone, address } = orderDetails;

        if (!fullName || !email || !phone || !address) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return false;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert('Email không hợp lệ.');
            return false;
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10,11}$/; // Giới hạn số điện thoại từ 10 đến 11 chữ số
        if (!phoneRegex.test(phone)) {
            alert('Số điện thoại không hợp lệ.');
            return false;
        }

        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ của form trước khi gửi
        if (!validateForm()) {
            return;
        }
        try {
            const respone = await cartService.createOrder(
                orderDetails.fullName,
                orderDetails.email,
                orderDetails.phone,
                orderDetails.address,
            );
            console.log('thêm order thành công');

            navigate(`/payment/${respone.id}`);
        } catch (error) {}

        console.log('Order submitted:', orderDetails);

        alert('Đơn hàng đã được gửi!');
        // navigate(`/payment/${respone.}`)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    if (loading) {
        return <div>Đang tải giỏ hàng...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={cx('cart')}>
            <div className={cx('cart_header')}>
                <h2>Giỏ hàng của bạn</h2>
            </div>
            <div className={cx('cart_items')}>
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listItem.map((item) => (
                            <tr key={item.id}>
                                <td>{item.productName}</td>
                                <td>
                                    <div className={cx('quantity-controls')}>
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleQuantityChange(item.id, 'decrease')}
                                        >
                                            -
                                        </button>
                                        <span>{item.productQuantity}</span>
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleQuantityChange(item.id, 'increase')}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>{formatPrice(item.productPrice)}</td>
                                <td>
                                    <button disabled={actionLoading} onClick={() => handleRemoveItem(item.id)}>
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={cx('cart_footer')}>
                <div className={cx('total-price')}>
                    <p>Tổng tiền (đã tính khuyến mãi): {formatPrice(totalPrice)}</p>
                </div>
                <div className={cx('action-buttons')}>
                    <button className={cx('close-cart')}>Đóng</button>
                </div>
            </div>
            <div className={cx('form_order')}>
                <form onSubmit={handleSubmit}>
                    <div className={cx('group_item')}>
                        <div className={cx('form-group')}>
                            <label>Họ và tên:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={orderDetails.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={orderDetails.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                            />
                        </div>
                    </div>

                    <div className={cx('group_item')}>
                        <div className={cx('form-group')}>
                            <label>Số điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                value={orderDetails.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label>Địa chỉ người nhận:</label>
                            <input
                                name="address"
                                value={orderDetails.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                                required
                            ></input>
                        </div>
                    </div>
                    <div className={cx('group_item')}>
                        <div className={cx('form-group')}>
                            <label>Phương thức vận chuyển:</label>
                            <input
                                type="text"
                                name="shippingMethod"
                                value={orderDetails.shippingMethod}
                                onChange={handleChange}
                                placeholder="Nhập phương thức vận chuyển"
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label>Phương thức thanh toán:</label>
                            <input
                                type="text"
                                name="paymentMethod"
                                value={orderDetails.paymentMethod}
                                onChange={handleChange}
                                placeholder="Nhập phương thức thanh toán"
                            />
                        </div>
                    </div>

                    <button type="submit" className={cx('checkout')}>
                        Đặt hàng
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Cart;
