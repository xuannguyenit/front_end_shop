import { Link } from 'react-router-dom';
import styles from './HeaderAdmin.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
const cx = classNames.bind(styles);

function HeaderAdmin() {
    return (
        <header className={cx('wrapper')}>
            {/* Phần trên của Header */}
            <div className={cx('top__header')}>
                {/* Logo */}
                <div className={cx('left__header')}>
                    <Link to="/" className={cx('logo')}>
                        <img src={require('~/assets/images/logo.webp')} alt="logo" />
                        <span>Admin Panel</span>
                    </Link>
                </div>
                {/* Tiêu đề */}
                <div className={cx('mid__header')}>
                    <h2>Trang quản trị</h2>
                </div>
                {/* Tài khoản người dùng */}
                <div className={cx('right__header')}>
                    <div className={cx('user__info')}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>Admin</span>
                    </div>
                </div>
            </div>
            {/* Thanh điều hướng phía dưới */}
            <nav className={cx('bottom__header')}>
                <ul>
                    <li>
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li>
                        <Link to="/users">Quản lý người dùng</Link>
                    </li>
                    <li>
                        <Link to="/settings">Cài đặt</Link>
                    </li>
                    <li>
                        <Link to="/reports">Báo cáo</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default HeaderAdmin;
