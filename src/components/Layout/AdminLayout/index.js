import FooterAdmin from '../components/FooterAdmin';
import HeaderAdmin from '../components/HeaderAdmin';
import SidebarAdmin from '../components/SidebarAdmin';
import styles from './AdminLayout.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    console.log(children);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('main')}>
                <HeaderAdmin />
                <div className={cx('container')}>
                    <SidebarAdmin />
                    <div className={cx('content')}>{children}</div>
                </div>
                <FooterAdmin />
            </div>
        </div>
    );
}

export default AdminLayout;
