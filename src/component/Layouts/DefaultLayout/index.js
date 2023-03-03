import classNames from 'classnames/bind'
import styles from './DefaultLayout.module.scss';
import Header from '~/component/Layouts/component/Header';
import Sidebar from './Sidebar';
 const cx = classNames.bind(styles)

function DefaultLayout({children}) {
    return ( 
        <div className={cx('container')}>
            <Header />
            <Sidebar />
                <div className={cx('content')}>{children}</div>
        </div>
     );
}

export default DefaultLayout;