import styles from './AddAdmin.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import * as authen from '~/apiService/authenticationService';
import 'bootstrap/dist/css/bootstrap.min.css';
const cx = classNames.bind(styles);

function AddAdmin() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        dob: '',
        city: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra tên người dùng
        if (formData.username.length < 4) {
            newErrors.username = 'USERNAME_INVALID';
        }

        // Kiểm tra mật khẩu
        if (formData.password.length < 6) {
            newErrors.password = 'INVALID_PASSWORD';
        }

        // Kiểm tra email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            newErrors.email = 'INVALID_EMAIL';
        } else if (!formData.email) {
            newErrors.email = 'EMAIL_IS_REQUIRED';
        }

        // Kiểm tra ngày sinh (tối thiểu 10 tuổi)
        const today = new Date();
        const dob = new Date(formData.dob);
        const age = today.getFullYear() - dob.getFullYear();
        if (isNaN(age) || age < 10) {
            newErrors.dob = 'INVALID_DOB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (validateForm()) {
            try {
                const response = await authen.register(
                    formData.username,
                    formData.password,
                    formData.email,
                    formData.firstName,
                    formData.lastName,
                    formData.dob,
                    formData.city,
                );
                setSuccessMessage('Thêm thành công admin tétttttt');
                alert('Thêm thành công tài khoản admin');
                navigate('/admin/home');
                console.log('User response:', response);
            } catch (error) {
                setServerError(error.message || 'Lỗi xảy ra khi thêm quản trị viên');
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('title')}>
                    <h2>Thêm quản trị viên</h2>
                </div>
                <div className={cx('mainform')}>
                    <Container className={cx('formgroup')}>
                        <Row className="justify-content-md-center mt-12">
                            <Col xs={12} md={12}>
                                {serverError && <Alert variant="danger">{serverError}</Alert>}
                                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className={cx('form-item')} controlId="formUsername">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Tên người dùng</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="text"
                                                name="username"
                                                placeholder="Nhập tên người dùng"
                                                value={formData.username}
                                                onChange={handleChange}
                                                isInvalid={!!errors.username}
                                            />
                                        </div>

                                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className={cx('form-item')} controlId="formPassword">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Mật khẩu</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="password"
                                                name="password"
                                                placeholder="Nhập mật khẩu"
                                                value={formData.password}
                                                onChange={handleChange}
                                                isInvalid={!!errors.password}
                                            />
                                        </div>

                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className={cx('form-item')} controlId="formEmail">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Email</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="email"
                                                name="email"
                                                placeholder="Nhập email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                isInvalid={!!errors.email}
                                            />
                                        </div>

                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className={cx('form-item')} controlId="formFirstName">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Tên</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="text"
                                                name="firstName"
                                                placeholder="Nhập tên"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className={cx('form-item')} controlId="formLastName">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Họ</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="text"
                                                name="lastName"
                                                placeholder="Nhập họ"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className={cx('form-item')} controlId="formDob">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Ngày sinh</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                isInvalid={!!errors.dob}
                                            />
                                        </div>

                                        <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className={cx('form-item')} controlId="formCity">
                                        <div className={cx('form_label')}>
                                            <Form.Label>Thành phố</Form.Label>
                                        </div>
                                        <div className={cx('wraper_form-controll')}>
                                            <Form.Control
                                                className={cx('form-control')}
                                                type="text"
                                                name="city"
                                                placeholder="Nhập thành phố"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100">
                                        Đăng ký
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    );
}

export default AddAdmin;
