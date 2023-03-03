
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import images from '~/assets/images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)

function Header() {
    return <div className={cx('header-page')} id="header">
                <div className={cx('header-main', 'div-center-item')}>
                    <img className={cx('logo')} alt="RYNAN" width="110" src={images.logo}/>
                    <div className={cx('text', 'text-uppercase', 'textmb')}>DIPE</div>
                        <div className={cx('div-center-item')}>
                            <div className={cx('text-white')}>
                                <Link style={{display: 'flex', alignItems: 'center'}} to={"#"} >
                                    <img alt="" width={'35'} className={cx('img-circle', 'margin-right-5')} src={images.default}/><span
                                        className={cx('padding-right-5')} id="username" style={{color: "white"}}>khoa.luu</span>
                                        <FontAwesomeIcon icon={faAngleDown}/>    
                                </Link>
                            </div>
                            <div className={cx('img-circle', 'margin-left-30', 'margin-right-10', 'account', 'logout')}>
                                <Link  id="btnLogout" aria-hidden="true" to={'/login'}>
                                    <FontAwesomeIcon style={{fontSize: '24px'}} icon={faRightFromBracket}/>
                                </Link>
                            </div>
                            <div className={cx('header-split', 'margin-left-15', 'margin-right-10')}></div>
                            <div className={cx('margin-right-10', 'menu-grid')} >
                                <FontAwesomeIcon style={{fontSize: '24px'}} icon={faBars}/>
                            </div>
                        </div>
                </div>
            </div>
}

export default Header;
