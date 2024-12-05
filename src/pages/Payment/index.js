import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as cartService from '~/apiService/cartService'; // Service gọi API đơn hàng
import styles from './Payment.module.scss';
import classNames from 'classnames/bind';
import * as paymentService from '~/apiService/paymentService';

const cx = classNames.bind(styles);

function Payment() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null); // Thông tin chung của đơn hàng
    const [orderDetails, setOrderDetails] = useState([]); // Danh sách chi tiết đơn hàng
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy thông tin đơn hàng từ API
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await cartService.getOrderById(orderId);

                const orderData = response.result; // Thông tin đơn hàng từ API
                setOrder(orderData);
                setOrderDetails(orderData.orderDetails); // Danh sách sản phẩm trong đơn hàng
                console.log('Thông tin của order:', orderData);
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán.');
            return;
        }

        try {
            const response = await paymentService.checkout(order.id);
            console.log(response);

            if (response && response.url) {
                window.location.href = response.url;
            } else {
                alert('Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.');
            }
        } catch (err) {
            console.error('Lỗi khi thanh toán:', err);
            alert('Có lỗi xảy ra trong quá trình thanh toán.');
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('payment')}>
                <h2>Thanh toán đơn hàng</h2>
                {order && (
                    <div className={cx('order-details')}>
                        <p>
                            <strong>Mã đơn hàng:</strong> {order.id}
                        </p>
                        <p>
                            <strong>Người nhận:</strong> {order.fullName}
                        </p>
                        <p>
                            <strong>Email:</strong> {order.email}
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong> {order.phone}
                        </p>
                        <p>
                            <strong>Địa chỉ giao hàng:</strong> {order.address}
                        </p>
                        <p>
                            <strong>Tổng tiền:</strong> {order.totalPrice} VND
                        </p>
                    </div>
                )}

                {orderDetails && orderDetails.length > 0 && (
                    <div className={cx('order-items')}>
                        <h3>Chi tiết đơn hàng</h3>
                        <ul>
                            {orderDetails.map((item) => (
                                <li key={item.id} className={cx('order-item')}>
                                    <p>
                                        <strong>Tên sản phẩm:</strong> {item.productName}
                                    </p>
                                    <p>
                                        <strong>Giá:</strong> {item.productPrice} VND
                                    </p>
                                    <p>
                                        <strong>Số lượng:</strong> {item.productQuantity}
                                    </p>
                                    <p>
                                        <strong>Giảm giá:</strong> {item.productSalePrice}%
                                    </p>
                                    <p>
                                        <strong>Tổng tiền:</strong> {item.totalPrice} VND
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={cx('payment-method')}>
                    <h3>Chọn phương thức thanh toán</h3>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="creditCard"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Thẻ tín dụng
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="bankTransfer"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Chuyển khoản ngân hàng
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Thanh toán khi nhận hàng (COD)
                    </label>
                </div>
                <button onClick={handlePayment} className={cx('submit-payment')}>
                    Xác nhận thanh toán
                </button>
            </div>
        </div>
    );
}

export default Payment;
