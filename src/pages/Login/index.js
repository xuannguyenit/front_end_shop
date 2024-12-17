import React, { useState } from 'react';
import * as authen from '~/apiService/authenticationService'; // Import hàm login từ authenticationService
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// reactbostrap
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const cx = classNames.bind(styles);

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [token, setToken] = useState(null);
    const [expiryTime, setExpiryTime] = useState(null);
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const toastLoginSuccess = () => toast('Login Success!');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await authen.login(username, password); // Gọi hàm login từ authenticationService

            if (data) {
                // Lưu token và thời gian hết hạn vào state
                setToken(data.token);
                setExpiryTime(data.expiryTime);

                // Giải mã token để lấy role
                const payload = JSON.parse(atob(data.token.split('.')[1])); // Giải mã phần payload của token
                const userRole = payload.scope; // Lấy role từ payload
                const userId = payload.sub;
                // Lưu vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('expiryTime', data.expiryTime);
                localStorage.setItem('username', data.username); // lấy name từ api
                localStorage.setItem('role', userRole); // Lưu vai trò
                localStorage.setItem('userId', userId);
                console.log(userId);

                toastLoginSuccess();
                // Điều hướng đến trang chủ sau khi login thành công
                // Điều hướng dựa trên vai trò của người dùng
                if (userRole === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard'); // Điều hướng đến trang admin nếu là admin
                } else {
                    navigate('/'); // Điều hướng đến trang chủ nếu không phải admin
                }
            }
        } catch (error) {
            setError('Login failed, please try again.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('login-box')}>
                <h2>Đăng nhập</h2>
                {error && <p className={cx('error-message')}>{error}</p>}
                <form onSubmit={handleLogin} className={cx('form')}>
                    <div className={cx('form-group')}>
                        <label htmlFor="username" className={cx('label')}>
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={cx('input')}
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="password" className={cx('label')}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={cx('input')}
                        />
                    </div>
                    <button type="submit" className={cx('btn-login')}>
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
