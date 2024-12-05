import { Link } from 'react-router-dom';
import styles from './HeaderAdmin.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function HeaderAdmin() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('top__header')}>
                <div className={cx('left__header')}></div>
                <div className={cx('mid__header')}>
                    <h2>Trang quản trị </h2>
                </div>
                <div className={cx('right__header')}></div>
            </div>
            <div className={cx('bottom__header')}>
                <ul>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default HeaderAdmin;
