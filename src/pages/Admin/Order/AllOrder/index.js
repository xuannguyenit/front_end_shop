import { useEffect, useState } from 'react';
import styles from './AllOrder.module.scss';
import classNames from 'classnames/bind';
import * as orderService from '~/apiService/orderService';

const cx = classNames.bind(styles);

function Order() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [listOrder, setListOrder] = useState([]);

    useEffect(() => {
        const fecthAllOrder = async () => {
            setLoading(true);
            try {
                const response = await orderService.getAllOrder();
                setListOrder(response);
            } catch (error) {
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                console.error('Error fetching:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fecthAllOrder();
    }, []);
    if (loading) {
        return <div>Đang tải danh sách đơn hàng...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (listOrder.length === 0) {
        return <div>Không có đơn hàng nào.</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h2>Thống kê các đơn hàng</h2>
            </div>
            <div className={cx('order-list')}>
                {listOrder.map((order) => (
                    <div key={order.id} className={cx('order-item')}>
                        <div className={cx('order-summary')}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tài Khoản</th>
                                        <th>Người Nhận Hàng</th>
                                        <th>Địa Chỉ Nhận Hàng</th>
                                        <th>Thời Gian Đặt Hàng</th>
                                        <th>Tổng Tiền</th>
                                        <th>Trạng Thái Đơn Hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{order.userId}</td>
                                        <td>{order.fullName}</td>
                                        <td>{order.address}</td>
                                        <td>{order.orderTime}</td>
                                        <td>{order.totalPrice} VNĐ</td>
                                        <td> {order.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <details className={cx('order-details')}>
                            <summary>Xem chi tiết đơn hàng</summary>
                            <table className={cx('order-details-table')}>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá gốc</th>
                                        <th>Khuyến mãi</th>
                                        <th>Số lượng</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderDetails.map((detail) => (
                                        <tr key={detail.id}>
                                            <td>{detail.productName}</td>
                                            <td>{detail.productPrice} VNĐ</td>
                                            <td>{detail.productSalePrice} %</td>
                                            <td>{detail.productQuantity}</td>
                                            <td>{detail.totalPrice} VNĐ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Order;
