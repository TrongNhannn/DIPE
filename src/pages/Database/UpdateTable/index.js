import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";     
import { Link, useParams } from 'react-router-dom';


function Updatetable() {
        const MySwal = withReactContent(Swal)
        const _token = localStorage.getItem("_token");
        const { unique_string, proxy } = useSelector( state => state );
        const [table_name, setTablename] = useState('');
        const [table, setTable] = useState({});
        const { table_id } = useParams();
      

        useEffect(() => {
          async function fetchData() {
            const response = await fetch(`${proxy}/api/${unique_string}/tables/table/${table_id}`, {
                  headers: { 
                    "Authorization": _token, 
                },
                })
                const { data } = await response.json();
                setTable(data);
              }
              fetchData();
        }, [unique_string]);

        const handleUpdateTable = async(event) => {
          
          const value = { table_id, table_name };
          
          event.preventDefault();
          const response = await fetch(`${proxy}/api/${unique_string}/tables/modify`, {
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
                    <span className='panel-label-header'>Cập nhật bảng {table.table_name}</span>
                  </div>
                  <div className='panel-box-body'>
                    <div className='row'>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >ID bảng {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                        <input type='text' className='form-control pt-8' required readOnly defaultValue={table_id}  ></input>
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Nhập tên bảng </label>
                        
                          <input type='text' className='form-control pt-8' defaultValue={table.table_name} onChange={(event) => setTablename(event.target.value)} ></input>
                        
                      </div>
                    </div>
                  </div>
                  <div className='panel-box-footer'>
                    <button className='btn btn-success' onClick={handleUpdateTable}>Lưu lại</button>
                    <Link className='btn btn-default' to={`/database/${table_id}`}>Quay lại</Link>
                  </div>
                </div>
              </div>
            </div>
        );
    
}


export default Updatetable;