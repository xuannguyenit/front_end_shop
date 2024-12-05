import styles from './FooterAdmin.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function FooterAdmin() {
    return (
        <footer className={cx('wrapper')}>
            <footer className={cx('footer')}>
                <div className={cx('footer-content')}>
                    <p className={cx('copyright')}>© 2024 My Website. All rights reserved.</p>
                    <div className={cx('links')}>
                        <a href="/about" className={cx('link')}>
                            About Us
                        </a>
                        <a href="/contact" className={cx('link')}>
                            Contact
                        </a>
                        <a href="/privacy" className={cx('link')}>
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </footer>
        </footer>
    );
}

export default FooterAdmin;
