import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as orderService from '~/apiService/orderService';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';
import * as productService from '~/apiService/productService';
import * as userService from '~/apiService/userService';

const cx = classNames.bind(styles);

function Dashboard() {
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(1); // Mặc định tháng 1
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại
    const [countProduct, setCountProduct] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [countOrder, setCountOrder] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await orderService.getDailyRevenueForMonth(selectedMonth, selectedYear);
                const resultCount = await productService.getCountProduct();
                const resultTotalRevenue = await orderService.getTotalRevenu();
                const resultTotalCountOrder = await orderService.getTotalCountOrder();
                const resultTotalUser = await userService.getCountUser();

                if (resultCount) {
                    setCountProduct(resultCount);
                } else {
                    setCountProduct(0);
                }
                if (resultTotalRevenue) {
                    setTotalRevenue(resultTotalRevenue);
                } else {
                    setTotalRevenue(0);
                }
                setCountOrder(resultTotalCountOrder);
                setTotalUser(resultTotalUser);
                if (result) {
                    setDailyRevenue(result);
                } else {
                    setDailyRevenue([]);
                }
            } catch (error) {
                console.error('Error fetching revenue data:', error);
                setDailyRevenue([]);
            }
        };
        fetchData();
    }, [selectedMonth, selectedYear]);

    return (
        <div className={cx('wrapper')}>
            {/* Header */}
            <div className={cx('header')}>
                <h1>Dashboard</h1>
            </div>

            {/* Cards */}
            <div className={cx('cards')}>
                <div className={cx('card')}>
                    <h3>Số lượng sản phẩm</h3>
                    <p>{countProduct}</p>
                </div>
                <div className={cx('card')}>
                    <h3>Số lượng hóa đơn</h3>
                    <p>{countOrder}</p>
                </div>
                <div className={cx('card')}>
                    <h3>Tổng doanh thu</h3>
                    <p>{formatPrice(totalRevenue.revenue)}</p>
                </div>
                <div className={cx('card')}>
                    <h3>Khách hàng mới</h3>
                    <p>{totalUser}</p>
                </div>
            </div>

            {/* Filters */}
            <div className={cx('filters')}>
                <label>
                    Chọn tháng:
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Chọn năm:
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={2020 + i}>
                                {2020 + i}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Revenue Chart */}
            <div className={cx('details')}>
                <h2>Thống kê doanh thu hàng tháng</h2>
                {dailyRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={dailyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" label={{ value: 'Ngày', position: 'insideBottom' }} />
                            <YAxis
                                label={{ value: 'Doanh thu (VNĐ)', angle: -90, position: 'insideLeft' }}
                                tickFormatter={(value) => value.toLocaleString('vi-VN')}
                            />
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                            <Bar dataKey="totalRevenue" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className={cx('no-data')}>
                        Không có dữ liệu doanh thu cho tháng {selectedMonth} năm {selectedYear}.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
