import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import * as cartService from '~/apiService/cartService'; // Import hàm gọi API
import styles from './Cart.module.scss';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as provinceService from '~/apiService/provinceService';
// import { ToastContext } from '~/context/ToastProvider';

const cx = classNames.bind(styles);

function Cart() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Thêm trạng thái xử lý hành động
    const [error, setError] = useState(null);
    const [listItem, setListItem] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [listProvince, setListProvince] = useState([]); // lấy danh sách tỉnh
    const [listDistrict, setListDistrict] = useState([]); // lấy danh sách huyện
    const [listWard, setListWard] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState(null); // Khai báo state cho selectedProvinceId
    const [selectedDistrictId, setSelectedDistrictId] = useState(null); // Khai báo state cho selectedDistrictId
    const [provinceCache, setProvinceCache] = useState({}); // Cache dữ liệu tỉnh thành
    const [selectedWardId, setSelectedWardId] = useState(null);
    // const { toast } = useContext(ToastContext);
    // const alertToastSuccess = () => {
    //     toast.success('Success');
    // };
    // const alertToastError = () => {
    //     toast.error('error');
    // };

    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    // Hàm tính tổng giá trị giỏ hàng

    const calculateTotalPrice = (items) => {
        if (!Array.isArray(items)) {
            return 0; // Trả về 0 nếu danh sách sản phẩm không hợp lệ
        }
        return items.reduce((total, item) => {
            const originalPrice = item.productPrice || 0; // Giá gốc
            const discount = item.discountPercentage || 0; // % Khuyến mãi
            const discountedPrice = originalPrice - (originalPrice * discount) / 100; // Giá sau khuyến mãi
            const quantity = item.productQuantity || 0; // Số lượng
            return total + discountedPrice * quantity; // Tổng cộng
        }, 0);
    };

    const fetchAddress = async (cityId, districtId) => {
        setLoading(true);
        try {
            // Kiểm tra xem tỉnh đã có trong cache chưa
            if (!provinceCache[cityId]) {
                const resultProvince = await provinceService.getProvince();
                setListProvince(resultProvince);
                setProvinceCache((prevCache) => ({ ...prevCache, [cityId]: resultProvince }));
            }

            if (cityId) {
                // Kiểm tra xem huyện đã có trong cache chưa
                if (!provinceCache[cityId]?.district) {
                    const resultDistrict = await provinceService.getdistrict(cityId);
                    setListDistrict(resultDistrict);
                    setProvinceCache((prevCache) => ({
                        ...prevCache,
                        [cityId]: { ...prevCache[cityId], district: resultDistrict },
                    }));
                }

                if (districtId) {
                    const resultWard = await provinceService.getWard(districtId);
                    setListWard(resultWard);
                }
            }
        } catch (error) {
            console.error('Không thể tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddress(); // Gọi hàm khi load trang
    }, []);

    const handleProvinceChange = (e) => {
        const selectedCityId = e.target.value;
        setSelectedProvinceId(selectedCityId);
        setListWard([]);
        setListDistrict([]);
        fetchAddress(selectedCityId);

        // Cập nhật địa chỉ
        if (selectedCityId && selectedDistrictId) {
            const selectedProvince = listProvince.find((province) => province.id === selectedCityId);
            const selectedDistrict = listDistrict.find((district) => district.id === selectedDistrictId);
            const selectedWard = listWard.find((ward) => ward.id === selectedWardId);

            const address = `${selectedProvince?.name || ''} - ${selectedDistrict?.name || ''} - ${
                selectedWard?.name || ''
            }`;
            setOrderDetails((prevDetails) => ({ ...prevDetails, address }));
        }
    };

    const handleDistrictChange = (e) => {
        const selectedDistrictId = e.target.value;
        setSelectedDistrictId(selectedDistrictId);
        fetchAddress(selectedProvinceId, selectedDistrictId);

        // Cập nhật địa chỉ
        if (selectedProvinceId && selectedDistrictId) {
            const selectedProvince = listProvince.find((province) => province.id === selectedProvinceId);
            const selectedDistrict = listDistrict.find((district) => district.id === selectedDistrictId);
            const selectedWard = listWard.find((ward) => ward.id === selectedWardId);

            const address = `${selectedProvince?.name || ''} - ${selectedDistrict?.name || ''} - ${
                selectedWard?.name || ''
            }`;
            setOrderDetails((prevDetails) => ({ ...prevDetails, address }));
        }
    };

    const handleWardChange = (e) => {
        const selectedWardId = e.target.value;
        setSelectedWardId(selectedWardId);

        // Cập nhật địa chỉ
        if (selectedProvinceId && selectedDistrictId && selectedWardId) {
            const selectedProvince = listProvince.find((province) => province.id === selectedProvinceId);
            const selectedDistrict = listDistrict.find((district) => district.id === selectedDistrictId);
            const selectedWard = listWard.find((ward) => ward.id === selectedWardId);

            const address = `${selectedProvince?.name || ''} - ${selectedDistrict?.name || ''} - ${
                selectedWard?.name || ''
            }`;
            setOrderDetails((prevDetails) => ({ ...prevDetails, address }));
        }
    };

    useEffect(() => {
        const fetchCartData = async () => {
            setLoading(true);
            try {
                const result = await cartService.getCartById(userId);
                if (Array.isArray(result)) {
                    setListItem(result);
                    setTotalPrice(calculateTotalPrice(result)); // Sử dụng hàm đã viết lại
                } else {
                    setListItem([]);
                    setError('Dữ liệu giỏ hàng không hợp lệ.');
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

    const handleQuantityChange = async (itemId, action) => {
        setActionLoading(true);

        const currentItem = listItem.find((item) => item.id === itemId);
        if (!currentItem) {
            // alertToastError();
            setActionLoading(false);
            return;
        }

        const newQuantity = action === 'increase' ? currentItem.productQuantity + 1 : currentItem.productQuantity - 1;
        if (newQuantity < 1) {
            // alertToastError();
            setActionLoading(false);
            return;
        }

        try {
            await cartService.updateCart(itemId, newQuantity);
            const updatedList = listItem.map((item) =>
                item.id === itemId ? { ...item, productQuantity: newQuantity } : item,
            );
            setListItem(updatedList);
            setTotalPrice(calculateTotalPrice(updatedList)); // Tính lại tổng tiền
        } catch (error) {
            console.error('Error updating cart item:', error.message);
            // alertToastError();
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setActionLoading(true);
        try {
            const isDeleted = await cartService.deleteCartItem(itemId);
            if (isDeleted) {
                const updatedList = listItem.filter((item) => item.id !== itemId);
                setListItem(updatedList);
                setTotalPrice(calculateTotalPrice(updatedList)); // Tính lại tổng tiền
            } else {
                // alertToastError();
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            // alertToastError();
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

        // Lấy tổng giá trị giỏ hàng trước khi gửi
        const updatedOrderDetails = { ...orderDetails, totalPrice };

        // Kiểm tra tính hợp lệ của form trước khi gửi
        if (!validateForm()) {
            return;
        }

        try {
            const respone = await cartService.createOrder(
                updatedOrderDetails.fullName,
                updatedOrderDetails.email,
                updatedOrderDetails.phone,
                updatedOrderDetails.address,
                updatedOrderDetails.totalPrice,
            );

            console.log(respone.result);

            navigate(`/payment/${respone.id}`);
        } catch (error) {
            console.error('Error creating order:', error);
            // alertToastError();
        }
    };
    useEffect(() => {
        setTotalPrice(calculateTotalPrice(listItem));
    }, [listItem]);

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
                            <th>Giá gốc</th>
                            <th>Khuyến mãi</th>
                            <th>Giá bán</th>
                            <th>Tổng tiền</th>
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
                                <td>{item.discountPercentage} %</td>
                                <td>{item.productPrice - (item.discountPercentage * item.productPrice) / 100}</td>
                                {/* <td>{item.totalPrice}</td> */}
                                <td>
                                    {formatPrice(
                                        (item.productPrice - (item.discountPercentage * item.productPrice) / 100) *
                                            item.productQuantity,
                                    )}
                                </td>

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
                            <label>Phương thức vận chuyển:</label>
                            <input
                                type="text"
                                name="shippingMethod"
                                value={'VNPAY'}
                                onChange={handleChange}
                                placeholder="Nhập phương thức vận chuyển"
                            />
                        </div>
                    </div>
                    <div className={cx('group_item')}>
                        <div className={cx('form-group')}>
                            <label>Phương thức thanh toán:</label>
                            <input
                                type="text"
                                name="paymentMethod"
                                value={'VNPAY'}
                                onChange={handleChange}
                                placeholder="Nhập phương thức thanh toán"
                            />
                        </div>
                    </div>
                    <div className={cx('group_item')}>
                        <div className={cx('form-group')}>
                            <label>Tỉnh/Thành phố:</label>
                            <select name="province" onChange={handleProvinceChange} value={selectedProvinceId}>
                                <option value="{''}">Chọn tỉnh thành</option>
                                {listProvince.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('form-group')}>
                            <label>Huyện/Quận:</label>
                            <select
                                name="district"
                                onChange={handleDistrictChange}
                                value={selectedDistrictId}
                                disabled={!selectedProvinceId}
                            >
                                <option value="{''}">Chọn huyện/quận</option>
                                {listDistrict.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('form-group')}>
                            <label>Phường/Xã:</label>
                            <select
                                name="ward"
                                value={orderDetails.ward} // Lưu giá trị phường/xã vào orderDetails
                                onChange={handleWardChange}
                                required
                            >
                                <option value="{''}">Chọn phường/xã</option>
                                {listWard.map((ward) => (
                                    <option key={ward.id} value={ward.id}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
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
