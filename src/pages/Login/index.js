
import { useSelector } from 'react-redux';
import classNames from "classnames/bind";
import styles from './Login.module.scss'
import images from "~/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';


const cx = classNames.bind(styles)

function Login() {
    
    const { unique_string, proxy } = useSelector( state => state );

    const [ auth, setAuth ] = useState({});

    const enterTriggered = (e) => {
        if( e.keyCode === 13 ){
            submit()
        }
    }
    /* Error modals */

    const submit = () => {

        if( auth.account_string && auth.pwd_string ){
            fetch(`${proxy}/${ unique_string }/login`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(auth)
            })
            .then( res => res.json() )
            .then( (data) => {
                const { success, message, role, _token, credential_string } = data;
                if( success ){
                    localStorage.setItem("_token", _token)
                    localStorage.setItem("credential_string", credential_string)

                    window.location ="/"

                }
            })
        }
    }


    return <div className={cx('lg-header', 'flex-container', 'flex-container-column')}>
            <div className={cx('lg-main', 'group-input-info')}>
                <div className={cx('form-lg')} style={{textAlign: 'center'}}>
                    <img className={cx('img-login')} src={images.logo} width="200" style={{marginLeft: '10px'}} />
                    <h2 className={cx('title-1')} style={{marginBottom: '10px'}}>DIPE</h2>
                    <h2 className="title-2" style={{marginTop: '5px'}}> DIGITAL INDUSTRIAL PLATFORM ECO-SYSTEM</h2>
                    <form  action="" acceptCharset="UTF-8"  id="loginForm">
                        <div className={cx('form-lg-sub')}>
                            <input type='text'  onKeyUp = { enterTriggered }
                                onChange = {(e) => { setAuth({...auth, account_string: e.target.value }) }}  style={{width:'100%'}} placeholder='Tài khoản'
                                   />
                            <div className={cx('icon-lg')}>
                                <FontAwesomeIcon icon={faUser}/>
                                <span id="error_userCode" className={cx('text-danger')}></span>
                            </div>
                        </div>

                        <div className={cx('form-lg-sub', 'no-margin-bottom')}>
                            <input type="password"  onKeyUp = { enterTriggered }
                                onChange = {(e) => { setAuth({...auth, pwd_string: e.target.value }) }} style={{width: '100%'}} placeholder="Mật khẩu"
                                      />
                            <div className={cx('icon-lg')}>
                                <FontAwesomeIcon icon={faUnlockAlt} aria-hidden="true"/>
                                <span id="error_Password" className={cx('text-danger')}></span>
                            </div>

                        </div>
                        
                        <div className={cx('clear')}></div>
                        <div className={cx('sso-btn', 'mr-top-5')}>
                            <div className={cx('default-login-group')}>
                                <a type="button" id="btnLogin" onClick={submit}  name="btnLogin"
                                    className={cx('btnLogin')} style={{borderRadius: '0'}}>Đăng nhập</a>
                            </div>

                        </div>
                        <div className={cx("line-login")}>
                            <hr />
                        </div>
                        <div className={cx('copyright')}>
                            <p className={cx('title-dipe')}><a href="" target="_blank" style={{color: 'white'}}>DIPE
                                    </a></p>
                        </div>
                        <div className={cx('copyright')}>
                            <p className={cx('title-company')}> © 2023 <a href="" target="_blank">
                                    MYLAN<sup style={{top: '-5px',fontSize: '50%'}}>®</sup> GROUP </a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
}

export default Login;