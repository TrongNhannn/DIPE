import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";     
import { Link, useParams} from 'react-router-dom';

function Updateuser() {
        const MySwal = withReactContent(Swal)
        const [users, setUsers] = useState({});
        
        const _token = localStorage.getItem("_token");
        const { credential_string }  = useParams();
        const { unique_string, proxy } = useSelector( state => state );

        useEffect(() => {
          async function fetchData() {
            const response = await fetch(`${proxy}/api/${unique_string}/user/getall/${credential_string}`, {
                  headers: { 
                    "Authorization": _token, 
                },
                })
                const { data } = await response.json();
                setUsers(data[0]);
              }
              fetchData();
        }, [unique_string, credential_string]);

        
        const [oldpwd_string, setPasswordOld] = useState('');
        const [newpwd_string, setPasswordNew] = useState('');
      
        const handleUpdatePassUser = async(event) => {
          const url = '';
          const value = { credential_string ,oldpwd_string, newpwd_string };
          
          event.preventDefault();
          const response = await fetch(`${proxy}/${unique_string}/changepassword`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              "Authorization": _token, 
          },
            body: JSON.stringify(value)
          })
          const data = await response.json();
            if (data.success == true) {
              MySwal.fire({
                title: <strong>Cập nhật</strong>,
                text: data.content,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              })
            } else {
              MySwal.fire({
                title: <strong>Cập nhật</strong>,
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
                    <span className='panel-label-header'>Thay đổi mật khẩu người dùng</span>
                  </div>
                  <div className='panel-box-body'>
                    <div className='row'>
                    <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >Tên tài khoản</label>{'\u00A0'}
                        <input type='text' readOnly className='form-control pt-8' required defaultValue={users.account_string}/>
                      </div>
                      {/* <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >Mã định danh</label>
                        <input type='text' readOnly className='form-control pt-8' required defaultValue={users.credential_string}/>
                      </div> */}
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Mật khẩu cũ {'\u00A0'}</label>
                          <input type='password' className='form-control pt-8' value={oldpwd_string} onChange={(event) => setPasswordOld(event.target.value)} />
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Mật khẩu mới</label>
                          <input type='password' className='form-control pt-8' value={newpwd_string} onChange={(event) => setPasswordNew(event.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className='panel-box-footer'>
                    <button className='btn btn-success' onClick={handleUpdatePassUser}>Lưu lại</button>
                    <Link className='btn btn-default' to='/user'>Quay lại</Link>
                  </div>
                </div>
              </div>
            </div>
        );
    
}

export default Updateuser;