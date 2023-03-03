import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";     
import { Link } from 'react-router-dom';


function Adduser() {
        const MySwal = withReactContent(Swal)
        const _token = localStorage.getItem("_token");
        const { unique_string, proxy } = useSelector( state => state );
        const [account_string, setUsername] = useState('');
        const [pwd_string, setPassword] = useState('');
      
        const handleCreateUser = async(event) => {
          const url = '';
          const value = { account_string, pwd_string };
          
          event.preventDefault();
          const response = await fetch(`${proxy}/${unique_string}/create_user`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              "Authorization": _token, 
          },
            body: JSON.stringify(value)
          })
          const data = await response.json();
            if (data.success == true) {
              MySwal.fire({
                title: <strong>Thêm</strong>,
                text: data.content,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              })
            } else {
              MySwal.fire({
                title: <strong>Thêm</strong>,
                text: data.content,
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
              })
            }
          }
        return (
            <div className='main-panel'>
              <div className='row'>
                <div className='panel-box'>
                  <div className='panel-box-header'>
                    <span className='panel-label-header'>Thêm mới người dùng</span>
                  </div>
                  <div className='panel-box-body'>
                    <div className='row'>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >Tên người dùng</label>
                        <input type='text' className='form-control pt-8' required value={account_string} onChange={(event) => setUsername(event.target.value)} ></input>
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Nhập mật khẩu </label>
                        
                          <input type='password' className='form-control pt-8' value={pwd_string} onChange={(event) => setPassword(event.target.value)} ></input>
                        
                      </div>
                    </div>
                  </div>
                  <div className='panel-box-footer'>
                    <button className='btn btn-success' onClick={handleCreateUser}>Lưu lại</button>
                    <Link className='btn btn-default' to='/user'>Quay lại</Link>
                  </div>
                </div>
              </div>
            </div>
        );
    
}


export default Adduser;