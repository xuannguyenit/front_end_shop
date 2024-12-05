import { useEffect, useState } from 'react';
import styles from './AllUser.module.scss';
import classNames from 'classnames/bind';
import * as userService from '~/apiService/userService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown, Alert } from 'react-bootstrap';

const cx = classNames.bind(styles);

function AllUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listUser, setListUser] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null); // Reset lỗi trước khi gọi API
            try {
                const results = await userService.getAllUser();
                setListUser(results);
                console.log('Danh sách user: ', results);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false); // Dừng trạng thái loading sau khi hoàn thành
            }
        };
        fetchUser();
    }, []);
    const handleEdit = (id) => {
        console.log('xử lý tại đây');
    };
    const handleDelete = (id) => {
        console.log('xử lý tại đây');
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {error.message}</p>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('title')}>
                    <h2>Danh sách user trong hệ thống</h2>
                </div>

                <div className={cx('group__content')}></div>
                <div className={cx('group__content')}>
                    <table>
                        <thead>
                            <tr>
                                <th>username</th>
                                <th>email</th>
                                <th>role</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        {listUser.map((user) => (
                            <tbody key={user.id}>
                                <tr>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.roles.map((role) => (
                                            <ul key={role.name} className={cx('ul_role')}>
                                                <li>Role : :</li>
                                                <li>
                                                    <li>{role.name}</li>
                                                </li>
                                                <li>
                                                    {role.permissions.map((per) => (
                                                        <ul key={per.name} className={cx('ul_role')}>
                                                            <li>Permission : : </li>
                                                            <li>
                                                                <li>{per.name}</li>
                                                            </li>
                                                        </ul>
                                                    ))}
                                                </li>
                                            </ul>
                                        ))}
                                    </td>
                                    <td>
                                        <div className={cx('action__table')}>
                                            <Button
                                                onClick={() => handleEdit(user.id)}
                                                className={cx('btn_action')}
                                                variant="warning"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(user.id)}
                                                className={cx('btn_action')}
                                                variant="danger"
                                            >
                                                khóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AllUser;
