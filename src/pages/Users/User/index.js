import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";     
import { faClone, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'



function User() {
        const [users, setUsers] = useState([]);
        const _token = localStorage.getItem("_token");
        const { unique_string, proxy } = useSelector( state => state );
        const MySwal = withReactContent(Swal)

        useEffect(() => {
                fetch(`${proxy}/api/${unique_string}/user/getall`, {
                  headers: { 
                    "Authorization": _token, 
                },
                })
                .then((response) => response.json())
                .then((data) => setUsers(data.data));
        }, [unique_string, proxy, _token]);


        const deleteRow = async (credential_string) => {
          const result = await Swal.fire({
            title: 'Xóa',
            text: 'Bạn có muốn xóa ',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'rgb(209, 72, 81)',
            cancelButtonColor: '#C1C1C1',
            reverseButtons: true
          });
          if (result.isConfirmed) {
            try {
              const response = await fetch(`${proxy}/api/${unique_string}/user/delete/${credential_string}`, {
                method: 'DELETE',
              });
              const data = await response.json();
              if (data.success == true) {
                MySwal.fire({
                  title: <strong>Xóa</strong>,
                  text: data.content,
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                }).then(function(){ 
                  window.location.reload();
              })
              } else {
                MySwal.fire({
                  title: <strong>Xóa</strong>,
                  text: data.content,
                  icon: 'error',
                  timer: 2000,
                  showConfirmButton: false,
                })
              }
            } catch (error) {
              console.error('There was a problem with the network:', error);
              Swal.fire('Oops...', 'Something went wrong!', 'error');
            }
          }
        };

          const renderButtons = (rowData) => {
            return (
              <React.Fragment>
                <Link title='Cập nhật mật khẩu' className='btn btn-outline green' to={`/user/update/${rowData.credential_string}`}><FontAwesomeIcon icon={faClone}/></Link>{'\u00A0'}
                <Link title='Cập nhật thông tin người dùng' className='btn btn-outline blue' to={`/user/change/${rowData.credential_string}`} ><FontAwesomeIcon icon={faPenToSquare}/></Link>{'\u00A0'}
                <a className='btn btn-outline red' title='Xóa'  onClick={() => deleteRow(rowData.credential_string)}><FontAwesomeIcon icon={faTrash}/></a>
                 <input type="hidden"  name="userId" value={rowData.credential_string} />
              </React.Fragment>
             
            );
          };

          const columns = [
            { field: 'account_string', header: 'Tên tài khoản' },
            { field: 'fullname', header: 'Họ và tên' },
            { field: 'email', header: 'Email' },
            { field: 'phone', header: 'Số điện thoại' },
            { field: 'account_role', header: 'Quyền' },
            { field: 'account_status', header: 'Trạng thái' },
            { body: renderButtons, header: 'Thao tác' }
          ];

        return (
            <div className='main-panel' scrollable="true">
              <div className='row'>
                <div className='panel-box'>
                  <div className='panel-box-header'>
                    <span className='panel-label-header'>Danh sách người dùng </span>
                    <div className='right-content'><Link className='btn btn-outline blue' to='/user/add'>Thêm mới</Link></div>
                  </div>
                  <div className='panel-box-body'>
                    <DataTable showGridlines
                        value={users}
                        scrollable
                        paginator
                        rows={10}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="Hiện {first} đến {last} của {totalRecords} kết quả" 
                    >
                        {columns.map((col, i) => (
                            <Column key={i} field={col.field} header={col.header} body={col.body} />
                        ))}   
                    </DataTable>
                  </div>
                </div>
              </div>
            </div>
        );
}

export default User;