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
import { data } from 'jquery';

function Changeuser() {
        const MySwal = withReactContent(Swal)
        const [users, setUsers] = useState({});
        const { credential_string }  = useParams();
        const _token = localStorage.getItem("_token");
        const { unique_string, proxy } = useSelector( state => state );
        const [fullname, setFullName] = useState('');
        const [email, setEmail] = useState('');
        const [phone, setPhone] = useState('');
        const [address, setAddress] = useState('');
        

        useEffect(() => {
          async function fetchData() {
            const response = await fetch(`${proxy}/api/${unique_string}/user/getall/${credential_string}`, {
                  headers: { 
                    "Authorization": _token, 
                },
                })
                const { data } = await response.json();
                console.log(data)
                setUsers(data[0] != undefined ? data[0] : {});
              }
              fetchData();
          
        }, [unique_string, credential_string]);

      
        const handleUpdateUser = async(event) => {
          const value = { credential_string , fullname, email, phone, address };
          
          event.preventDefault();
          const response = await fetch(`${proxy}/api/${unique_string}/user/changeInfo`, {
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
                    <span className='panel-label-header'>Thay đổi thông tin người dùng</span>
                  </div>
                  <div className='panel-box-body'>
                    <div className='row'>
                        <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >Tên tài khoản</label>
                        <input type='text' readOnly className='form-control pt-8' required defaultValue={users.account_string}/>
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Họ và tên {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                          <input type='text' className='form-control pt-8' defaultValue={users.fullname}  onChange={(event) => setFullName(event.target.value)} />
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Email {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                          <input type='email' className='form-control pt-8' defaultValue={users.email} onChange={(event) => setEmail(event.target.value)} />
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Số điện thoại{'\u00A0'}{'\u00A0'}</label>
                          <input type='text' className='form-control pt-8' defaultValue={users.phone} onChange={(event) => setPhone(event.target.value)} />
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Địa chỉ{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                          <input type='text' className='form-control pt-8' defaultValue={users.address} onChange={(event) => setAddress(event.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className='panel-box-footer'>
                    <button className='btn btn-success' onClick={handleUpdateUser}>Lưu lại</button>
                    <Link className='btn btn-default' to='/user'>Quay lại</Link>
                  </div>
                </div>
              </div>
            </div>
        );
    
}

export default Changeuser;