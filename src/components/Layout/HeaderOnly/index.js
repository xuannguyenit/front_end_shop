import Header from '~/components/Layout/components/Header';
import styles from './HeaderOnly.module.scss';
import classNames from 'classnames/bind';
import Footer from '../components/Footer';
const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('main')}>
                <Header />
                <div className={cx('container')}>
                    <div className={cx('content')}>{children}</div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default HeaderOnly;
