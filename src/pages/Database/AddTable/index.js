import DatatableUI from '../DataTable'

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


function AddTable() {
        const MySwal = withReactContent(Swal)
        const _token = localStorage.getItem("_token");
        const { unique_string, proxy } = useSelector( state => state );
        const [table_name, setTablename] = useState('');
        const credential_string = localStorage.getItem("credential_string");
        // const [credential_string, setValue] = useState(null);

        // useEffect(() => {
        //     const valueFromLocalStorage = localStorage.getItem('credential_string');
        //     setValue(valueFromLocalStorage);
        // }, []);

        const handleCreateTable = async(event) => {
          const url = '';
          const value = { table_name, credential_string};
          
          event.preventDefault();
          const response = await fetch(`${proxy}/api/${unique_string}/tables/create`, {
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
              }).then(function(){ 
                window.location.reload();
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
            <DatatableUI />
    
            <div className='body-panel'>
              <div className='row'>
                <div className='panel-box'>
                  <div className='panel-box-header'>
                    <span className='panel-label-header'>Thêm mới bảng</span>
                  </div>
                  <div className='panel-box-body'>
                    <div className='row'>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >Tên bảng</label>
                        <input type='text' className='form-control pt-8' required value={table_name} onChange={(event) => setTablename(event.target.value)} ></input>
                      </div>
                    </div>
                  </div>
                  <div className='panel-box-footer'>
                    <button className='btn btn-success' onClick={handleCreateTable}>Lưu lại</button>
                    <Link className='btn btn-default' to={'/database'}>Quay lại</Link>
                  </div>
                </div>
              </div>
            </div>
            </div>
        );
    
}


export default AddTable;