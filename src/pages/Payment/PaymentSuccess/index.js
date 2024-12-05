import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import * as cartService from '~/apiService/cartService';
import styles from './PaymentSuccess.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PaymentSuccess = () => {
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [listOrderDetai, setListOrderDetai] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState();
    const hasUpdatedStatus = useRef(false);

    const parseQueryString = (queryString) => {
        const params = new URLSearchParams(queryString);
        const data = {};
        for (const [key, value] of params.entries()) {
            data[key] = value;
        }
        return data;
    };

    // Lấy query string từ URL
    const queryString = location.search; // Ví dụ: ?vnp_Amount=...
    const paymentInfo = parseQueryString(queryString);

    // get order và trạng thái giao dịch transactionStatus từ query
    const vnp_TransactionStatus = paymentInfo.vnp_TransactionStatus;
    const orderId = paymentInfo.vnp_OrderInfo;
    //gọi api lấy ra chi tiêt đơn hàng:
    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                const response = await cartService.getOrderById(orderId);

                const orderData = response.result; // Thông tin đơn hàng từ API
                setOrder(orderData);
                setListOrderDetai(orderData.orderDetails); // Danh sách sản phẩm trong đơn hàng
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

    // set lại trạng thái cho order khi thanh toán thành công
    // useEffect(() => {
    //     const updateOrderStatus = async () => {
    //         if (vnp_TransactionStatus === '00') {
    //             // Kiểm tra trạng thái giao dịch thành công
    //             setLoading(true);
    //             try {
    //                 const response = await cartService.updateOrderStatus(orderId); // Cập nhật trạng thái
    //                 console.log('Trạng thái đơn hàng đã được cập nhật:', response);
    //             } catch (error) {
    //                 setError('Không thể cập nhật trạng thái đơn hàng.');
    //                 console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         } else {
    //             console.warn('Giao dịch không thành công, không cập nhật trạng thái đơn hàng.');
    //         }
    //     };

    //     updateOrderStatus();
    // }, [vnp_TransactionStatus, orderId]);

    // useEffect(() => {
    //     const updateOrderStatus = async () => {
    //         if (vnp_TransactionStatus === '00' && !hasUpdatedStatus.current) {
    //             hasUpdatedStatus.current = true; // Đánh dấu đã gọi API
    //             setLoading(true);
    //             try {
    //                 const response = await cartService.updateOrderStatus(orderId);
    //                 console.log('Trạng thái đơn hàng đã được cập nhật:', response);
    //             } catch (error) {
    //                 setError('Không thể cập nhật trạng thái đơn hàng.');
    //                 console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         } else if (vnp_TransactionStatus !== '00') {
    //             console.warn('Giao dịch không thành công, không cập nhật trạng thái đơn hàng.');
    //         }
    //     };

    //     if (orderId && vnp_TransactionStatus) {
    //         updateOrderStatus();
    //     }
    // }, [orderId, vnp_TransactionStatus]);
    useEffect(() => {
        const updateOrderStatus = async () => {
            // Kiểm tra xem đã cập nhật trạng thái đơn hàng chưa
            if (vnp_TransactionStatus === '00') {
                const hasUpdated = localStorage.getItem(`orderStatusUpdated_${orderId}`);

                if (hasUpdated) {
                    console.log('Trạng thái đơn hàng đã được cập nhật trước đó.');
                    return; // Nếu đã cập nhật, không gọi lại API
                }

                setLoading(true);
                try {
                    const response = await cartService.updateOrderStatus(orderId);
                    console.log('Trạng thái đơn hàng đã được cập nhật:', response);
                    localStorage.setItem(`orderStatusUpdated_${orderId}`, 'true'); // Lưu vào localStorage
                } catch (error) {
                    setError('Không thể cập nhật trạng thái đơn hàng.');
                    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.warn('Giao dịch không thành công, không cập nhật trạng thái đơn hàng.');
            }
        };

        if (orderId && vnp_TransactionStatus) {
            updateOrderStatus();
        }
    }, [orderId, vnp_TransactionStatus]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('info_payment')}>
                <h1>Thông tin thanh toán</h1>
                <ul>
                    <li>Số tiền: {paymentInfo.vnp_Amount}</li>
                    <li>Ngân hàng: {paymentInfo.vnp_BankCode}</li>
                    <li>Mã giao dịch ngân hàng: {paymentInfo.vnp_BankTranNo}</li>
                    <li>Loại thẻ: {paymentInfo.vnp_CardType}</li>
                    <li>Thông tin đơn hàng: {paymentInfo.vnp_OrderInfo}</li>
                    <li>Ngày thanh toán: {paymentInfo.vnp_PayDate}</li>
                    <li>Mã phản hồi: {paymentInfo.vnp_ResponseCode}</li>
                    <li>Mã giao dịch VNPAY: {paymentInfo.vnp_TransactionNo}</li>
                    <li>Trạng thái giao dịch: {paymentInfo.vnp_TransactionStatus}</li>
                </ul>
            </div>
            <div className={cx('info_order')}>
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

                    {listOrderDetai && listOrderDetai.length > 0 && (
                        <div className={cx('order-items')}>
                            <h3>Chi tiết đơn hàng</h3>
                            <ul>
                                {listOrderDetai.map((item) => (
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
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
