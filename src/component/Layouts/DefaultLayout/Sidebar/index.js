import classNames from 'classnames/bind'
import styles from './Sidebar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple, faDatabase, faObjectGroup, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


const cx = classNames.bind(styles)

function Sidebar() {
    return <div className={cx('sidebar', 'sidebarmb')} id="slider">
    <ul className={cx('nav', 'group-menu')}>
        <li id="tongquan" className={cx('nav-item', 'active')}>
            <Link className={cx('nav-link')} to={"#"}>
                <p>
                    <FontAwesomeIcon icon={faChartSimple}/>&nbsp;&nbsp;Tổng quan
                </p>
            </Link>
        </li>
        <li id="duan" className={cx('nav-item')}>
            <Link className={cx('nav-link')} to={"/database"}>
                <p> 
                    <FontAwesomeIcon icon={faDatabase}/>&nbsp;&nbsp;Cơ sở dữ liệu
                </p>
            </Link>
        </li>

        <li id="thietbi" className={cx('nav-item')}>
            <Link className={cx('nav-link')} to={"#"}>
                <p>
                    <FontAwesomeIcon icon={faObjectGroup}/>&nbsp;Thiết kế
                </p>        
            </Link>
        </li>
           
        <li id="user" className={cx('nav-item')}>
            <Link className={cx('nav-link')} to={"/user"}>
                <p>
                    <FontAwesomeIcon icon={faUser}/>&nbsp;Người dùng
                </p>
            </Link>
        </li>
    </ul>
</div>
}

export default Sidebar;